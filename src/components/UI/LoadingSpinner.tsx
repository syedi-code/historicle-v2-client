import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SpinnerContainer = styled(motion.div)`
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
`;

const SpinnerCircle = styled(motion.div)`
  width: 100%;
  height: 100%;
  border: 4px solid rgba(255, 255, 255, 1);
  border-top-color: white;
  border-radius: 50%;
`;

const LoadingSpinner: React.FC = () => {
  return (
    <SpinnerContainer>
      <SpinnerCircle
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;