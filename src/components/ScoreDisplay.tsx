import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import CountUp from 'react-countup';
import WhitePill from './WhitePill';

interface ScoreDisplayProps {
  score: number;
  animate?: boolean;
  isFinalScore?: boolean;
  countUpComplete?: () => void; // Optional callback for when count up finishes
}

const ScoreValue = styled(motion.div)`
  font-family: ${({ theme }) => theme.fonts.tertiary};
  font-weight: bold;
  font-size: 3rem;
  color: black;
  text-align: center;
  margin: 1rem 0 1rem 0;

  @media (max-width: 600px) {
    font-size: 1.8rem;
    margin: 1rem 0;
  }
`;

const FinalScoreLabel = styled(motion.div)`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: bold;
  color: red;
  text-align: center;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
`;

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  animate = true,
  isFinalScore = false,
  countUpComplete
}) => {
  const controls = useAnimation();
  const prevScoreRef = useRef(score);
  const [showLabel, setShowLabel] = useState(false);

  // Handle animation for normal score updates
  useEffect(() => {
    if (animate && !isFinalScore && prevScoreRef.current !== score) {
      const animateScore = async () => {
        await controls.start({
          x: [0, -5, 5, -5, 5, 0],
          transition: { duration: 0.5, ease: 'easeInOut' },
        });
        await controls.start({
          color: ['red', 'black'],
          transition: { duration: 0.5, ease: 'easeInOut' },
        });
      };
      
      animateScore();
      prevScoreRef.current = score;
    }
  }, [score, controls, animate, isFinalScore]);

  // Show final score label after count-up
  useEffect(() => {
    if (isFinalScore) {
      const timer = setTimeout(() => {
        setShowLabel(true);
        if (countUpComplete) countUpComplete();
      }, 2800); // 2.5s for CountUp + 300ms buffer
      
      return () => clearTimeout(timer);
    }
  }, [isFinalScore, countUpComplete]);

  return (
    <div style={{ marginTop: '20px' }}>
      <WhitePill borderRadius="50px">
        <ScoreValue animate={!isFinalScore ? controls : undefined}>
          {isFinalScore ? (
            <CountUp 
              start={0}
              end={score}
              duration={2.5}
              separator=","
              useEasing={true}
            />
          ) : (
            score.toLocaleString()
          )}
        </ScoreValue>
        
      </WhitePill>
      
      {isFinalScore && (
          <FinalScoreLabel
            initial={{ opacity: 0 }}
            animate={{ opacity: showLabel ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            Final Score
          </FinalScoreLabel>
        )}
    </div>
  );
};

export default ScoreDisplay;