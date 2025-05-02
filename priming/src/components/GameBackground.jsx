import React from 'react';
import styled from 'styled-components';
// Importamos la imagen de fondo
// Nota: Para que coincida con el mockup, deberías tener una imagen de fondo con tonos azules y morados
// con olas en la parte inferior
import backgroundImage from '../../public/images/Background.png';

// Paleta de colores basada en el mockup
const colors = {
  darkPurple: '#1e1b4b', // Fondo de las tarjetas
  purple: '#a855f7',     // Bordes y acentos
  lightPurple: '#8b5cf6', // Gradiente superior
  blue: '#3b82f6',       // Gradiente inferior
  white: '#ffffff',      // Texto
};

// Contenedor principal
export const GameContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    background: url(${backgroundImage}) no-repeat center center / cover;
    
    /* Si no tienes una imagen de fondo adecuada, puedes usar este gradiente como alternativa */
    /* background: linear-gradient(180deg, ${colors.lightPurple} 0%, ${colors.blue} 100%); */
`;



// Contenedor para el contenido principal
export const GameContentContainer = styled.div`
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: ${props => props.maxWidth || '1000px'};
    text-align: center;
    margin: 20px;
`;

// Componente principal GameBackground
const GameBackground = ({ 
  children, 
  title, 
  maxWidth,
}) => {
  return (
    <GameContainer>
      {/* Contenedor del contenido principal */}
      <GameContentContainer maxWidth={maxWidth}>
        {title}
        {children}
      </GameContentContainer>
    </GameContainer>
  );
};

export default GameBackground;