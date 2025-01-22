// File: src/components/TestHeader.tsx

"use client";

import React, { useCallback, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import Image from "next/image";
import { QuestionType, Question, DropdownItem } from "@/utils/types";
import { useQuestions } from "@/context/QuestionsContext";
import { useSelection } from "@/context/SelectionContext";
import { Skeleton } from "@mui/material";
import { v4 as uuidv4 } from "uuid"; // Ensure uuid and @types/uuid are installed
import { useToast } from "@/components/ui/ToastProvider";

// -------------- Types for API Responses --------------
interface StandardResponse {
  classes: Array<{ _id: string; standardName: string }>;
}

interface SubjectResponse {
  standard_related_subjects: Array<{ _id: string; subjectName: string }>;
}

interface ChapterResponse {
  subject_related_chapters: Array<{ _id: string; title: string }>;
}

interface ExerciseResponse {
  chapter_related_exercise: Array<{ _id: string; title: string }>;
}

interface QuestionResponse {
  exercise_related_questions: Array<{ _id: string } & Question>; // Assuming backend sends _id and other question fields
}

interface AddOptionResponse {
  _id: string;
  subjectId?: string;
  chapterId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// -------------- A small utility for fetch calls --------------
async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options });
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `Fetch failed with status: ${response.status} - ${errorMessage}`
    );
  }
  return response.json() as Promise<T>;
}

