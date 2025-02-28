import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from 'styled-components';

export interface RoundTimelineProps {
  results: (boolean | null)[];
  genres?: string[]; // New prop for genre names
}

// Add a color prop to GenreLabel
interface GenreLabelProps {
  color: string;
}

// Make the container responsive
const TimelineContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  width: 100%;
  flex-wrap: wrap;
  gap: 8px;
  
  @media (max-width: 600px) {
    margin: 20px 0;
    justify-content: space-around;
    gap: 5px;
  }
`;

const Circle = styled(motion.div)`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 3px solid;
  margin: 0 4px;
  
  @media (max-width: 600px) {
    width: 16px;
    height: 16px;
    border-width: 2px;
    margin: 0 2px;
  }
`;

const Separator = styled.div`
  margin: 0 4px;
  font-size: 22px;
  color: white;
  user-select: none;
  
  @media (max-width: 600px) {
    margin: 0 2px;
    font-size: 16px;
  }
`;

// Optimize GroupContainer for mobile
const GroupContainer = styled.div`
  background-color: black;
  border-radius: 25px;
  padding: 12px 16px 8px;
  margin: 0 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 600px) {
    padding: 8px 10px 6px;
    margin: 0 3px;
    border-radius: 16px;
    flex: 0 1 auto; // Allow shrinking
    min-width: 0; // Allow container to shrink below content size
  }
`;

const CirclesRow = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const GenreLabel = styled.div<GenreLabelProps>`
  color: ${props => props.color};
  font-size: 14px;
  margin-top: 8px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.secondary};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  
  @media (max-width: 600px) {
    font-size: 11px;
    margin-top: 5px;
    max-width: 100px; // Limit width on mobile
  }
`;

const getColors = (result: boolean | null) => {
  if (result === true) {
    return { bg: "#008e00", border: "#008e00" };
  } else if (result === false) {
    return { bg: "#d70000", border: "#d70000" };
  } else {
    return { bg: "#e0e0e0", border: "#e0e0e0" };
  }
};

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

const RoundTimeline: React.FC<RoundTimelineProps> = ({ results, genres = ["Round 1", "Round 2", "Round 3"] }) => {
  const theme = useTheme();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 600;
  
  // Use shorter genre labels on mobile
  const displayGenres = isMobile 
    ? genres.map(genre => {
        // Shorten genre names on mobile if needed
        if (genre.length > 10) {
          return genre.substring(0, 8) + '...';
        }
        return genre;
      })
    : genres;
  
  // Theme colors for each genre index
  const labelColors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.tertiary
  ];

  // Create animation controllers
  const control0 = useAnimation();
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();
  const control4 = useAnimation();
  const control5 = useAnimation();
  const control6 = useAnimation();
  const control7 = useAnimation();
  const control8 = useAnimation();
  
  const controllers = [control0, control1, control2, control3, control4, control5, control6, control7, control8];
  
  // Ensure there are exactly 9 nodes
  const nodes = Array.from({ length: 9 }).map((_, i) => results[i] ?? null);
  
  useEffect(() => {
    nodes.forEach((result, index) => {
      const { bg, border } = getColors(result);
      
      controllers[index].start({
        backgroundColor: bg,
        borderColor: border,
        transition: { duration: 0.2, ease: "easeInOut" }
      });
    });
  }, [results]);
  
  // Group the nodes into sets of 3
  const groups = [
    nodes.slice(0, 3),
    nodes.slice(3, 6),
    nodes.slice(6, 9)
  ];
  
  return (
    <TimelineContainer>
      {groups.map((group, groupIndex) => (
        <GroupContainer key={`group-${groupIndex}`}>
          <CirclesRow>
            {group.map((result, index) => {
              const nodeIndex = groupIndex * 3 + index;
              return (
                <React.Fragment key={nodeIndex}>
                  <Circle 
                    initial={{ backgroundColor: "#ffffff", borderColor: "#808080" }}
                    animate={controllers[nodeIndex]}
                  />
                  {index < 2 && <Separator>—</Separator>}
                </React.Fragment>
              );
            })}
          </CirclesRow>
          <GenreLabel color={labelColors[groupIndex]}>
            {groupIndex + 1}: {displayGenres[groupIndex]}
          </GenreLabel>
        </GroupContainer>
      ))}
    </TimelineContainer>
  );
};

export default RoundTimeline;