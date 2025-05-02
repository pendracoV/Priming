// src/Game/levels/NivelCognados.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';

// Importar la configuración de niveles
import { getNivelConfig } from '../data/nivelesConfig';

// Importar imágenes
import coinImage from '../../../public/images/coin.png'; // Ajusta la ruta según tu estructura

const NivelCognados = () => {
  // Obtener contexto de autenticación
  const { user } = useContext(AuthContext);
  
  // Obtener parámetros de la URL
  const { dificultad, nivel } = useParams();
  const navigate = useNavigate();
  
  // Estados para el juego
  const [score, setScore] = useState(200); // Puntaje inicial
  const [correctSelections, setCorrectSelections] = useState(0);
  const [totalSelections, setTotalSelections] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTraining, setIsTraining] = useState(true); // Comienza en modo entrenamiento
  const [levelConfig, setLevelConfig] = useState(null);
  const [selectedFishes, setSelectedFishes] = useState([]);
  const [audioPlayed, setAudioPlayed] = useState(0); // Contador para el entrenamiento
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Cargar la configuración del nivel
  useEffect(() => {
    const config = getNivelConfig('cognados', dificultad, nivel);
    if (config) {
      setLevelConfig(config);
      setRemainingTime(config.tiempoMaximo);
      
      // Guardar progreso actual si hay usuario
      if (user) {
        const userId = user.id;
        localStorage.setItem(`progress_cognados_${dificultad}_${userId}`, JSON.stringify({
          gameType: 'cognados',
          difficulty: dificultad,
          level: nivel,
          score: 200, // Valor inicial
          timestamp: new Date().toISOString()
        }));
      }
    }
  }, [dificultad, nivel, user]);
  
  // Configurar temporizador cuando cambia el modo de entrenamiento
  useEffect(() => {
    let timer;
    if (!isTraining && levelConfig) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            evaluateLevel();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTraining, levelConfig]);
  
  // Función para reproducir audio del indicador
  const playIndicatorAudio = (indicatorId) => {
    if (!levelConfig) return;
    
    // Obtener el indicador según su ID
    const indicator = levelConfig.indicators.find(ind => ind.id === indicatorId);
    if (!indicator) return;
    
    if (isTraining) {
      setAudioPlayed(prev => {
        const newCount = prev + 1;
        return newCount;
      });
    }
    
    // Reproducir el audio
    try {
      const audio = new Audio(indicator.audio);
      audio.play();
    } catch (error) {
      console.error("Error reproduciendo audio:", error);
    }
  };
  
  // Función para manejar selección de pez
  const handleFishSelection = (fish) => {
    if (isTraining || selectedFishes.includes(fish.id)) return;
    
    // Añadir a la lista de seleccionados
    setSelectedFishes([...selectedFishes, fish.id]);
    
    // Verificar si es correcto
    if (fish.isCorrect) {
      setScore(prev => prev + 10);
      setCorrectSelections(prev => prev + 1);
      setShowSuccessMessage(true);
      // Ocultar mensaje después de 1 segundo
      setTimeout(() => setShowSuccessMessage(false), 1000);
      
      // Reproducir sonido de acierto
      try {
        const audio = new Audio('/audios/correct.mp3');
        audio.play();
      } catch (error) {
        console.error("Error reproduciendo audio de acierto:", error);
      }
    } else {
      setScore(prev => prev - 10);
      // Reproducir sonido de error
      try {
        const audio = new Audio('/audios/incorrect.mp3');
        audio.play();
      } catch (error) {
        console.error("Error reproduciendo audio de error:", error);
      }
    }
    
    setTotalSelections(prev => prev + 1);
    
    // Verificar si se han seleccionado todos los correctos
    if (levelConfig && correctSelections + (fish.isCorrect ? 1 : 0) === levelConfig.totalCorrect) {
      // Esperar a que termine la animación o sonido
      setTimeout(() => evaluateLevel(), 1000);
    }
  };
  
  // Guardar progreso actual
  const saveProgress = () => {
    if (user) {
      const userId = user.id;
      const progress = {
        gameType: 'cognados',
        difficulty: dificultad,
        level: nivel,
        score: score,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`progress_cognados_${dificultad}_${userId}`, JSON.stringify(progress));
    }
  };
  
  // Evaluar si el nivel se completó correctamente
  const evaluateLevel = () => {
    if (!levelConfig) return;
    
    // Verificar si el porcentaje de aciertos es al menos 80%
    const successRate = totalSelections > 0 ? (correctSelections / totalSelections) * 100 : 0;
    
    // Guardar progreso antes de navegar
    saveProgress();
    
    if (successRate >= 80) {
      // Determinar cuál es el siguiente nivel
      const currentLevel = parseInt(nivel);
      const maxLevels = dificultad === 'facil' ? 10 : 5; // 10 niveles para fácil, 5 para medio y difícil
      
      if (currentLevel < maxLevels) {
        // Avanzar al siguiente nivel de la misma dificultad
        navigate(`/nivel/cognados/${dificultad}/${currentLevel + 1}`);
      } else {
        // Si era el último nivel de la dificultad actual, mostrar mensaje de completado
        alert("¡Felicidades! Has completado todos los niveles de esta dificultad.");
        navigate('/seleccion-mundo');
      }
    } else {
      // Si no alcanzó el 80%, volver al primer nivel de la dificultad actual
      alert("No has alcanzado el mínimo del 80% de aciertos. Volverás al primer nivel.");
      navigate(`/nivel/cognados/${dificultad}/1`);
    }
  };
  
  // Ir a la encuesta
  const goToSurvey = () => {
    // Guardar progreso antes de navegar
    saveProgress();
    
    navigate('/encuesta', { 
      state: { 
        gameType: 'cognados', 
        difficulty: dificultad, 
        level: nivel,
        score: score
      } 
    });
  };
  
  // Ir al siguiente nivel (botón "Siguiente nivel")
  const goToNextLevel = () => {
    // Guardar progreso antes de navegar
    saveProgress();
    
    const currentLevel = parseInt(nivel);
    const maxLevels = dificultad === 'facil' ? 10 : 5;
    
    if (currentLevel < maxLevels) {
      navigate(`/nivel/cognados/${dificultad}/${currentLevel + 1}`);
    } else {
      navigate('/seleccion-mundo');
    }
  };
  
  // Si no hay configuración de nivel, mostrar carga
  if (!levelConfig) {
    return (
      <LoadingContainer>
        <LoadingText>Cargando nivel...</LoadingText>
      </LoadingContainer>
    );
  }
  
  return (
    <>
      {/* Información del nivel en la esquina superior izquierda */}
      <LevelInfo>
        <LevelBadge>
          MUNDO: COGNADO<br />
          NIVEL: {dificultad.toUpperCase()}
        </LevelBadge>
      </LevelInfo>
      
      {/* Contenedor principal */}
      <GameContainer>
        {/* Isla con indicador (cocodrilo) */}
        <IslandContainer>
          {levelConfig.indicators.map((indicator) => (
            <Indicator 
              key={indicator.id}
              onClick={() => playIndicatorAudio(indicator.id)}
            >
              <img src={indicator.image} alt="Cocodrilo" />
            </Indicator>
          ))}
        </IslandContainer>
        
        {/* Área de seleccionables (peces) */}
        <SelectablesContainer>
          {levelConfig.selectables.map((fish) => (
            <Selectable 
              key={fish.id}
              selected={selectedFishes.includes(fish.id)}
              onClick={() => handleFishSelection(fish)}
            >
              <img src={fish.image} alt="Pez" />
              <FishWord>{fish.word}</FishWord>
            </Selectable>
          ))}
        </SelectablesContainer>
        
        {/* Puntaje */}
        <ScoreContainer>
          <img src={coinImage} alt="Moneda" />
          <ScoreText>{score}</ScoreText>
        </ScoreContainer>
        
        {/* Botones de navegación */}
        <NavigationButtons>
          <Button onClick={goToNextLevel}>
            Siguiente nivel
          </Button>
          <Button onClick={goToSurvey}>
            Ir a encuesta
          </Button>
        </NavigationButtons>
        
        {/* Tiempo restante (solo visible durante el juego) */}
        {!isTraining && (
          <TimeContainer>
            <TimeText>
              {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
            </TimeText>
          </TimeContainer>
        )}
        
        {/* Fase de entrenamiento - Overlay */}
        {isTraining && (
          <TrainingOverlay>
            <TrainingText>
              Presiona el cocodrilo 10 veces para entrenarte
              <TrainingCounter>{audioPlayed}/10</TrainingCounter>
            </TrainingText>
            {audioPlayed >= 10 && (
              <StartButton onClick={() => setIsTraining(false)}>
                ¡COMENZAR JUEGO!
              </StartButton>
            )}
          </TrainingOverlay>
        )}
        
        {/* Mensaje de éxito al seleccionar correctamente */}
        {showSuccessMessage && (
          <SuccessMessage>
            <SuccessText>¡Correcto! +10 monedas</SuccessText>
          </SuccessMessage>
        )}
      </GameContainer>
    </>
  );
};

