import React from 'react';
import styled from 'styled-components';

const BookDetailWrapper = styled.div`
  margin: 0.5rem 0;
  display: flex;
`;

const Label = styled.span`
  font-weight: 600;
  width: 80px;
`;

const Value = styled.span`
  flex: 1;
`;

interface BookDetailProps {
  label: string;
  value: string;
  isCorrect: boolean;
}

const BookDetail: React.FC<BookDetailProps> = ({ label, value, isCorrect }) => {
  return (
    <BookDetailWrapper>
      <Label>{label}:</Label>
      <Value>
        {isCorrect ? (
          <span style={{ color: 'green' }}>✓ </span>
        ) : (
          <span style={{ color: 'red' }}>✗ </span>
        )}
        {value}
      </Value>
    </BookDetailWrapper>
  );
};

export default BookDetail;