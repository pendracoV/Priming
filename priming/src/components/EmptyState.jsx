import React from 'react';
import styled from 'styled-components';
import { P, Button } from '../styles/styles';

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const EmptyState = ({ 
  message = 'No hay datos disponibles.', 
  buttonText = 'Agregar',
  onButtonClick 
}) => (
  <EmptyStateContainer>
    <P>{message}</P>
    {onButtonClick && (
      <Button onClick={onButtonClick}>
        {buttonText}
      </Button>
    )}
  </EmptyStateContainer>
);

export default EmptyState;