// Estilos específicos para este nivel
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0a0a2a;
`;

const LoadingText = styled.p`
  color: white;
  font-size: 24px;
`;

const LevelInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
`;

const LevelBadge = styled.div`
  background-color: rgba(20, 20, 60, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  line-height: 1.3;
`;

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: #3498db; /* Fondo azul para simular el agua */
`;

const IslandContainer = styled.div`
  width: 400px;
  height: 250px;
  margin-top: 10%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/images/island.png'); /* Ajusta la ruta según tu estructura */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const Indicator = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  img {
    width: 80px;
    height: auto;
  }
`;

const SelectablesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 50px;
  width: 80%;
  max-width: 800px;
`;

const Selectable = styled.div`
  cursor: pointer;
  transition: transform 0.3s;
  opacity: ${props => props.selected ? 0.6 : 1};
  transform: ${props => props.selected ? 'scale(0.9)' : 'scale(1)'};
  position: relative;
  text-align: center;
  
  &:hover {
    transform: ${props => props.selected ? 'scale(0.9)' : 'scale(1.1)'};
  }
  
  img {
    width: 60px;
    height: auto;
  }
`;

const FishWord = styled.div`
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const ScoreContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background-color: rgba(20, 20, 60, 0.7);
  padding: 8px 15px;
  border-radius: 20px;
  
  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

const ScoreText = styled.span`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const TimeContainer = styled.div`
  position: absolute;
  top: 70px;
  right: 20px;
  background-color: rgba(20, 20, 60, 0.7);
  padding: 8px 15px;
  border-radius: 20px;
`;

const TimeText = styled.span`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const NavigationButtons = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  background-color: rgba(147, 68, 134, 0.8);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(147, 68, 134, 1);
  }
`;

const TrainingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const TrainingText = styled.div`
  background-color: rgba(20, 20, 60, 0.9);
  color: white;
  padding: 20px;
  border-radius: 15px;
  font-size: 20px;
  margin-bottom: 30px;
  text-align: center;
`;

const TrainingCounter = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
`;

const StartButton = styled.button`
  background-color: rgba(147, 68, 134, 0.9);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 15px 30px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(147, 68, 134, 1);
    transform: scale(1.05);
  }
`;

const SuccessMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(40, 167, 69, 0.9);
  padding: 15px 30px;
  border-radius: 15px;
  animation: fadeInOut 1s ease-in-out;
  
  @keyframes fadeInOut {
    0% { opacity: 0; }
    25% { opacity: 1; }
    75% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const SuccessText = styled.div`
  color: white;
  font-size: 22px;
  font-weight: bold;
`;

export default NivelCognados;