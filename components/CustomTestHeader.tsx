"use client";

import React, { useEffect, useState } from 'react';
import DropdownSection from './DropdownSection';
import QuestionNavigation from '@/components/create-test/QuestionNavigation';
import QuestionControls from '@/components/create-test/QuestionControls';
import { useDropdowns } from '@/utils/hooks/useDropdowns';
import { useCustomTestStore } from '@/store/useCustomTestStore';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { Question, QuestionType } from '@/utils/types';

const CustomTestHeader: React.FC = () => {
  const {
    selection,
    standards,
    subjects,
    chapters,
    exercises,
    isAnyLoading,
    errorMessages,
    handleSelect,
    handleAddOption,
  } = useDropdowns();

  const {
    questions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    deleteQuestion,
    addDefaultQuestion,
    isEditing,
    setIsEditing,
  } = useCustomTestStore();

  const searchParams = useSearchParams();
  const questionIndexParam = searchParams.get('question');
  const router = useRouter();
  const [initError, setInitError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Helper function to validate a single question.
  const validateQuestion = (question: Question): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    if (!question.questionText || !question.questionText.trim()) {
      errors.questionText = "Question text is required.";
    }
    if (question.questionType === QuestionType.MCQ) {
      question.options.forEach((option, index) => {
        if (!option || !option.trim()) {
          errors[`option_${index}`] = `Option ${index + 1} is required.`;
        }
      });
      if (
        !question.correctAnswer ||
        !question.options.includes(question.correctAnswer)
      ) {
        errors.correctAnswer = "Please select a valid correct answer.";
      }
    }
    // (Add validations for other question types if needed.)
    return errors;
  };

  useEffect(() => {
    if (questionIndexParam !== null) {
      let index = Number(questionIndexParam);
      if (!isNaN(index)) {
        if (index >= questions.length) {
          index = 0;
          setSelectedQuestionIndex(0);
          router.replace(`?question=0`);
        } else {
          setSelectedQuestionIndex(index);
        }
      }
    }
  }, [questionIndexParam, questions.length, router, setSelectedQuestionIndex]);

  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
    router.push(`?question=${index}`);
  };

  const handleAddQuestionClick = () => {
    addDefaultQuestion();
    setIsEditing(true);
    const newIndex = questions.length;
    setSelectedQuestionIndex(newIndex);
    router.push(`?question=${newIndex}`);
  };

  // Single toggle handler for edit/save button.
  const handleToggleEdit = () => {
    if (isEditing) {
      // Save action: run validation before turning off editing.
      const currentQuestion = questions[selectedQuestionIndex];
      const errors = validateQuestion(currentQuestion);
      if (Object.keys(errors).length > 0) {
        // You can either show errors inline or aggregate them in a toast.
        const errorMessage = Object.values(errors).join(' ');
        showToast(`Validation Error: ${errorMessage}`, 'error');
        return; // Do not exit editing mode if validation fails.
      }
      // If validation passes, disable editing and show success.
      setIsEditing(false);
      showToast('Question saved successfully', 'success');
    } else {
      // Edit action: enable editing.
      setIsEditing(true);
      showToast('Editing enabled', 'info');
    }
  };

  const handleDeleteQuestion = () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(selectedQuestionIndex);
      const newIndex = selectedQuestionIndex > 0 ? selectedQuestionIndex - 1 : 0;
      setSelectedQuestionIndex(newIndex);
      router.push(`?question=${newIndex}`);
      showToast('Question deleted successfully', 'success');
    }
  };

  // Optionally, you can validate all questions before creating the test.
  const handleCreateTest = () => {
    let allValid = true;
    let aggregatedErrors: string[] = [];
    questions.forEach((question, index) => {
      const errors = validateQuestion(question);
      if (Object.keys(errors).length > 0) {
        allValid = false;
        aggregatedErrors.push(`Q${index + 1}: ${Object.values(errors).join(', ')}`);
      }
    });
    if (!allValid) {
      showToast(`Test creation failed. ${aggregatedErrors.join(' | ')}`, 'error');
      return;
    }
    // Proceed with test creation if validation passes.
    console.log('Create test clicked');
    console.log(questions);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <DropdownSection
        isAnyLoading={isAnyLoading}
        skeletonPlaceholders={['skel-1', 'skel-2', 'skel-3', 'skel-4']}
        standards={standards}
        subjects={subjects}
        chapters={chapters}
        exercises={exercises}
        selection={selection}
        handleSelect={handleSelect}
        handleAddOption={handleAddOption}
        errorMessages={errorMessages}
      />
      <div className="flex flex-col w-full md:w-1/2">
        <QuestionNavigation
          questions={questions}
          selectedQuestionIndex={selectedQuestionIndex}
          onSelectQuestion={handleQuestionSelect}
          onAddQuestion={handleAddQuestionClick}
          selectionExercise={!!selection.exercise}
        />
        <QuestionControls
          isEditing={isEditing}
          onToggleEdit={handleToggleEdit}
          onDelete={handleDeleteQuestion}
          onCreateTest={handleCreateTest}
        />
        {initError && <div className="mt-2 text-red-500 text-sm">{initError}</div>}
      </div>
    </div>
  );
};

export default CustomTestHeader;
