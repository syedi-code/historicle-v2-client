import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getRandomImage } from '../theme';

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

// Painting background styling with fixed height
const CardWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px; // Fixed height
`;

const PaintingImage = styled.img`
  border-radius: 15px;
  width: 100%;
  height: 150px; // Match wrapper height
  object-fit: cover; // Ensure image covers the space
  display: block;
`;

const WhiteOverlay = styled.div`
  position: absolute;
  width: 50%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    position: relative;
    width: 100%;
    height: auto;
    margin: 10px 0;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid black;
  }
`;

// Content container for better alignment
const ContentContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

// Stat card content styling with reduced size
const Value = styled.div`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 1.6rem; // Reduced from 2rem
  font-weight: 700;
  margin-bottom: 0.4rem; // Reduced slightly
  text-align: center;
`;

const Label = styled.div`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
`;

// Update the StatCardProps interface to include animation props
interface StatCardProps {
  value: string | number;
  label: string;
  variants?: any;
  initial?: string;
  animate?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  value, 
  label, 
  variants,
  initial,
  animate
}) => {
  const width = useWindowWidth();
  const isMobile = width <= 600;
  const [imageSrc, setImageSrc] = useState<string>("");
  
  // Get a random painting
  useEffect(() => {
    setImageSrc(getRandomImage());
  }, []);

  return (
    <CardWrapper>
      {/* Only show painting on non-mobile */}
      {!isMobile && <PaintingImage src={imageSrc} alt="Painting" />}
      
      <WhiteOverlay>
        <ContentContainer 
          variants={variants}
          initial={initial}
          animate={animate}
        >
          <Value>{value}</Value>
          <Label>{label}</Label>
        </ContentContainer>
      </WhiteOverlay>
    </CardWrapper>
  );
};

export default StatCard;