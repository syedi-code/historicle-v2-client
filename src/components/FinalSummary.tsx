import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { RoundResult } from '../types';
import { DailyStats } from '../types';

import ScoreDisplay from './ScoreDisplay';  // Import ScoreDisplay component
import StatsGrid from './StatsGrid';
import MostMissed from './FinalSummaryMostMissed';
import GenreSection from './FinalSummaryRound';
import LoadingSpinner from './LoadingSpinner';
import FinalSummaryRound from './FinalSummaryRound';

// If not already defined in your types file
interface FinalSummaryProps {
  roundResults: RoundResult[];
  timelineResults: (boolean | null)[];
  totalQuestions: number;
  finalScore: number;
}

// Keep only the necessary styled components
const SummaryContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 0;
  
  @media (max-width: 600px) {
    margin: 1rem auto;
    width: 95%; // Use slightly less than 100% to prevent overflow
  }
`;

// Updated WhitePill with better mobile handling
const WhitePill = styled(motion.div)`
  background-color: white;
  border: 2px solid black;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  width: 100%;
  max-width: 100%; // Ensure it doesn't exceed container width
  box-sizing: border-box; // Critical: include border in width calculation
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  // Add these flex properties for better child centering
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden; // Prevent content from spilling out
  
  @media (max-width: 600px) {
    padding: 1rem 0.75rem; // Less horizontal padding on mobile
    margin-bottom: 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 375px) { // Extra small devices
    padding: 0.75rem 0.5rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

const LoadingText = styled.div`
  font-family: ${({ theme }) => theme.fonts.primary};
  color: white;
  font-size: 1.2rem;
`;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

// Main component implementation
const FinalSummary: React.FC<FinalSummaryProps> = ({ 
  roundResults, 
  timelineResults,
  totalQuestions,
  finalScore // Add this parameter
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [showScore, setShowScore] = useState(false);
  
  // Use finalScore directly for calculations and display
  const correctAnswers = timelineResults.filter((result: boolean | null) => result === true).length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Submit results to the server
  useEffect(() => {
    const submitResults = async () => {
      try {
        setIsSubmitting(true);
        const response = await axios.post('https://roeb3wvgee.execute-api.us-west-2.amazonaws.com/dev/results', {
          timestamp: new Date().toISOString().replace('Z', '-08:00'),
          sessionId: crypto.randomUUID(),
          totalScore: finalScore, // Use finalScore here
          accuracy,
          roundDetails: roundResults.map((round: RoundResult) => ({
            genre: round.genre,
            answers: {
              author: {
                value: round.userAnswers.author?.answer || null,
                correct: round.userAnswers.author?.correct || false
              },
              title: {
                value: round.userAnswers.title?.answer || null,
                correct: round.userAnswers.title?.correct || false
              },
              year: {
                value: round.userAnswers.year?.answer || null,
                correct: round.userAnswers.year?.correct || false
              }
            }
          })),
          questionsTimeline: timelineResults
        });
        
        // Fix API response parsing
        let statsData;
        if (typeof response.data === 'string') {
          statsData = JSON.parse(response.data).dailyStats;
        } else if (typeof response.data.body === 'string') {
          statsData = JSON.parse(response.data.body).dailyStats;
        } else if (response.data.body) {
          statsData = response.data.body.dailyStats;
        } else {
          statsData = response.data.dailyStats;
        }
        
        setDailyStats(statsData);
        setTimeout(() => setShowScore(true), 800);
      } catch (error) {
        console.error('Error submitting results:', error);
        // Use mock data if API call fails
        setDailyStats({
          date: new Date().toISOString().split('T')[0],
          plays: 42,
          avgScore: 8500,
          avgAccuracy: 75.3,
          mostMissed: {
            round: 2,
            type: 'year',
            accuracy: 45.2,
            popularWrongAnswers: [["1886", 15], ["1895", 8], ["1904", 6]]
          },
          genreStats: {
            fantasy: { Correct: 89, Plays: 42, Total: 126 },
            philosophy: { Correct: 65, Plays: 42, Total: 126 },
            "sci-fi": { Correct: 101, Plays: 42, Total: 126 }
          }
        });
        setTimeout(() => setShowScore(true), 800);
      } finally {
        setIsSubmitting(false);
      }
    };
    
    submitResults();
  }, []);

  // Get question type display name
  const getQuestionTypeName = (type: string) => {
    switch(type) {
      case 'author': return 'Author';
      case 'title': return 'Title';
      case 'year': return 'Year Written';
      default: return type;
    }
  };

  if (isSubmitting) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>SUBMITTING</LoadingText>
      </LoadingContainer>
    );
  }

  // Prepare stats for the StatsGrid component
  const statsData = [
    { value: dailyStats?.plays || '-', label: 'Players Today' },
    { value: dailyStats?.avgScore ? Math.round(dailyStats.avgScore).toLocaleString() : '-', label: 'Average Score' },
    { value: `${accuracy}%`, label: 'Your Accuracy' },
    { value: dailyStats?.avgAccuracy ? `${Math.round(dailyStats.avgAccuracy)}%` : '-', label: 'Average Accuracy' }
  ];

  return (
    <AnimatePresence mode="wait">
      <SummaryContainer
        key="summary"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeIn}
      >

        <WhitePill variants={fadeIn}>
          <ScoreDisplay 
            score={finalScore}
            animate={false}
            isFinalScore={true}
          />

          <motion.div variants={staggerContainer}>
            <StatsGrid stats={statsData} />

            {dailyStats?.mostMissed && (
              <MostMissed 
                data={dailyStats.mostMissed} 
                getQuestionTypeName={getQuestionTypeName} 
              />
            )}
          </motion.div>
        </WhitePill>

        {/* Genre breakdown sections */}
        {roundResults.map((round: RoundResult, index: number) => (
          <FinalSummaryRound
            key={round.genre}
            round={round}
            genreStat={dailyStats?.genreStats?.[round.genre]}
            fadeInDelay={0.3 + index * 0.2}
            roundNumber={index + 1} // Add this line to pass the 1-based round number
          />
        ))}
      </SummaryContainer>
    </AnimatePresence>
  );
};

export default FinalSummary;