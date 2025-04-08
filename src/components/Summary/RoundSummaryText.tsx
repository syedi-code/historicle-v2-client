//// filepath: /e:/GitHub/historicle-v2/client/src/components/RoundSummaryText.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CorrectAnswers {
  author: string;
  title: string;
  year: string;
}

export interface RoundSummaryTextProps {
  roundNumber: number;
  genre: string;
  correctAnswers: CorrectAnswers;
  userAnswers: {
    author?: { answer: string; correct: boolean };
    title?: { answer: string; correct: boolean };
    year?: { answer: string; correct: boolean };
  };
}

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const InfoText = styled.p`
  margin: 5px 0;
  font-size: 18px;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.primary};

  @media (max-width: 600px) {
    font-size: 14px;
    line-height: 1.3;
  }
`;

const RoundLabelPill = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 9999px;
  background-color: black;
  color: white;
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 500;
  font-size: 18px;
  text-transform: uppercase;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    font-size: 10px;
    margin-bottom: 16px;
  }
`;

const LabelText = styled.span`
  font-weight: bold;
  font-size: 12px;
  margin-right: 4px;

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const AnswerVar = styled.span`
  font-size: 21px;
  font-weight: bold;
  margin: 0 4px;
  font-family: ${({ theme }) => theme.fonts.secondary};

  @media (max-width: 600px) {
    font-size: 18px;
    margin: 0 2px;
  }
`;

const UserAnswerVar = styled.span<{ isCorrect: boolean }>`
  font-size: 21px;
  font-weight: bold;
  margin: 0 4px;
  color: ${({ isCorrect }) => (isCorrect ? 'green' : 'red')};
  font-family: ${({ theme }) => theme.fonts.secondary};

  @media (max-width: 600px) {
    font-size: 18px;
    margin: 0 2px;
  }
`;

export const RoundSummaryText: React.FC<RoundSummaryTextProps> = ({
  roundNumber,
  genre,
  correctAnswers,
  userAnswers,
}) => {
  const userTitleCorrect = userAnswers.title?.answer === correctAnswers.title;
  const userAuthorCorrect = userAnswers.author?.answer === correctAnswers.author;
  const userYearCorrect = userAnswers.year?.answer === correctAnswers.year;

  return (
    <>
      <RoundLabelPill variants={itemVariants}>
        ROUND {roundNumber}: {genre}
      </RoundLabelPill>
      <motion.div variants={itemVariants}>
        <InfoText>
          <LabelText>CORRECT ANSWER:</LabelText>
          <AnswerVar>{correctAnswers.title}</AnswerVar>
          by
          <AnswerVar>{correctAnswers.author}</AnswerVar>
          in
          <AnswerVar>{correctAnswers.year}</AnswerVar>
        </InfoText>
      </motion.div>
      <motion.div variants={itemVariants}>
        <InfoText>
          <LabelText>YOUR ANSWER:</LabelText>
          <UserAnswerVar isCorrect={!!userTitleCorrect}>
            {userAnswers.title ? userAnswers.title.answer : 'N/A'}
          </UserAnswerVar>
          by
          <UserAnswerVar isCorrect={!!userAuthorCorrect}>
            {userAnswers.author ? userAnswers.author.answer : 'N/A'}
          </UserAnswerVar>
          in
          <UserAnswerVar isCorrect={!!userYearCorrect}>
            {userAnswers.year ? userAnswers.year.answer : 'N/A'}
          </UserAnswerVar>
        </InfoText>
      </motion.div>
    </>
  );
};

export default RoundSummaryText;