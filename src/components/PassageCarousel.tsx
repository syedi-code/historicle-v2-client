import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import DivImage from './Passage';

interface PassageCarouselProps {
  dailyPassages: string[];
  ribbonText: {
    author: string;
    title: string;
    year: string;
  };
  triggerDeduction: (deduction: number, pos: { x: number; y: number }) => void;
  roundLabel: string;
}

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 20px;
`;

const CarouselContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px;

  background-color: white;
  border: 2px solid black;
  border-radius: 15px;
  padding: 10px 20px;
  display: inline-block;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    margin: 10px;
    padding: 2px 4px;
  }
`;

const ModifierText = styled.div`
  display: block;
  width: 100%;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 0.8rem;
  color: black;
  margin-bottom: 4px;
  font-weight: bold;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  
  @media (max-width: 600px) {
    font-size: 0.55rem;
  margin-bottom: 0;
  }
`;

const NavText = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: 800;
  cursor: pointer;
  color: black;
  font-size: 18px;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  
  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: #666;
  transform-origin: center;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  @media (min-width: 1024px) {
    min-width: 700px;
  }
`;

const PassageCarousel: React.FC<PassageCarouselProps> = ({ dailyPassages, ribbonText, triggerDeduction, roundLabel }) => {
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [visitedIndexes, setVisitedIndexes] = useState<Set<number>>(new Set([0]));

  // Reset carousel when round changes (roundLabel or dailyPassages changes)
  useEffect(() => {
    // Reset to the first passage
    setCurrentPassageIndex(0);
    
    // Reset visited indexes to only include the first passage
    setVisitedIndexes(new Set([0]));
    
    // Increment key to force re-render
    setKey(prevKey => prevKey + 1);
  }, [roundLabel, dailyPassages]); // Dependencies that indicate round change
  
  const scrollPrev = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      const newIndex = currentPassageIndex === 0 ? dailyPassages.length - 1 : currentPassageIndex - 1;
      if (!visitedIndexes.has(newIndex)) {
        triggerDeduction(100, { x: e.clientX, y: e.clientY });
        setVisitedIndexes((prev) => new Set(prev).add(newIndex));
      }
      setCurrentPassageIndex(newIndex);
      setKey((prevKey) => prevKey + 1);
    },
    [currentPassageIndex, dailyPassages.length, visitedIndexes, triggerDeduction]
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      const newIndex = currentPassageIndex === dailyPassages.length - 1 ? 0 : currentPassageIndex + 1;
      if (!visitedIndexes.has(newIndex)) {
        triggerDeduction(100, { x: e.clientX, y: e.clientY });
        setVisitedIndexes((prev) => new Set(prev).add(newIndex));
      }
      setCurrentPassageIndex(newIndex);
      setKey((prevKey) => prevKey + 1);
    },
    [currentPassageIndex, dailyPassages.length, visitedIndexes, triggerDeduction]
  );

  const prevActive = currentPassageIndex > 0;
  const nextActive = currentPassageIndex < dailyPassages.length - 1;

  const prevIndex = currentPassageIndex === 0 ? dailyPassages.length - 1 : currentPassageIndex - 1;
  const nextIndex = currentPassageIndex === dailyPassages.length - 1 ? 0 : currentPassageIndex + 1;
  const prevSubtract = prevActive && !visitedIndexes.has(prevIndex);
  const nextSubtract = nextActive && !visitedIndexes.has(nextIndex);

  return (
    <CarouselWrapper>
      <CarouselContent>
        <AnimatePresence>
          <NavContainer
            key="prev"
            animate={{ opacity: prevActive ? 1 : 0 }}
            initial={{ opacity: prevActive ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ pointerEvents: prevActive ? 'auto' : 'none' }}
          >
            {prevSubtract && <ModifierText>-100</ModifierText>}
            <NavText
              onClick={(e) => { if (prevActive) scrollPrev(e); }}
              initial="rest"
              whileHover={prevActive ? 'hover' : 'rest'}
            >
              ← PREV
              <Underline
                variants={{
                  rest: { scaleX: 0 },
                  hover: { scaleX: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
                }}
              />
            </NavText>
          </NavContainer>
        </AnimatePresence>

        <ImageContainer>
          <DivImage 
            key={key} 
            text={dailyPassages[currentPassageIndex]} 
            passageIndex={currentPassageIndex}
            roundLabel={roundLabel}
          />
        </ImageContainer>

        <AnimatePresence>
            <NavContainer
              key="next"
              animate={{ opacity: nextActive ? 1 : 0 }}
              initial={{ opacity: nextActive ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ pointerEvents: nextActive ? 'auto' : 'none' }}
            >
              {nextSubtract && <ModifierText>-100</ModifierText>}
              <NavText
                onClick={(e) => { if (nextActive) scrollNext(e); }}
                initial="rest"
                whileHover={nextActive ? 'hover' : 'rest'}
              >
                NEXT →
                <Underline
                  variants={{
                    rest: { scaleX: 0 },
                    hover: { scaleX: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
                  }}
                />
              </NavText>
            </NavContainer>
        </AnimatePresence>
      </CarouselContent>
    </CarouselWrapper>
  );
};

export default PassageCarousel;
