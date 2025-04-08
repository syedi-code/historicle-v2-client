import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomImage } from '../../theme';

interface AnswerProps {
  text: string;
  infoLink?: string;
  isSelected?: boolean;
  answerSubmittedKey?: number;
  onInfoClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

// Add a new animation variant for the click effect
const containerAnimationValues = {
  initial: { scale: 1 },
  clicked: { 
    scale: 0.97,
    transition: { 
      duration: 0.2, 
      ease: [0.175, 0.885, 0.32, 1.275] // Custom easing (cubic bezier)
    }
  },
  unclicked: { 
    scale: 1,
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    }
  }
};

export const overlayAnimationValues = {
  initial: { width: '80%', height: '50%' },
  hover: {
    width: '90%',
    height: '70%',
    transition: { duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] },
  },
};

const borderAnimationValues = {
  unselected: {
    borderColor: 'rgba(255, 0, 0, 0)',
    transition: { duration: 0.1, ease: 'easeInOut' },
  },
  selected: {
    borderColor: 'rgba(255, 0, 0, 1)',
    transition: { duration: 0.1, ease: 'easeInOut' },
  },
  hover: { borderColor: 'rgba(255, 0, 0, 0.3)' },
};

// Wrap the Answer component in a motion.div to handle the scale animation
const AnswerContainer = styled(motion.div)`
  width: 100%;
  transform-origin: center center;
`;

const ImageWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px; /* Reduced from 150px (20% smaller) */
  overflow: hidden;
  border-width: 4px;
  border-style: solid;
  border-color: rgba(255, 0, 0, 0);
  border-radius: 20px;
`;

// Add the styled component for image loading
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0; // Light gray placeholder background
`;

const StyledImage = styled(motion.img)`
  border-radius: 15px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
`;

const OverlayAnswer = styled(motion.div)`
  position: absolute;
  width: 80%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 20px; /* Reduced from 24px */
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts.secondary};
  text-align: center;
  padding: 10px;
  background-color: white;
  border-radius: 15px;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  @media (max-width: 600px) {
    font-size: 11px; /* Reduced from 14px */
  }
`;

interface LinkProps {
  disabled?: boolean;
}

const InfoLink = styled(motion.a)<LinkProps>`
  font-size: 10px; /* Reduced from 12px */
  margin-top: 5px;
  font-family: ${({ theme }) => theme.fonts.primary};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled }) => (disabled ? '#aaa' : 'black')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  display: inline-block;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  @media (max-width: 600px) {
    font-size: 8px; /* Reduced from 14px */
  }
`;

const textVariants = {
  initial: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.1, ease: 'linear' },
  },
  enter: {
    opacity: 1,
    transition: { duration: 0.1, ease: 'linear' },
  },
};

const Answer: React.FC<AnswerProps> = ({
  text,
  infoLink,
  isSelected,
  answerSubmittedKey,
  onInfoClick,
}) => {
  const [randomImage, setRandomImage] = useState(getRandomImage());
  const [infoClicked, setInfoClicked] = useState(false);
  const [textHovered, setTextHovered] = useState(false); // for info text hover
  const [hovered, setHovered] = useState(false); // manual state for border hover
  const [isClicked, setIsClicked] = useState(false); // new state for click animation
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false); // Reset image loaded state
    setInfoClicked(false);
    setTextHovered(false);
    setHovered(false);
    setIsClicked(false); // Reset click state when answer changes
    
    // Use setTimeout to ensure we're in a new render cycle
    // This helps avoid the flash of old content
    setTimeout(() => {
      setRandomImage(getRandomImage());
    }, 0);
  }, [answerSubmittedKey]);

  // Handle click animation
  const handleContainerClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 200); // Reset after animation completes
  };

  const handleInfoClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation(); // Prevent container click handler from firing
    e.preventDefault();
    if (!infoClicked && infoLink) {
      setInfoClicked(true);
      if (onInfoClick) onInfoClick(e);
      const newWindow = window.open(infoLink, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.blur();
      window.focus();
    }
  };

  // Show "-250" if info was clicked or the InfoLink is hovered; otherwise "INFO"
  const displayText = infoClicked || textHovered ? '-250' : 'INFO';

  return (
    <AnswerContainer 
      variants={containerAnimationValues}
      initial="initial"
      animate={isClicked ? "clicked" : "unclicked"}
      onClick={handleContainerClick}
    >
      <ImageWrapper
        key={`wrapper-${answerSubmittedKey}`}
        variants={borderAnimationValues}
        initial="unselected"
        animate={isSelected ? 'selected' : hovered ? 'hover' : 'unselected'}
        onHoverStart={() => {
          if (!isSelected) {
            setHovered(true);
          }
        }}
        onHoverEnd={() => setHovered(false)}
        transition={{ duration: 0.1, ease: 'easeInOut' }}
      >
        <ImageContainer>
          <AnimatePresence mode="wait">
            <StyledImage 
              key={`img-${answerSubmittedKey}-${randomImage}`}
              src={randomImage} 
              alt="Painting"
              onLoad={() => setImageLoaded(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
        </ImageContainer>

        <OverlayAnswer
          variants={overlayAnimationValues}
          initial="initial"
          whileHover="hover"
        >
          {text}
          {infoLink && (
            <InfoLink
              href={infoLink}
              onClick={handleInfoClick}
              onAuxClick={handleInfoClick}
              target="_blank"
              rel="noopener noreferrer"
              disabled={infoClicked}
              onMouseEnter={() => setTextHovered(true)}
              onMouseLeave={() => setTextHovered(false)}
              style={{ opacity: 1 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={displayText}
                  variants={textVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  style={{
                    marginTop: '2px',
                    textDecoration: displayText === '-250' ? 'none' : 'underline',
                  }}
                >
                  {displayText}
                </motion.span>
              </AnimatePresence>
            </InfoLink>
          )}
        </OverlayAnswer>
      </ImageWrapper>
    </AnswerContainer>
  );
};

export default Answer;