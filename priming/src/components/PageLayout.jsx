import React from 'react';
import styled from 'styled-components';

// Contenedor principal para páginas que elimina el scroll innecesario
export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh; 
    margin: 0;
    padding: 0;
    padding-top: 90px;
    /* Eliminamos overflow: auto para evitar scroll innecesario */
    background: url('/images/image.png') no-repeat center center fixed;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

// Componente para tablas y formularios
export const ContentContainer = styled.div`
    background: rgba(0, 0, 0, 0.5);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: ${props => props.maxWidth || '850px'};
    text-align: center;
    padding: 50px;
    margin: 20px; 
    margin-top: 0;
    overflow: ${props => props.hasOverflow ? 'auto' : 'visible'};
    max-height: ${props => props.hasOverflow ? 'calc(100vh - 180px)' : 'none'};
`;

// Error display component
export const ErrorMessage = ({ message, onRetry }) => (
  <div style={{ textAlign: 'center' }}>
    <p style={{ color: '#ff4d4d' }}>{message}</p>
    {onRetry && (
      <button onClick={onRetry} style={{ 
        padding: '8px 16px', 
        backgroundColor: '#fc7500',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px'
      }}>
        Intentar nuevamente
      </button>
    )}
  </div>
);

const PageLayout = ({ children, title, maxWidth, hasOverflow = false }) => {
  return (
    <Container>
      <ContentContainer maxWidth={maxWidth} hasOverflow={hasOverflow}>
        {title}
        {children}
      </ContentContainer>
    </Container>
  );
};

export default PageLayout;