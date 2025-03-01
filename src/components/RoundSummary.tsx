import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getRandomImage } from '../theme';
import RoundSummaryText from './RoundSummaryText';

interface CorrectAnswers {
  author: string;
  title: string;
  year: string;
}

export interface RoundSummaryProps {
  roundNumber: number;
  genre: string;
  correctAnswers: CorrectAnswers;
  userAnswers: {
    author?: { answer: string; correct: boolean };
    title?: { answer: string; correct: boolean };
    year?: { answer: string; correct: boolean };
  };
  onNextRound: () => void;
}

// Hook to get window width (similar to DivImage.tsx)
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const containerVariants = {
  hidden: { 
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.0, // Standard animation duration
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0
  },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.4 // Slightly faster for child elements
    }
  }
};

const SummaryWrapper = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 20px auto;
  border-radius: 15px;
  overflow: hidden;
`;

const SummaryImage = styled.img`
  width: 1200px;
  height: 200px; /* Fixed height to crop the image */
  object-fit: cover;
  display: block;

  @media (max-width: 600px) {
    width: 100%;
    height: 150px;
    display: none; /* Hide image on mobile */
  }
`;

const SummaryOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (max-width: 600px) {
    position: relative;
    /* Instead of resetting transform, use margin auto to center */
    margin: 20px auto;
    top: auto;
    left: auto;
    transform: none;
    width: 90%;
    height: auto;
    border: 2px solid black;
    border-radius: 10px;
    padding: 10px;
  }
`;

// Convert HoverPill to use Framer Motion
const HoverPill = styled(motion.div)`
  background-color: white;
  border: 2px solid black;
  border-radius: 50px;
  padding: 10px 20px;
  display: inline-block;
  margin-bottom: 20px;
  /* Remove the CSS transitions that might interfere with Framer Motion */
`;

// Nav text button with underline-on-hover (for "Next Round")
const NavTextButton = styled(motion.span)<{ disabled?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: 800;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  position: relative;
  color: inherit;
  padding-bottom: 10px;
  font-size: 24px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  text-transform: uppercase;

  @media (max-width: 600px) {
    font-size: 18px;
    padding-bottom: 6px;
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: 6px;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: currentColor;
  transform-origin: center;
`;

// Convert ButtonWrapper to a motion component
const ButtonWrapper = styled(motion.div)`
  text-align: center;
  margin-top: 20px;
  cursor: pointer;

  @media (max-width: 600px) {
    margin-top: 12px;
  }
`;

const RoundSummary: React.FC<RoundSummaryProps> = ({
  roundNumber,
  genre,
  correctAnswers,
  userAnswers,
  onNextRound,
}) => {
  const width = useWindowWidth();
  const isMobile = width <= 600;
  const imageUrl = getRandomImage(); // Dynamically grabbed background image

  return (
    <motion.div
      key="round-summary"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <SummaryWrapper>
        {!isMobile && <SummaryImage src={imageUrl} alt="Summary Background" />}
        <SummaryOverlay>
          <RoundSummaryText
            roundNumber={roundNumber}
            genre={genre}
            correctAnswers={correctAnswers}
            userAnswers={userAnswers}
          />
        </SummaryOverlay>
      </SummaryWrapper>
      <ButtonWrapper 
        onClick={onNextRound}
        whileTap={{ scale: 0.95 }}
      >
        <HoverPill
          whileHover={{ backgroundColor: "black", color: "white" }}
          transition={{ duration: 0.3 }}
        >
          <NavTextButton>
            {roundNumber === 3 ? 'RESULTS →' : 'NEXT ROUND →'}
            <Underline
              variants={{
                rest: { scaleX: 0 },
                hover: { scaleX: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
              }}
              initial="rest"
              whileHover="hover"
            />
          </NavTextButton>
        </HoverPill>
      </ButtonWrapper>
    </motion.div>
  );
};

export default RoundSummary;