export default function TestHeader() {
  const {
    questions,
    setQuestions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    isEditing,
    setIsEditing,
  } = useQuestions();

  const { selection, setSelection } = useSelection();

  const { showToast } = useToast();

  // -------------------- Dropdown Items --------------------
  const [classOptions, setClassOptions] = useState<DropdownItem[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<DropdownItem[]>([]);
  const [chapterOptions, setChapterOptions] = useState<DropdownItem[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<DropdownItem[]>([]);

  // -------------------- Loading & Error States --------------------
  const [loading, setLoading] = useState({
    standards: false,
    subjects: false,
    chapters: false,
    exercises: false,
    questions: false,
  });
  const [error, setError] = useState({
    standards: null as string | null,
    subjects: null as string | null,
    chapters: null as string | null,
    exercises: null as string | null,
    questions: null as string | null,
  });

  // -------------------- Helper to safely set loading/error states --------------------
  const updateLoading = useCallback(
    (key: keyof typeof loading, value: boolean) => {
      setLoading((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateError = useCallback(
    (key: keyof typeof error, value: string | null) => {
      setError((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // -------------------- Add a new question locally --------------------
  const handleAddQuestion = useCallback(
    (exerciseId: string, replace: boolean = false) => {
      const newQuestion: Question = {
        id: uuidv4(), // Unique ID
        standardId: selection.standard!,
        subjectId: selection.subject!,
        chapterId: selection.chapter!,
        exerciseId: exerciseId, // Use the passed exerciseId
        questionText: "",
        questionType: QuestionType.MCQ,
        answerFormat: "SINGLE_CHOICE",
        options: ["", "", "", ""],
        correctAnswer: null,
        description: "",
        image: null,
        imageOptions: [null, null, null, null],
      };
      if (replace) {
        setQuestions([newQuestion]); // Reset to only the new question
        setSelectedQuestionIndex(0);
      } else {
        setQuestions([...questions, newQuestion]); // Append the new question
        setSelectedQuestionIndex(questions.length);
      }

      // Optionally, display a success message or notification
      showToast("A new question draft has been added.", "success");
    },
    [questions, setQuestions, setSelectedQuestionIndex, selection, showToast]
  );

  // -------------------- Fetch Questions by Exercise --------------------
  const fetchQuestions = useCallback(
    async (exerciseId: string): Promise<void> => {
      updateLoading("questions", true);
      updateError("questions", null);

      try {
        const data = await fetchData<QuestionResponse>(
          "/api/questions/get-question",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exerciseId }),
          }
        );

        // Map backend '_id' to frontend 'id'
        const mappedQuestions: Question[] = data.exercise_related_questions.map(
          (q) => ({
            ...q,
            id: q._id, // Map '_id' to 'id'
            _id: undefined, // Remove '_id' if necessary
          })
        );

        if (mappedQuestions.length === 0) {
          // No questions found, reset to a default question
          handleAddQuestion(exerciseId, true); // Pass 'true' to replace existing questions
        } else {
          setQuestions(mappedQuestions);
          setSelectedQuestionIndex(0);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        showToast("Failed to load questions.", "warning");
        updateError("questions", "Failed to load questions.");
      } finally {
        updateLoading("questions", false);
      }
    },
    [
      updateLoading,
      updateError,
      handleAddQuestion,
      setQuestions,
      setSelectedQuestionIndex,
      showToast,
    ]
  );

  // -------------------- Fetch Exercises by Chapter --------------------
  const fetchExercises = useCallback(
    async (chapterId: string): Promise<void> => {
      updateLoading("exercises", true);
      updateError("exercises", null);

      try {
        const data = await fetchData<ExerciseResponse>(
          "/api/exercises/get-exercise",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chapterId }),
          }
        );

        const options = data.chapter_related_exercise.map(
          (exercise: { _id: string; title: string }) => ({
            id: exercise._id,
            name: exercise.title,
          })
        );
        setExerciseOptions(options);

        // Automatically select the first exercise and fetch dependent data
        if (options.length > 0) {
          const firstOption = options[0].id;
          setSelection((prev) => ({ ...prev, exercise: firstOption }));

          fetchQuestions(firstOption);
        } else {
          // If no exercises, clear downstream selections
          setSelection((prev) => ({ ...prev, exercise: null }));

          setExerciseOptions([]);

          const newQuestion: Question = {
            id: uuidv4(), // Unique ID
            standardId: selection.standard!,
            subjectId: selection.subject!,
            chapterId: selection.chapter!,
            exerciseId: selection.exercise!,
            questionText: "",
            questionType: QuestionType.MCQ,
            answerFormat: "Single Choice",
            options: ["", "", "", ""],
            correctAnswer: null,
            description: "",
            image: null,
            imageOptions: [null, null, null, null],
          };

          setQuestions([newQuestion]); // Reset to only the new question
          setSelectedQuestionIndex(0);
        }
      } catch (err) {
        console.error("Error fetching exercises:", err);
        updateError("exercises", "Failed to load exercises.");
      } finally {
        updateLoading("exercises", false);
      }
    },
    [
      updateLoading,
      updateError,
      fetchQuestions,
      setSelection,
      selection,
      setQuestions,
      setSelectedQuestionIndex,
    ]
  );

  // -------------------- Fetch Chapters by Subject --------------------
  const fetchChapters = useCallback(
    async (subjectId: string): Promise<void> => {
      updateLoading("chapters", true);
      updateError("chapters", null);

      try {
        const data = await fetchData<ChapterResponse>(
          "/api/chapters/get-chapter",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subjectId }),
          }
        );

        const options = data.subject_related_chapters.map(
          (chapter: { _id: string; title: string }) => ({
            id: chapter._id,
            name: chapter.title,
          })
        );
        setChapterOptions(options);

        // Automatically select the first chapter and fetch dependent data
        if (options.length > 0) {
          const firstOption = options[0].id;
          setSelection((prev) => ({ ...prev, chapter: firstOption }));
          fetchExercises(firstOption);
        } else {
          // If no chapters, clear downstream selections
          setSelection((prev) => ({ ...prev, chapter: null, exercise: null }));
          setExerciseOptions([]);

          const newQuestion: Question = {
            id: uuidv4(), // Unique ID
            standardId: selection.standard!,
            subjectId: selection.subject!,
            chapterId: selection.chapter!,
            exerciseId: selection.exercise!,
            questionText: "",
            questionType: QuestionType.MCQ,
            answerFormat: "Single Choice",
            options: ["", "", "", ""],
            correctAnswer: null,
            description: "",
            image: null,
            imageOptions: [null, null, null, null],
          };

          setQuestions([newQuestion]); // Reset to only the new question
          setSelectedQuestionIndex(0);
        }
      } catch (err) {
        console.error("Error fetching chapters:", err);
        updateError("chapters", "Failed to load chapters.");
      } finally {
        updateLoading("chapters", false);
      }
    },
    [
      updateLoading,
      updateError,
      fetchExercises,
      setSelection,
      selection,
      setQuestions,
      setSelectedQuestionIndex,
    ]
  );

  // -------------------- Fetch Subjects by Standard --------------------
  const fetchSubjects = useCallback(
    async (standardId: string): Promise<void> => {
      updateLoading("subjects", true);
      updateError("subjects", null);

      try {
        const data = await fetchData<SubjectResponse>(
          "/api/subject/get-subject",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ standardId }),
          }
        );

        const options = data.standard_related_subjects.map(
          (sub: { _id: string; subjectName: string }) => ({
            id: sub._id,
            name: sub.subjectName,
          })
        );
        setSubjectOptions(options);

        // Automatically select the first subject and fetch dependent data
        if (options.length > 0) {
          const firstOption = options[0].id;
          setSelection((prev) => ({ ...prev, subject: firstOption }));
          fetchChapters(firstOption);
        } else {
          // If no subjects, clear downstream selections
          setSelection((prev) => ({
            ...prev,
            subject: null,
            chapter: null,
            exercise: null,
          }));
          setChapterOptions([]);
          setExerciseOptions([]);

          const newQuestion: Question = {
            id: uuidv4(), // Unique ID
            standardId: selection.standard!,
            subjectId: selection.subject!,
            chapterId: selection.chapter!,
            exerciseId: selection.exercise!,
            questionText: "",
            questionType: QuestionType.MCQ,
            answerFormat: "Single Choice",
            options: ["", "", "", ""],
            correctAnswer: null,
            description: "",
            image: null,
            imageOptions: [null, null, null, null],
          };

          setQuestions([newQuestion]); // Reset to only the new question
          setSelectedQuestionIndex(0);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        updateError("subjects", "Failed to load subjects.");
      } finally {
        setLoading((prev) => ({ ...prev, subjects: false }));
        setLoading((prev) => ({ ...prev, subjects: false }));
        updateLoading("subjects", false);
      }
    },
    [
      updateLoading,
      updateError,
      fetchChapters,
      setSelection,
      selection,
      setQuestions,
      setSelectedQuestionIndex,
    ]
  );

  // -------------------- Handle Selection & Chaining Fetches --------------------
  const handleSelect = useCallback(
    async (
      value: string | number,
      dropdownKey: keyof Selection
    ): Promise<void> => {
      // Confirm unsaved changes
      if (isEditing) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to change this dropdown option?"
        );
        if (!confirmLeave) return;
      }

      // Update the selection with reset for dependent fields
      setSelection((prev) => {
        const updated: Selection = { ...prev, [dropdownKey]: value };
        if (dropdownKey === "standard") {
          updated.subject = null;
          updated.chapter = null;
          updated.exercise = null;
        }
        if (dropdownKey === "subject") {
          updated.chapter = null;
          updated.exercise = null;
        }
        if (dropdownKey === "chapter") {
          updated.exercise = null;
        }
        return updated;
      });

      // Immediately reset the dependent dropdowns & errors to avoid stale data
      if (dropdownKey === "standard") {
        setSubjectOptions([]);
        setChapterOptions([]);
        setExerciseOptions([]);
        updateError("subjects", null);
        updateError("chapters", null);
        updateError("exercises", null);
        fetchSubjects(String(value));
      } else if (dropdownKey === "subject") {
        setChapterOptions([]);
        setExerciseOptions([]);
        updateError("chapters", null);
        updateError("exercises", null);
        fetchChapters(String(value));
      } else if (dropdownKey === "chapter") {
        setExerciseOptions([]);
        updateError("exercises", null);
        fetchExercises(String(value));
      } else if (dropdownKey === "exercise") {
        fetchQuestions(String(value));
      }

      // Reset question index to the first question
      setSelectedQuestionIndex(0);
      // Mark editing false, since user changed context
      setIsEditing(false);
    },
    [
      isEditing,
      setSelection,
      fetchSubjects,
      fetchChapters,
      fetchExercises,
      fetchQuestions,
      setSelectedQuestionIndex,
      setIsEditing,
      updateError,
    ]
  );

  // -------------------- Handle Adding New Options via Dropdown --------------------
  const handleAddOption = useCallback(
    async (
      newOptionName: string,
      dropdownKey: "chapter" | "exercise" | "subject" | "standard"
    ): Promise<void> => {
      let apiEndpoint = "";
      let payload: any = {};
      if (dropdownKey === "chapter") {
        apiEndpoint = "/api/chapters";
        payload = {
          subjectId: selection.subject,
          title: newOptionName,
          description: "",
        };
      } else if (dropdownKey === "exercise") {
        apiEndpoint = "/api/exercises";
        payload = {
          title: newOptionName,
          description: "New Exercise Description",
          chapterId: selection.chapter,
        };
      } else if (dropdownKey === "subject") {
        apiEndpoint = "/api/subject";
        payload = {
          subjectName: newOptionName,
          description: `Subject for ${selection.standard}`,
          standardId: selection.standard,
        };
      } else if (dropdownKey === "standard") {
        apiEndpoint = "/api/standard";
        payload = {
          standardName: newOptionName,
          description: `This is the standard for students in grade ${newOptionName}`,
        };
      } else {
        console.error(`Unsupported dropdownKey: ${dropdownKey}`);
        return;
      }

      try {
        await fetchData<AddOptionResponse>(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // Refetch the updated list of options
        if (dropdownKey === "chapter") {
          await fetchChapters(selection.subject!);
        } else if (dropdownKey === "exercise") {
          await fetchExercises(selection.chapter!);
        } else if (dropdownKey === "subject") {
          await fetchSubjects(selection.standard!);
        } else if (dropdownKey === "standard") {
          await fetchStandards(); // Need to define fetchStandards
        }

        showToast(`New ${dropdownKey} added successfully!`, "success");
      } catch (error) {
        console.error(`Error adding new ${dropdownKey}:`, error);
        showToast(`Failed to add new ${dropdownKey}.`, "error");
      }
    },
    [
      selection.chapter,
      selection.subject,
      selection.standard,
      fetchSubjects,
      fetchChapters,
      fetchExercises,
      showToast,
    ]
  );

  // -------------------- Fetch Standards on Mount --------------------
  useEffect(() => {
    const fetchStandards = async (): Promise<void> => {
      updateLoading("standards", true);
      updateError("standards", null);

      try {
        const data = await fetchData<StandardResponse>("/api/standard");
        const options = data.classes.map(
          (cls: { _id: string; standardName: string }) => ({
            id: cls._id,
            name: cls.standardName,
          })
        );
        setClassOptions(options);

        // Automatically select the first standard and fetch dependent data
        if (options.length > 0) {
          const firstOption = options[0].id;
          setSelection((prev) => ({ ...prev, standard: firstOption }));
          handleSelect(firstOption, "standard");
        } else {
          // If no standards, clear all selections
          setSelection({
            standard: null,
            subject: null,
            chapter: null,
            exercise: null,
          });
          setSubjectOptions([]);
          setChapterOptions([]);
          setExerciseOptions([]);
          setQuestions([]);
          setSelectedQuestionIndex(0);
        }
      } catch (err) {
        console.error("Error fetching standards:", err);
        updateError("standards", "Failed to load standards.");
      } finally {
        updateLoading("standards", false);
      }
    };

    fetchStandards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // -------------------- Derived States & Render Logic --------------------
  const isAnyLoading = Object.values(loading).some(Boolean);

  // Flatten out non-null errors for display
  const errorMessages = Object.values(error).filter(Boolean) as string[];

  return (
    <div className="text-white rounded-lg">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Left Section: Dropdowns and Header */}
        <div className="flex flex-col items-center p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2">
          {/* Header */}
          <div className="flex items-center justify-center w-full text-center gap-8">
            <Image
              src="/test-paper.png"
              alt="test-paper"
              width={70}
              height={70}
            />
            <h1 className="text-7xl rozha-one-regular">चाचणी तयार करा</h1>
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap justify-between w-full mr-3 ml-3 gap-2">
            {isAnyLoading ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Skeleton placeholders */}
                <Skeleton
                  sx={{ bgcolor: "#a6b1ff" }}
                  variant="rectangular"
                  width="100%"
                  height={56}
                  className="rounded-[20px]"
                  animation="wave"
                />
                <Skeleton
                  sx={{ bgcolor: "#a6b1ff" }}
                  variant="rectangular"
                  width="100%"
                  height={56}
                  className="rounded-[20px]"
                  animation="wave"
                />
                <Skeleton
                  sx={{ bgcolor: "#a6b1ff" }}
                  variant="rectangular"
                  width="100%"
                  height={56}
                  className="rounded-[20px]"
                  animation="wave"
                />
                <Skeleton
                  sx={{ bgcolor: "#a6b1ff" }}
                  variant="rectangular"
                  width="100%"
                  height={56}
                  className="rounded-[20px]"
                  animation="wave"
                />
              </div>
            ) : (
              <>
                {/* Standard Dropdown */}
                <Dropdown
                  isDynamic
                  id="standard-dropdown"
                  items={classOptions}
                  label="इयत्ता:"
                  selected={selection.standard ?? undefined}
                  buttonBgColor="bg-[#fc708a]"
                  buttonBorderColor="border-white"
                  buttonBorderWidth="border-[2px]"
                  onSelect={(val: string | number) =>
                    handleSelect(val, "standard")
                  }
                  className="sm:w-[48%]"
                  disabled={loading.standards}
                  allowAddOption={true}
                  allowAddOptionText="Add Standard"
                  onAddOption={(newOptionName: string) =>
                    handleAddOption(newOptionName, "standard")
                  }
                />

                {/* Subject Dropdown */}
                <Dropdown
                  isDynamic
                  id="subject-dropdown"
                  items={subjectOptions}
                  label="विषय:"
                  selected={selection.subject ?? undefined}
                  buttonBgColor="bg-[#fc708a]"
                  buttonBorderColor="border-white"
                  buttonBorderWidth="border-[2px]"
                  onSelect={(val: string | number) =>
                    handleSelect(val, "subject")
                  }
                  className="sm:w-[48%]"
                  disabled={!selection.standard || loading.subjects}
                  allowAddOption={true}
                  allowAddOptionText="Add Subject"
                  onAddOption={(newOptionName: string) =>
                    handleAddOption(newOptionName, "subject")
                  }
                />

                {/* Chapter Dropdown */}
                <Dropdown
                  isDynamic
                  id="chapter-dropdown"
                  items={chapterOptions}
                  label="धडा:"
                  selected={selection.chapter ?? undefined}
                  buttonBgColor="bg-[#fc708a]"
                  buttonBorderColor="border-white"
                  buttonBorderWidth="border-[2px]"
                  onSelect={(val: string | number) =>
                    handleSelect(val, "chapter")
                  }
                  className="sm:w-[48%]"
                  disabled={!selection.subject || loading.chapters}
                  allowAddOption={true}
                  allowAddOptionText="Add Chapter"
                  onAddOption={(newOptionName: string) =>
                    handleAddOption(newOptionName, "chapter")
                  }
                />

                {/* Exercise Dropdown */}
                <Dropdown
                  isDynamic
                  id="exercise-dropdown"
                  items={exerciseOptions}
                  label="अभ्यास:"
                  selected={selection.exercise ?? undefined}
                  buttonBgColor="bg-[#fc708a]"
                  buttonBorderColor="border-white"
                  buttonBorderWidth="border-[2px]"
                  onSelect={(val: string | number) =>
                    handleSelect(val, "exercise")
                  }
                  className="sm:w-[48%]"
                  disabled={!selection.chapter || loading.exercises}
                  allowAddOption={true}
                  allowAddOptionText="Add Exercise"
                  onAddOption={(newOptionName: string) =>
                    handleAddOption(newOptionName, "exercise")
                  }
                />
              </>
            )}
          </div>

          {/* Error & No Option Messages */}
          {errorMessages.length > 0 && (
            <div className="mt-2">
              {errorMessages.map((msg) => (
                <div key={msg} className="text-red-500 text-sm">
                  {msg}
                </div>
              ))}
            </div>
          )}

          {/* Messages for empty data (when not loading) */}
          {!isAnyLoading &&
            selection.standard &&
            subjectOptions.length === 0 && (
              <div className="mt-2 text-yellow-500 text-sm">
                No subjects available for the selected standard.
              </div>
            )}
          {!isAnyLoading &&
            selection.subject &&
            chapterOptions.length === 0 && (
              <div className="mt-2 text-yellow-500 text-sm">
                No chapters available for the selected subject.
              </div>
            )}
          {!isAnyLoading &&
            selection.chapter &&
            exerciseOptions.length === 0 && (
              <div className="mt-2 text-yellow-500 text-sm">
                No exercises available for the selected chapter.
              </div>
            )}
        </div>

        {/* Right Section: Question Navigation */}
        <div className="flex flex-col p-4 rounded-lg shadow bg-[#6378fd] w-full md:w-1/2 ">
          <div className="grid grid-cols-7 gap-4 p-4">
            {questions.map((question, index) => (
              <button
                key={question.id} // Use unique id instead of index
                className={`flex pt-1 laila-semibold items-center justify-center ${
                  selectedQuestionIndex === index
                    ? "bg-green-400"
                    : "bg-[#a6b1ff]"
                } w-10 h-10 text-white rounded-full font-bold`}
                onClick={() => setSelectedQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="flex items-center justify-center bg-[#a6b1ff] w-10 h-10 rounded-full"
              onClick={() => handleAddQuestion(selection.exercise!)}
              disabled={!selection.exercise}
              title={
                !selection.exercise
                  ? "Select an exercise first"
                  : "Add Question"
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 44 44"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.098 43.3068V0.147724H24.9276V43.3068H19.098ZM0.416193 24.625V18.8295H43.6094V24.625H0.416193Z" />
              </svg>
            </button>
          </div>

          {/* Error for Questions */}
          {error.questions && (
            <div className="mt-2 text-red-500 text-sm">{error.questions}</div>
          )}
        </div>
      </div>
    </div>
  );
}
