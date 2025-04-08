import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getRandomImage } from '../../theme';

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;      
  margin-right: 20px;
`;

const StyledImage = styled.img`
  border-radius: 15px;
  width: 100%;
  height: auto;
  display: block;
`;

const Overlay = styled.div`
  /* Default overlay settings for larger screens */
  position: absolute;
  width: 90%;
  height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 20px;
  background-color: white;
  border-radius: 15px;

  /* Mobile Overrides: let the container expand naturally and become positioned */
  @media (max-width: 600px) {
    position: relative;
    width: 100%;
    height: auto; /* Remove fixed height */
    margin: 10px 0;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid black;
  }
`;

const CircleIndicator = styled.div`
  /* Default: absolutely positioned on larger screens */
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: 9999px;
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 800;
  font-size: 18px;

  /* Mobile Overrides: anchor to the top of its parent container */
  @media (max-width: 600px) {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

// New styled component for the round indicator.
const RoundIndicator = styled.div`
  position: absolute;
  bottom: 80px; /* Moved up from previous 20px on desktop */
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  border-radius: 9999px;
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 500;
  font-size: 18px;

  @media (max-width: 600px) {
    bottom: 25px;
    font-size: 10px; /* Half of 18px */
  }
`;

const OverlayText = styled(motion.div)`
  color: black;
  font-weight: 600;
  text-align: justify;
  font-family: ${({ theme }) => theme.fonts.secondary};
  padding: 0 25px;
  line-height: 1.2;

  @media (max-width: 600px) {
    font-size: 3vw;
    margin: 50px 0;
  }

  @media (min-width: 1200px) {
    font-size: 0.8vw;
  }
`;

interface ImageOverlayProps {
  text: string;
  passageIndex: number;
  roundLabel: string;
}

const Passage: React.FC<ImageOverlayProps> = ({ text, passageIndex, roundLabel }) => {
  const width = useWindowWidth();
  const isMobile = width <= 600;

  return (
    <ImageWrapper>
      {/* Only render StyledImage on non-mobile devices */}
      {!isMobile && <StyledImage src="/img/painting1.jpg" alt="Painting" />}
      <Overlay>
        <CircleIndicator>{passageIndex + 1} / 5</CircleIndicator>
        <OverlayText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {text}
        </OverlayText>
      </Overlay>
      {/* New RoundIndicator anchored at the bottom */}
      <RoundIndicator>{roundLabel}</RoundIndicator>
    </ImageWrapper>
  );
};

export default Passage;
