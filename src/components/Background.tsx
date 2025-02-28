import React, { memo, useMemo } from 'react';
import styled from 'styled-components';

const BackgroundPattern = styled.div<{ bgColor: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  background-color: ${props => props.bgColor};
  transition: background-color 1s ease;
`;

const PatternLine = styled.div`
  white-space: nowrap;
  user-select: none;
  line-height: 0.8;

  &:nth-child(4n+1) {
    text-align: left;
    padding-left: 0%;
    margin-left: 0%;
  }
  &:nth-child(4n+2) {
    padding-left: 0%;
    margin-left: -10%;
  }
    &:nth-child(4n+3) {
    padding-left: 0%;
    margin-left: -20%;
  }
  &:nth-child(4n+4) {
    padding-left: 0%;
    margin-left: -30%;
  }
`;

// Helper function to generate random values
const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const HistoricleWord = styled.span<{ randomFontWeight: number; randomFontSizeOffset: number; isItalic: boolean }>`
  font-weight: ${props => props.randomFontWeight};
  font-size: ${props => 84 + props.randomFontSizeOffset}px;
  font-style: ${props => props.isItalic ? 'italic' : 'normal'};
  margin: 0 10px; /* Add horizontal margin to create spaces */
  opacity: 0.1;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  /* additional background styles */
`;

const BackgroundComponent = ({ bgColor }: { bgColor: string }) => {
  // Memoize the pattern lines so they only render once.
  const patterns = useMemo(() => {
    // Local helper to render a HistoricleWord.
    const renderHistoricle = () => {
      const fontWeight = getRandomValue(400, 900);
      const fontSizeOffset = getRandomValue(-5, 5);
      const isItalic = Math.random() < 0.5;
      return (
        <HistoricleWord
          randomFontWeight={fontWeight}
          randomFontSizeOffset={fontSizeOffset}
          isItalic={isItalic}
        >
          HISTORICLE
        </HistoricleWord>
      );
    };

    return Array.from({ length: 25 }).map((_, i) => (
      <PatternLine key={i}>
        {Array.from({ length: 10 }).map((_, j) => (
          <React.Fragment key={j}>
            {renderHistoricle()}
          </React.Fragment>
        ))}
      </PatternLine>
    ));
  }, []); // empty dependency array ensures this runs only once

  return (
    <BackgroundPattern bgColor={bgColor}>
      {patterns}
    </BackgroundPattern>
  );
};

export default memo(BackgroundComponent);