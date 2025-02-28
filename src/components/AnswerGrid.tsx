import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Answer from './Answer';

const AnswersGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(400px, 1fr));
  gap: 20px;
  margin: 0 auto;
  justify-items: stretch;
  align-items: center;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }
`;

export interface AnswerOption {
  text: string;
  correct: boolean;
  url?: string;
}

interface AnswerGridProps {
  answers: AnswerOption[];
  questionType: string;
  selectedIndex: number | null;
  submissionKey: number;
  triggerDeduction: (deduction: number, pos: { x: number; y: number }) => void;
  onSelectAnswer: (index: number) => void;
}

const AnswerGrid: React.FC<AnswerGridProps> = ({
  answers,
  questionType,
  selectedIndex,
  submissionKey,
  triggerDeduction,
  onSelectAnswer,
}) => (
  <AnswersGridContainer>
    {answers.map((ans, index) => (
      <motion.div
        key={`${index}-${submissionKey}`}
        onClick={() => onSelectAnswer(index)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
      >
        <Answer
          text={ans.text}
          infoLink={questionType === 'author' ? ans.url : undefined}
          isSelected={selectedIndex === index}
          answerSubmittedKey={submissionKey}
          onInfoClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            triggerDeduction(250, { x: e.clientX, y: e.clientY });
            if (ans.url) {
              window.open(ans.url, '_blank', 'noopener,noreferrer');
            }
          }}
        />
      </motion.div>
    ))}
  </AnswersGridContainer>
);

export default AnswerGrid;