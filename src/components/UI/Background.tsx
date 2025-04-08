import React, { memo, useMemo } from 'react';
import styled from 'styled-components';

// Use $bgColor instead of bgColor (transient prop)
const BackgroundPattern = styled.div<{ $bgColor: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw; // Explicitly set width
  z-index: -1;
  pointer-events: none;
  background-color: ${props => props.$bgColor};
  transition: background-color 1s ease;
  overflow: hidden; // Prevent overflow
`;

const PatternLine = styled.div`
  white-space: nowrap;
  user-select: none;
  line-height: 0.8;
  position: relative; // Make positioning relative
  width: 130vw; // Wider than viewport to prevent clipping
  overflow: visible; // Allow overflow on the right

  &:nth-child(4n+1) {
    text-align: left;
    left: 0;
  }
  &:nth-child(4n+2) {
    left: -10vw; // Use viewport width units instead of percentages
  }
  &:nth-child(4n+3) {
    left: -20vw; // Use viewport width units instead of percentages
  }
  &:nth-child(4n+4) {
    left: -30vw; // Use viewport width units instead of percentages
  }
`;

const HistoricleWord = styled.span.attrs<{
  $fontWeight: number;
  $fontSize: number;
  $isItalic: boolean;
}>(props => ({
  style: {
    fontWeight: props.$fontWeight,
    fontSize: `${props.$fontSize}px`,
    fontStyle: props.$isItalic ? 'italic' : 'normal',
  },
}))`
  margin: 0 10px;
  opacity: 0.1;
  display: inline-block; // Make sure this is inline-block
`;

const BackgroundComponent = ({ bgColor }: { bgColor: string }) => {
  // Generate a consistent seed to ensure patterns are always the same
  const seed = 12345;
  
  // Memoize the pattern lines with an empty dependency array
  const patterns = useMemo(() => {
    // Use the seed to create consistent random values
    const seededRandom = (min: number, max: number, index: number) => {
      const value = (seed * (index + 1)) % 100;
      return min + Math.floor((value / 100) * (max - min + 1));
    };
    
    // Local helper to render a HistoricleWord with deterministic randomness
    const renderHistoricle = (lineIndex: number, wordIndex: number) => {
      const fontWeight = seededRandom(400, 900, lineIndex * 10 + wordIndex);
      const fontSize = 84 + seededRandom(-5, 5, lineIndex * 20 + wordIndex);
      const isItalic = (lineIndex + wordIndex) % 3 === 0;
      
      return (
        <HistoricleWord
          $fontWeight={fontWeight}
          $fontSize={fontSize}
          $isItalic={isItalic}
          key={lineIndex * 100 + wordIndex}
        >
          HISTORICLE v2
        </HistoricleWord>
      );
    };

    // Use 12 words per line instead of 10 to ensure coverage across wide screens
    return Array.from({ length: 25 }).map((_, lineIndex) => (
      <PatternLine key={lineIndex}>
        {Array.from({ length: 12 }).map((_, wordIndex) => (
          renderHistoricle(lineIndex, wordIndex)
        ))}
      </PatternLine>
    ));
  }, []); // empty dependency array ensures this runs only once

  return (
    <BackgroundPattern $bgColor={bgColor}>
      {patterns}
    </BackgroundPattern>
  );
};

export default memo(BackgroundComponent);