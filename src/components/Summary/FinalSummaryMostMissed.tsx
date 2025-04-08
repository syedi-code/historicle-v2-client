import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MostMissed as MostMissedType } from '../../types';
import { getRandomImage } from '../../theme';

// Hook to track window width for responsive design
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

// Change to motion.div for animation
const CardWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 1.5rem;
  box-sizing: border-box;
  
  @media (max-width: 600px) {
    margin-top: 1rem;
  }
`;

const PaintingImage = styled.img`
  border-radius: 15px;
  width: 100%;
  height: auto;
  display: block;
`;

// Change to motion.div for animation
const Container = styled(motion.div)`
  position: absolute;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 18px;
  box-sizing: border-box;
  
  @media (max-width: 600px) {
    position: relative;
    width: 100%;
    border: 2px solid black;
    border-radius: 10px;
    padding: 12px;
    box-shadow: none;
  }
`;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// More compact HeaderRow for mobile
const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;
  flex-wrap: wrap; // Allow wrapping on very small screens
  
  @media (max-width: 600px) {
    justify-content: center;
    gap: 5px;
  }
`;

// Updated title with better mobile sizing
const Title = styled.h4`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 1.1rem;
  color: #d32f2f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0.5rem 0 0;
  white-space: nowrap;
  
  @media (max-width: 600px) {
    font-size: 1rem;
    margin: 0 0.3rem 0.3rem 0;
  }
`;

// More compact RoundIndicator
const RoundIndicator = styled.div`
  padding: 4px 12px;
  border-radius: 9999px;
  background-color: black;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 500;
  font-size: 16px;
  margin-right: 8px;
  
  @media (max-width: 600px) {
    padding: 3px 10px;
    font-size: 14px;
    margin-right: 5px;
  }
`;

const QuestionType = styled.span`
  font-weight: bold;
  text-transform: uppercase;
  
  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

// More compact stats for mobile
const AccuracyStat = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: center;
  
  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
`;

const AccuracyValue = styled.span`
  font-weight: bold;
`;

// Updated AnswerPill with better mobile sizing
const AnswerPill = styled.span`
  padding: 4px 12px;
  border-radius: 9999px;
  background-color: #d70000;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 500;
  font-size: 16px;
  margin-right: 8px;
  
  @media (max-width: 600px) {
    padding: 3px 8px;
    font-size: 14px;
    margin-right: 6px;
  }
`;

const PlayerCount = styled.span`
  font-weight: bold;
  text-transform: uppercase;
  
  @media (max-width: 600px) {
    font-size: 0.85rem;
  }
`;

// Better mobile-friendly WrongList
const WrongList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-top: 0.5rem;
  width: 100%;
  
  li {
    margin-bottom: 4px;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    @media (max-width: 600px) {
      font-size: 0.85rem;
      padding: 4px 8px;
    }
  }
`;

interface FinalSummaryMostMissedProps {
  data: MostMissedType;
  getQuestionTypeName: (type: string) => string;
}

const FinalSummaryMostMissed: React.FC<FinalSummaryMostMissedProps> = ({ data, getQuestionTypeName }) => {
  const width = useWindowWidth();
  const isMobile = width <= 600;
  const [imageSrc, setImageSrc] = useState<string>("");
  
  // Get a random painting
  useEffect(() => {
    setImageSrc(getRandomImage());
  }, []);

  return (
    <AnimatePresence mode="wait">
      <CardWrapper
        key="most-missed-card"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeIn}
      >
        {/* Only show painting on non-mobile */}
        {!isMobile && <PaintingImage src={imageSrc} alt="Painting" />}
        
        <Container
          variants={fadeIn}
        >
          <HeaderRow>
            <Title>Most Missed Question:</Title>
            <RoundIndicator>Round {data.round}</RoundIndicator>
            <QuestionType>{getQuestionTypeName(data.type)}</QuestionType>
          </HeaderRow>
          
          <AccuracyStat>
            Only <AccuracyValue>{Math.round(data.accuracy)}%</AccuracyValue> of players answered correctly.
          </AccuracyStat>
          
          {data.popularWrongAnswers?.length > 0 && (
            <WrongList>
              {data.popularWrongAnswers.map(([answer, count]: [string, number]) => (
                <li key={answer}>
                  <AnswerPill>{answer}</AnswerPill>
                  <PlayerCount>{count} PLAYER{Number(count) !== 1 ? 'S' : ''}</PlayerCount>
                </li>
              ))}
            </WrongList>
          )}
        </Container>
      </CardWrapper>
    </AnimatePresence>
  );
};

export default FinalSummaryMostMissed;