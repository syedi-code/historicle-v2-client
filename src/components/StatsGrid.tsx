import React from 'react';
import styled from 'styled-components';
import StatCard from './StatCard';
import { motion } from 'framer-motion';

// Updated Grid container with better mobile handling
const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 1.5rem;
  width: 100%;
  overflow-x: auto; // Allow horizontal scrolling on smaller screens
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch; // Smooth scrolling on iOS
  
  /* Hide scrollbar for cleaner appearance */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  /* Ensure cards take equal width */
  & > * {
    flex: 1;
    min-width: 120px; // Reduced minimum width for mobile
    max-width: 200px; // Maximum width to prevent too wide cards
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center; // Center items horizontally in the column
    gap: 0.75rem; // Reduce gap between items on mobile
    margin-top: 0.75rem; // Less top margin
    padding-bottom: 4px; // Less bottom padding
    
    /* Make cards more compact on mobile */
    & > * {
      width: 90%; // Make cards slightly narrower than container
      max-width: 90%; // Constrain maximum width
      min-width: auto; // Let cards shrink if needed
    }
  }
  
  @media (max-width: 375px) { // Extra small screens
    gap: 0.5rem; // Even less gap on very small screens
    
    & > * {
      width: 95%; // Wider proportion on very small screens
    }
  }
`;

// Create a staggered animation function that incorporates the delay
const staggeredFadeIn = (index: number) => ({
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      delay: 0.3 + index * 0.2, // Base delay of 0.3s plus 0.2s per card
      ease: "easeOut"
    }
  }
});

interface StatsGridProps {
  stats: {
    value: string | number;
    label: string;
  }[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <Grid>
      {stats.map((stat, index) => (
        <StatCard 
          key={stat.label} 
          value={stat.value} 
          label={stat.label}
          variants={staggeredFadeIn(index)}
          initial="hidden"
          animate="visible"
        />
      ))}
    </Grid>
  );
};

export default StatsGrid;