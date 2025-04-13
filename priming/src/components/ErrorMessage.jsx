// src/components/ErrorMessage.jsx
import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorContainer = styled.div`
  background-color: rgba(255, 107, 107, 0.2);
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: 10px;
  color: #ff6b6b;
`;

const ErrorText = styled.p`
  color: #ffffff;
  margin: 0;
`;

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <ErrorContainer>
      <IconWrapper>
        <FaExclamationTriangle />
      </IconWrapper>
      <ErrorText>{message}</ErrorText>
    </ErrorContainer>
  );
};

export default ErrorMessage;