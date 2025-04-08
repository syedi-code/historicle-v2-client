import React from 'react';
import styled from 'styled-components';

interface PillProps {
  borderRadius?: string;
}

const Pill = styled.div<PillProps>`
  background-color: white;
  border: 2px solid black;
  border-radius: ${({ borderRadius }) => borderRadius || '50px'};
  padding: 10px 20px;
  display: inline-block;
  margin-bottom: 20px;
`;

interface WhitePillProps {
  borderRadius?: string;
  children: React.ReactNode;
}

const WhitePill: React.FC<WhitePillProps> = ({ borderRadius, children }) => {
  return <Pill borderRadius={borderRadius}>{children}</Pill>;
};

export default WhitePill;