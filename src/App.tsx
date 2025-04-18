import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle, useTheme } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion'; // Make sure AnimatePresence is imported

// Updated import paths to match the new folder structure
import PassageCarousel from './components/Passage/PassageCarousel';
import QuestionInterface from './components/Answer/AnswerInterface';
import Background from './components/UI/Background';
import ScoreDisplay from './components/Stats/ScoreDisplay';
import RoundTimeline from './components/Stats/RoundTimeline';
import RoundSummary from './components/Summary/RoundSummary';
import FinalSummary from './components/Summary/FinalSummary';
import { DailyData, Book, UserAnswers, RoundResult } from './types';
import LoadingSpinner from './components/UI/LoadingSpinner';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
  }
  
  body {
    background-color: #F5F5DC;
    font-family: ${({ theme }) => theme.fonts.secondary};
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 0;
`;

const API_URL = "https://roeb3wvgee.execute-api.us-west-2.amazonaws.com/prod/daily";

// Add fade animation variants
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.5, ease: "easeIn" }
  }
};

function App() {
  const theme = useTheme();
  // Use theme colors instead of hardcoded array
  const backgroundColors = [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary, theme.colors.summary];
  const [bgColor, setBgColor] = useState(backgroundColors[0]);

  // Store all rounds retrieved from the backend.
  const [data, setData] = useState<DailyData[] | null>(null);
  // Track which round (genre) is active.
  const [currentRound, setCurrentRound] = useState(0);
  // Round-specific state.
  const [totalScore, setTotalScore] = useState(9000); // Start with 9000 total points
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [roundUserAnswers, setRoundUserAnswers] = useState<UserAnswers>({});
  // Accumulate overall round results.
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  // True when all rounds are completed.
  const [allRoundsCompleted, setAllRoundsCompleted] = useState(false);
  // Timeline results: an array of 9 values (null initially)
  const [timelineResults, setTimelineResults] = useState<(boolean | null)[]>(Array(9).fill(null));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        // Expecting response.data.results as an array of DailyData.
        console.log(response.data);
        setData(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Update answer and score for the active round.
  const handleAnswerSubmit = (
    questionType: string,
    isCorrect: boolean,
    answerText: string,
    points: number,
    globalQuestionIndex: number // new parameter
  ) => {
    // Update score with floor of 0
    setTotalScore((prevScore) => Math.max(0, prevScore + points));
    
    setRoundUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionType]: { answer: answerText, correct: isCorrect },
    }));
    
    // Update timeline results
    setTimelineResults((prevResults) => {
      const newResults = [...prevResults];
      newResults[globalQuestionIndex] = isCorrect;
      return newResults;
    });
  };

  const handleRoundComplete = () => {
    setRoundCompleted(true);
  };

  // triggerDeduction now only subtracts points without showing a tooltip.
  const triggerDeduction = useCallback((deduction: number, pos: { x: number; y: number }) => {
    setTotalScore((prev) => Math.max(0, prev - deduction));
  }, []);

  // Called when user clicks "Next Round" with background transition.
  const goToNextRound = () => {
    if (!data) return;
    
    // Save current round result with current total score
    setRoundResults((prev) => [
      ...prev,
      {
        genre: data[currentRound].genre,
        score: totalScore, // Use totalScore instead of roundScore
        userAnswers: roundUserAnswers,
        passages: data[currentRound].dailyPassages, // Include passages
        correctAuthor: correctBook.Author,          // Add correct author
        correctTitle: correctBook.Title,           // Add correct title
        correctYear: String(correctBook.YearWritten) // Add correct year
      }
    ]);
    
    // Update the background color for transition
    const nextBgColor = backgroundColors[(currentRound + 1) % backgroundColors.length];
    setBgColor(nextBgColor);

    // If this was the last round, mark completion
    if (currentRound >= data.length - 1) {
      setAllRoundsCompleted(true);
    } else {
      // Otherwise, move to the next round and reset round-specific state
      setCurrentRound((prev) => prev + 1);
      setRoundUserAnswers({});
      setRoundCompleted(false);
      // Note: We no longer reset the score since we're using a single totalScore
    }
  };

  // Render overall summary if all rounds are done.
  const renderOverallSummary = () => {
    // Aggregate overall score, etc.
    const totalScore = roundResults.reduce((sum, round) => sum + round.score, 0);
    return (
      <div>
        <h2>Overall Summary</h2>
        <p>Total Score: {totalScore}</p>
        {roundResults.map((round, index) => (
          <div key={index}>
            <h3>{round.genre.toUpperCase()}</h3>
            <p>Score: {round.score}</p>
          </div>
        ))}
      </div>
    );
  };

  // Until data is fetched, show loading.
  if (!data) {
    return (
      <>
        <GlobalStyle />
        <AnimatePresence mode="wait">
          <motion.div
            key="loading"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CenteredContainer>
              <LoadingSpinner />
            </CenteredContainer>
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  // If all rounds are completed, show overall summary.
  if (allRoundsCompleted) {
    return (
      <>
        <GlobalStyle />
        <Background bgColor={bgColor} />
        <AnimatePresence mode="wait">
          <motion.div
            key="summary"
            className="App"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CenteredContainer>
              <FinalSummary 
                roundResults={roundResults}
                timelineResults={timelineResults}
                totalQuestions={9} // 3 rounds * 3 questions
                finalScore={totalScore} // Pass the actual final score
              />
            </CenteredContainer>
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  // Current round's data.
  const currentData = data[currentRound];
  const { correctBook, wrongBooks, dailyPassages, genre } = currentData;
  // Build the round label to send down to DivCarousel.
  const roundLabel = `${genre.toUpperCase()}`;

  return (
    <>
      <GlobalStyle />
      <Background bgColor={bgColor} />
      <AnimatePresence mode="wait">
        <motion.div
          key={`round-${currentRound}-${roundCompleted}`} // Using a composite key to trigger animations on state changes
          className="App"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CenteredContainer>
            <ScoreDisplay score={totalScore} />
            <PassageCarousel
              dailyPassages={dailyPassages}
              ribbonText={{
                author: correctBook.Author,
                title: correctBook.Title,
                year: String(correctBook.YearWritten),
              }}
              triggerDeduction={triggerDeduction}
              roundLabel={roundLabel}
            />
            {!roundCompleted ? (
              <>
                <QuestionInterface
                  roundIndex={currentRound}  // used to compute globalQuestionIndex inside QuestionInterface
                  dailyBook={correctBook}
                  wrongBooks={wrongBooks}
                  questionOrder={['author', 'title', 'year']}
                  onAnswerSubmit={handleAnswerSubmit}
                  onGameComplete={handleRoundComplete}
                  triggerDeduction={triggerDeduction}
                />
                {/* Render RoundTimeline below the QuestionInterface */}
                <RoundTimeline 
                  results={timelineResults} 
                  genres={data.map(item => item.genre)}
                />
              </>
            ) : (
              <RoundSummary
                roundNumber={currentRound + 1}  // Display human-friendly round number.
                genre={genre}
                correctAnswers={{
                  author: correctBook.Author,
                  title: correctBook.Title,
                  year: String(correctBook.YearWritten),
                }}
                userAnswers={roundUserAnswers}
                onNextRound={goToNextRound}
              />
            )}
          </CenteredContainer>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
