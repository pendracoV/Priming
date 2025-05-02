import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la redirección
import styled from 'styled-components';
import GameBackground from '../components/GameBackground';
// Importamos las imágenes directamente desde public
import islandImage from '../../public/images/island.png';
import pirateIslandImage from '../../public/images/pirate-island.png';
// Importamos el GlobalStyle para mantener la consistencia de fuentes
import { GlobalStyle } from '../styles/styles';

// Paleta de colores basada en el mockup
const colors = {
  darkPurple: '#1e1b4b', // Fondo de las tarjetas
  purple: '#a855f7',     // Bordes y acentos
  lightPurple: '#8b5cf6', // Gradiente superior
  blue: '#3b82f6',       // Gradiente inferior
  buttonPurple: '#934486', // Color de los botones
  white: '#ffffff',      // Texto
};

// Contenedor principal para las tarjetas con opacidad
const MainContainer = styled.div`
  background: rgba(20, 20, 50, 0.5); // Fondo azul oscuro con opacidad
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  width: 100%;               
  max-width: 900px;          
  margin: 0 auto;           
`;

// Título principal
const Title = styled.h1`
  color: ${colors.white};
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 50px;
  font-family: 'Manrope', sans-serif;
  text-align: center;
`;

// Componentes específicos para esta pantalla con colores actualizados
const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
  flex-wrap: wrap;
`;

const GameCard = styled.div`
  width: 300px;
  height: 380px;
  background: rgba(30, 27, 75, 0.87); // Aquí se define la opacidad (0.87 = 87% opaco)
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
  }
`;

const GameImageContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  border: 3px solid ${colors.purple};
`;

const GameImageElement = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GameTitle = styled.h2`
  color: ${colors.white};
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-family: 'Manrope', sans-serif;
`;

const DifficultySelect = styled.select`
  width: 90%;
  padding: 10px;
  background-color: rgba(147, 68, 134, 0.7); // Color del botón con transparencia
  color: ${colors.white};
  border: none;
  border-radius: 10px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
  font-family: 'Manrope', sans-serif;
  transition: background-color 0.3s;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.purple};
  }

  option {
    background-color: rgba(65, 21, 75, 0.95); // Más opaco para mejor legibilidad de opciones
    color: ${colors.white};
  }
  
  &:hover {
    background-color: rgba(147, 68, 134, 0.85); // Un poco más opaco al pasar el mouse
  }
`;

const PlayButton = styled.button`
  width: 90%;
  padding: 12px;
  background-color: rgba(147, 68, 134, 0.7); // Color del botón con transparencia
  color: ${colors.white};
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Manrope', sans-serif;
  
  &:hover {
    background-color: rgba(147, 68, 134, 0.9); // Más opaco al pasar el mouse
  }
`;

const SeleccionMundos = () => {
  const [cognatesDifficulty, setCognatesDifficulty] = useState('facil');
  const [pairsDifficulty, setPairsDifficulty] = useState('facil');
  const navigate = useNavigate();
  
  const handleCognatesPlay = () => {
    // Guardar selección en localStorage
    localStorage.setItem('lastGameType', 'cognados');
    localStorage.setItem('lastDifficulty', cognatesDifficulty);
    localStorage.setItem('lastLevel', '1'); // Explícitamente nivel 1
    
    // Redirige directamente al nivel 1 de Cognados con la dificultad seleccionada
    navigate(`/nivel/cognados/${cognatesDifficulty}/1`);
  };
  
  const handlePairsPlay = () => {
    // Guardar selección en localStorage
    localStorage.setItem('lastGameType', 'pares-minimos');
    localStorage.setItem('lastDifficulty', pairsDifficulty);
    localStorage.setItem('lastLevel', '1'); // Explícitamente nivel 1
    
    // Redirige directamente al nivel 1 de Pares Mínimos con la dificultad seleccionada
    navigate(`/nivel/pares-minimos/${pairsDifficulty}/1`);
  };

  return (
    <>
      <GlobalStyle />
      <GameBackground maxWidth="1200px">
        <MainContainer>
          <Title>Selecciona tu mundo</Title>
          <CardsContainer>
            {/* Tarjeta de Cognados */}
            <GameCard>
              <GameImageContainer>
                <GameImageElement src={islandImage} alt="Isla de cognados" />
              </GameImageContainer>
              <GameTitle>Cognados</GameTitle>
              <DifficultySelect 
                value={cognatesDifficulty}
                onChange={(e) => setCognatesDifficulty(e.target.value)}
              >
                <option value="facil">Dificultad: Fácil</option>
                <option value="medio">Dificultad: Medio</option>
                <option value="dificil">Dificultad: Difícil</option>
              </DifficultySelect>
              <PlayButton onClick={handleCognatesPlay}>JUGAR</PlayButton>
            </GameCard>
            
            {/* Tarjeta de Pares Mínimos */}
            <GameCard>
              <GameImageContainer>
                <GameImageElement src={pirateIslandImage} alt="Isla pirata" />
              </GameImageContainer>
              <GameTitle>Pares mínimos</GameTitle>
              <DifficultySelect
                value={pairsDifficulty}
                onChange={(e) => setPairsDifficulty(e.target.value)}
              >
                <option value="facil">Dificultad: Fácil</option>
                <option value="medio">Dificultad: Medio</option>
                <option value="dificil">Dificultad: Difícil</option>
              </DifficultySelect>
              <PlayButton onClick={handlePairsPlay}>JUGAR</PlayButton>
            </GameCard>
          </CardsContainer>
        </MainContainer>
      </GameBackground>
    </>
  );
};

export default SeleccionMundos;