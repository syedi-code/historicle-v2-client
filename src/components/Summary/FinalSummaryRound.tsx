import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GenreStat, RoundResult } from '../../types';
import { getRandomImage } from '../../theme';
import WhitePill from '../UI/WhitePill';

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

// Update PassagesContainer to prevent horizontal overflow
const PassagesContainer = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  text-align: center;
  max-width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 600px) {
    margin-top: 0.75rem;
    padding: 0; // Remove any padding that might cause overflow
  }
`;

// Update PassageBlock to conditionally show pointer cursor
const PassageBlock = styled.div<{ isRevealed: boolean }>`
  margin: 1rem 0;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: ${props => props.isRevealed ? 'default' : 'pointer'};
  
  @media (max-width: 600px) {
    margin: 0.75rem 0; // Less vertical spacing on mobile
  }
`;

// Update PassageContent to ensure content doesn't overflow
const PassageContent = styled.div<{ isRevealed: boolean }>`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 600;
  background-color: #f5f5f5;
  border-left: 4px solid #ddd;
  padding: 1rem;
  font-size: 1rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  text-align: left;
  filter: ${props => props.isRevealed ? 'none' : 'blur(8px)'};
  user-select: ${props => props.isRevealed ? 'text' : 'none'};
  word-break: break-word; // Add this to prevent text overflow
  max-width: 100%; // Ensure content can't exceed container
  
  @media (max-width: 600px) {
    padding: 0.75rem; // Less padding
    font-size: 0.9rem; // Smaller font
  }
`;

// Update PassageOverlay to fade out smoothly but make text disappear instantly
const PassageOverlay = styled.div<{ isRevealed: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  opacity: ${props => props.isRevealed ? 0 : 1};
  visibility: ${props => props.isRevealed ? 'hidden' : 'visible'};
  pointer-events: ${props => props.isRevealed ? 'none' : 'auto'};
  transition: opacity 0.4s ease, visibility 0.4s ease;
`;

// New component for the text that won't animate
const OverlayText = styled.div<{ isRevealed: boolean }>`
  color: white;
  font-weight: 500;
  opacity: ${props => props.isRevealed ? 0 : 1};
  visibility: ${props => props.isRevealed ? 'hidden' : 'visible'};
  /* No transition for immediate disappearance */
`;

// Fix TitleCardWrapper for mobile
const TitleCardWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  height: 80px;
  max-width: 100%;
  
  @media (max-width: 600px) {
    height: auto; // Allow height to adjust to content
    margin-bottom: 1rem;
    width: 100%;
  }
`;

const TitlePaintingImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; // Will fill the parent container
  height: 100%;
  border-radius: 25px;
  object-fit: cover;
  object-position: center;
  z-index: 1;
`;

// Update BookTitleDisplay for better mobile display
const BookTitleDisplay = styled.h3`
  position: relative;
  z-index: 2;
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1.3rem;
  text-align: center;
  font-weight: 600;
  margin: 0 1rem; // Center horizontally
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 2rem;
  border-radius: 50px;
  background-color: rgba(0, 0, 0, 1);
  line-height: 1.4;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  
  @media (max-width: 600px) {
    font-size: 0.9rem; // Smaller font on mobile
    padding: 0.3rem 1rem; // Much less padding
    white-space: normal; // Allow text wrapping on mobile
    border-radius: 25px; // Smaller border radius
    max-width: 100%;
  }
`;

// Add these new styled components for the header
const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
  
  @media (max-width: 600px) {
    margin-bottom: 0.5rem; // Less margin
  }
`;

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
  
  @media (max-width: 600px) {
    padding: 3px 10px; // Less padding
    font-size: 14px; // Smaller font
  }
`;

// First add a roundNumber prop to GenreSectionProps interface
interface FinalSummaryRoundProps {
  round: RoundResult;
  genreStat?: GenreStat;
  fadeInDelay?: number;
  roundNumber?: number; // Add this prop
}

// Then update the component definition to use this prop with a default value
const FinalSummaryRound: React.FC<FinalSummaryRoundProps> = ({ 
  round, 
  genreStat, 
  fadeInDelay = 0,
  roundNumber 
}) => {
  const width = useWindowWidth();
  const isMobile = width <= 600;
  const [imageSrc, setImageSrc] = useState<string>("");
  
  // Track which passages are revealed
  const [revealedPassages, setRevealedPassages] = useState<boolean[]>([]);
  
  // Get a random painting and set up initial revealed passages state
  useEffect(() => {
    setImageSrc(getRandomImage());
    
    // First passage is revealed by default, others are hidden
    if (round.passages && round.passages.length > 0) {
      const initial = Array(round.passages.length).fill(false);
      initial[0] = true; // First passage is revealed
      setRevealedPassages(initial);
    }
  }, [round]);

  const genreAccuracy = genreStat ? 
    Math.round((genreStat.Correct / genreStat.Total) * 100) : null;

  const togglePassage = (index: number) => {
    setRevealedPassages(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };
  
  // Update the HeaderRow JSX to use Round {roundNumber}
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: fadeInDelay }}
    >      
      {/* Passages container with book title format */}
      {round.passages && round.passages.length > 0 && (
        <WhitePill>
          <PassagesContainer>
            {/* Update the header row to show Round X */}
            <HeaderRow>
              <RoundIndicator>Round {roundNumber || '?'}</RoundIndicator>
            </HeaderRow>
            
            {/* Title with painting background */}
            <TitleCardWrapper>
              {!isMobile && <TitlePaintingImage src={imageSrc} alt="Painting" />}
              <BookTitleDisplay>
                {round.correctTitle} by {round.correctAuthor} ({round.correctYear})
              </BookTitleDisplay>
            </TitleCardWrapper>
            
            {round.passages.map((passage, i) => (
              <PassageBlock key={i} onClick={() => togglePassage(i)} isRevealed={revealedPassages[i]}>
                <PassageContent isRevealed={revealedPassages[i]}>
                  {passage}
                </PassageContent>
                <PassageOverlay isRevealed={revealedPassages[i]}>
                  <OverlayText isRevealed={revealedPassages[i]}>
                    Click to reveal passage {i + 1}
                  </OverlayText>
                </PassageOverlay>
              </PassageBlock>
            ))}
          </PassagesContainer>
        </WhitePill>
      )}
    </motion.div>
  );
};

export default FinalSummaryRound;