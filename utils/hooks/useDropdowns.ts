// File: src/hooks/useDropdowns.ts

import { useEffect, useCallback } from 'react';
import { useSelectionStore, Selection } from '@/store/useSelectionStore';
import { useStandardStore } from '@/store/useStandardStore';
import { useSubjectStore } from '@/store/useSubjectStore';
import { useChapterStore } from '@/store/useChapterStore';
import { useExerciseStore } from '@/store/useExerciseStore';
import { useQuestionStore } from '@/store/useQuestionStore';
import { useToast } from '@/components/ui/ToastProvider';

export const useDropdowns = () => {
  const { selection, setSelection, resetSelection, } = useSelectionStore();

  // Standard Store
  const {
    standards,
    loading: loadingStandards,
    error: errorStandards,
    fetchStandards,
  } = useStandardStore();

  // Subject Store
  const {
    subjects,
    loading: loadingSubjects,
    error: errorSubjects,
    fetchSubjects,
  } = useSubjectStore();

  // Chapter Store
  const {
    chapters,
    loading: loadingChapters,
    error: errorChapters,
    fetchChapters,
  } = useChapterStore();

  // Exercise Store
  const {
    exercises,
    loading: loadingExercises,
    error: errorExercises,
    fetchExercises,
  } = useExerciseStore();

  // Question Store
  const {
    questions,
    selectedQuestionIndex,
    loading: loadingQuestions,
    error: errorQuestions,
    fetchQuestions,
    addQuestion,
    setSelectedQuestionIndex,
    resetQuestions
  } = useQuestionStore();

  const { showToast } = useToast();

  // Fetch standards on mount
  useEffect(() => {
    fetchStandards();
  }, [fetchStandards]);

  // Fetch subjects when standard changes
  useEffect(() => {
    if (selection.standard) {
      fetchSubjects();
    } else {
      // Reset dependent selections if standard is deselected
      setSelection({ subject: null, chapter: null, exercise: null });
    }
  }, [selection.standard, fetchSubjects, setSelection]);

  // Fetch chapters when subject changes
  useEffect(() => {
    if (selection.subject) {
      fetchChapters();
    } else {
      // Reset dependent selections if subject is deselected
      setSelection({ chapter: null, exercise: null });
    }
  }, [selection.subject, fetchChapters, setSelection]);

  // Fetch exercises when chapter changes
  useEffect(() => {
    if (selection.chapter) {
      fetchExercises();
    } else {
      // Reset dependent selection if chapter is deselected
      setSelection({ exercise: null });
    }
  }, [selection.chapter, fetchExercises, setSelection]);

  // Fetch questions when exercise changes
  useEffect(() => {
    if (selection.exercise) {
      fetchQuestions();
    } else {
      resetQuestions();
    }
  }, [selection.exercise, fetchQuestions,resetQuestions]);

  // Handle selection changes
  const handleSelect = useCallback(
    (value: string | number, dropdownKey: keyof Selection) => {
      // Reset dependent selections when a higher-level selection changes
      switch (dropdownKey) {
        case 'standard':
          setSelection({ standard: value, subject: null, chapter: null, exercise: null });
          break;
        case 'subject':
          setSelection({ subject: value, chapter: null, exercise: null });
          break;
        case 'chapter':
          setSelection({ chapter: value, exercise: null });
          break;
        case 'exercise':
          setSelection({ exercise: value });
          break;
        default:
          setSelection({ [dropdownKey]: value });
      }
    },
    [setSelection]
  );

  // Handle adding new options
  const handleAddOption = useCallback(
    async (newOptionName: string, dropdownKey: keyof Selection) => {
      let apiEndpoint = '';
      let payload: any = {};

      switch (dropdownKey) {
        case 'standard':
          apiEndpoint = '/api/standard';
          payload = {
            standardName: newOptionName,
            description: `This is the standard for students in grade ${newOptionName}`,
          };
          break;
        case 'subject':
          if (!selection.standard) {
            showToast('Please select a standard before adding a subject.', 'warning');
            return;
          }
          apiEndpoint = '/api/subject';
          payload = {
            subjectName: newOptionName,
            description: `Subject for ${selection.standard}`,
            standardId: selection.standard,
          };
          break;
        case 'chapter':
          if (!selection.subject) {
            showToast('Please select a subject before adding a chapter.', 'warning');
            return;
          }
          apiEndpoint = '/api/chapters';
          payload = {
            subjectId: selection.subject,
            title: newOptionName,
            description: '',
          };
          break;
        case 'exercise':
          if (!selection.chapter) {
            showToast('Please select a chapter before adding an exercise.', 'warning');
            return;
          }
          apiEndpoint = '/api/exercises';
          payload = {
            title: newOptionName,
            description: 'New Exercise Description',
            chapterId: selection.chapter,
          };
          break;
        default:
          console.error(`Unsupported dropdownKey: ${dropdownKey}`);
          return;
      }

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Fetch failed with status: ${response.status} - ${errorMessage}`);
        }

        // Refetch relevant data after adding a new option
        switch (dropdownKey) {
          case 'standard':
            await fetchStandards();
            break;
          case 'subject':
            await fetchSubjects();
            break;
          case 'chapter':
            await fetchChapters();
            break;
          case 'exercise':
            await fetchExercises();
            break;
        }

        showToast(`New ${dropdownKey} added successfully!`, 'success');
      } catch (error) {
        console.error(`Error adding new ${dropdownKey}:`, error);
        showToast(`Failed to add new ${dropdownKey}.`, 'error');
      }
    },
    [
      selection.standard,
      selection.subject,
      selection.chapter,
      fetchStandards,
      fetchSubjects,
      fetchChapters,
      fetchExercises,
      showToast,
    ]
  );

  // Handle adding a new question (specific to TestHeader)
  const handleAddQuestion = useCallback(() => {
    if (selection.exercise) {
      addQuestion(selection.exercise, false);
      showToast('A new question draft has been added.', 'success');
    } else {
      showToast('Select an exercise first.', 'warning');
    }
  }, [addQuestion, selection.exercise, showToast]);

  const isAnyLoading =
    loadingStandards || loadingSubjects || loadingChapters || loadingExercises || loadingQuestions;
  const errorMessages = [
    errorStandards,
    errorSubjects,
    errorChapters,
    errorExercises,
    errorQuestions,
  ].filter(Boolean) as string[];

  return {
    selection,
    standards,
    subjects,
    chapters,
    exercises,
    questions,
    selectedQuestionIndex,
    isAnyLoading,
    errorMessages,
    handleSelect,
    handleAddOption,
    handleAddQuestion,
    setSelectedQuestionIndex,
    resetSelection, 
  };
};
