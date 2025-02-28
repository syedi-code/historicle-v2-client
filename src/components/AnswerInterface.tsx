import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AnswerGrid, { AnswerOption } from './AnswerGrid';

interface Book {
  Author: string;
  AuthorURL: string;
  ISBN: string;
  NumScans: number;
  Title: string;
  YearWritten: number;
}

interface TriviaQuestion {
  questionText: string;
  questionType: string;
  answers: AnswerOption[];
}

interface AnswerInterfaceProps {
  dailyBook: Book;
  wrongBooks: Book[];
  questionOrder?: string[];
  roundIndex: number; // NEW prop to know which round we are in.
  onAnswerSubmit: (
    questionType: string,
    isCorrect: boolean,
    answerText: string,
    points: number,
    globalQuestionIndex: number
  ) => void;
  onGameComplete: () => void;
  triggerDeduction: (deduction: number, pos: { x: number; y: number }) => void;
}

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
`;

const WhitePill = styled.div`
  background-color: white;
  border: 2px solid black;
  border-radius: 50px; /* Adjust for pill shape */
  padding: 10px 20px;
  display: inline-block;
  margin-bottom: 20px;
`;

const HoverPill = styled(motion.div)`
  background-color: white;
  border: 2px solid black;
  border-radius: 50px;
  padding: 10px 20px;
  display: inline-block;
  margin-bottom: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: black;
    color: white;
  }

  @media (max-width: 600px) {
    padding: 6px 12px;
  }
`;

const Question = styled.h2`
  font-size: 36px;
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 800;
  margin: 0;
  word-wrap: break-word;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const AnswersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 1000px;
`;

const NavTextButton = styled(motion.span)<{ disabled?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: 800;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  position: relative;
  color: inherit; // Changed from hardcoded color to inherit
  font-size: 24px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  
  /* Grey out text when disabled, regardless of parent color */
  ${({ disabled }) => disabled && `
    color: #aaaaaa !important;
  `}
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: 6px; /* Closer to the parent text */
  left: 0;
  height: 2px; /* Thicker underline */
  width: 100%;
  background-color: black;
  transform-origin: center;
`;

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const buildQuestions = (
  dailyBook: Book | null,
  wrongBooks: Book[],
  questionOrder: string[]
): TriviaQuestion[] => {
  if (!dailyBook || wrongBooks.length === 0) return [];
  return questionOrder.map((q) => {
    switch (q) {
      case 'author':
        return {
          questionText: 'Who wrote this passage?',
          questionType: 'author',
          answers: shuffle([
            { text: dailyBook.Author, correct: true, url: dailyBook.AuthorURL },
            ...wrongBooks.map((b) => ({
              text: b.Author,
              correct: false,
              url: b.AuthorURL,
            })),
          ]),
        };
      case 'title':
        return {
          questionText: 'What is the title of this book?',
          questionType: 'title',
          answers: shuffle([
            { text: dailyBook.Title, correct: true },
            ...wrongBooks.map((b) => ({ text: b.Title, correct: false })),
          ]),
        };
      case 'year':
        return {
          questionText: 'What year was this written?',
          questionType: 'year',
          answers: shuffle([
            { text: String(dailyBook.YearWritten), correct: true },
            ...wrongBooks.map((b) => ({
              text: String(b.YearWritten),
              correct: false,
            })),
          ]),
        };
      default:
        return {
          questionText: '',
          questionType: '',
          answers: [],
        };
    }
  });
};

const AnswerInterface: React.FC<AnswerInterfaceProps> = ({
  dailyBook,
  wrongBooks,
  questionOrder = ['author', 'title', 'year'],
  roundIndex,
  onAnswerSubmit,
  onGameComplete,
  triggerDeduction,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [submissionKey, setSubmissionKey] = useState(0);
  const [questions, setQuestions] = useState<TriviaQuestion[]>(() =>
    buildQuestions(dailyBook, wrongBooks, questionOrder)
  );

  useEffect(() => {
    const qs = buildQuestions(dailyBook, wrongBooks, questionOrder);
    if (questions.length === 0 && qs.length > 0) {
      setQuestions(qs);
    }
  }, [dailyBook, wrongBooks, questionOrder, questions.length]);

  if (questions.length === 0) {
    return <p>Loading…</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isDisabled = selectedAnswerIndex === null;

  // Update handleSubmitOrNext function to use consistent deduction amounts
  const handleSubmitOrNext = () => {
    if (isDisabled || selectedAnswerIndex === null) return;

    const selectedAnswer = currentQuestion.answers[selectedAnswerIndex];
    const isCorrect = selectedAnswer.correct;
    const answerText = selectedAnswer.text;

    // Calculate the global question index
    const globalQuestionIndex = roundIndex * questionOrder.length + currentQuestionIndex;

    // Apply consistent scoring logic
    if (isCorrect) {
      onAnswerSubmit(currentQuestion.questionType, isCorrect, answerText, 0, globalQuestionIndex);
    } else {
      // Consistent -1000 points for wrong answers
      onAnswerSubmit(currentQuestion.questionType, isCorrect, answerText, -1000, globalQuestionIndex);
    }

    // Continue with the rest of the function...
    if (currentQuestionIndex === questions.length - 1) {
      onGameComplete();
    } else {
      setSubmissionKey((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <QuestionContainer>
      <WhitePill>
        <Question>{currentQuestion.questionText}</Question>
      </WhitePill>
      <AnswerGrid
        answers={currentQuestion.answers}
        questionType={currentQuestion.questionType}
        selectedIndex={selectedAnswerIndex}
        submissionKey={submissionKey}
        triggerDeduction={triggerDeduction}
        onSelectAnswer={(index) => setSelectedAnswerIndex(index)}
      />
      <br />
      <HoverPill 
        whileHover={{ scale: isDisabled ? 1 : 1.05 }}
        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
      >
        <NavTextButton
          onClick={handleSubmitOrNext}
          disabled={isDisabled}
        >
          {currentQuestionIndex === questions.length - 1 ? 'SUBMIT →' : 'NEXT →'}
        </NavTextButton>
      </HoverPill>
    </QuestionContainer>
  );
};

export default AnswerInterface;