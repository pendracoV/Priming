// src/data/nivelesConfig.js
// Archivo de configuración para todos los niveles

// Configuración específica para el Nivel 1 de Cognados en modo Fácil
export const cognadosFacilNivel1 = {
    tiempoMaximo: 180, // 3 minutos en segundos
    indicators: [
      {
        id: 1,
        image: '/images/crocodile.png',
        audio: '/audios/cognados/facil/nivel1/indicator.mp3'
      }
    ],
    selectables: [
      // 8 peces correctos (cognados en inglés)
      { 
        id: 1, 
        image: '/images/fish_blue.png', 
        isCorrect: true, 
        indicatorId: 1,
        word: 'actor', // Palabra en inglés (se mostrará en el pez)
        audio: '/audios/cognados/facil/nivel1/actor.mp3'
      },
      { 
        id: 2, 
        image: '/images/fish_yellow.png', 
        isCorrect: true, 
        indicatorId: 1,
        word: 'chocolate', 
        audio: '/audios/cognados/facil/nivel1/chocolate.mp3'
      },
      { 
        id: 3, 
        image: '/images/fish_green.png', 
        isCorrect: true, 
        indicatorId: 1,
        word: 'hospital', 
        audio: '/audios/cognados/facil/nivel1/hospital.mp3'
      },
      { 
        id: 4, 
        image: '/images/fish_orange.png', 
        isCorrect: true, 
        indicatorId: 1,
        word: 'taxi', 
        audio: '/audios/cognados/facil/nivel1/taxi.mp3'
      },
      { 
        id: 5, 
        image: '/images/fish_purple.png', 
        isCorrect: true, 
        indicatorId: 1,
        word: 'piano', 
        audio: '/audios/cognados/facil/nivel1/piano.mp3'
      },
      { 
        id: 6, 
        image: '/images/fish_pink.png', 
        isCorrect: true, 
        indicatorId: 1,
        word: 'radio', 
        audio: '/audios/cognados/facil/nivel1/radio.mp3'
      },
      { 
        id: 7, 
        image: '/images/fish_teal.png', 
        isCorrect: true, 
        indicatorId: 1,
        word: 'banana', 
        audio: '/audios/cognados/facil/nivel1/banana.mp3'
      },
      { 
        id: 8, 
        image: '/images/fish_red.png', 
        isCorrect: true, 
        indicatorId: 1,
        word: 'tiger', 
        audio: '/audios/cognados/facil/nivel1/tiger.mp3'
      },
      
      // 8 peces incorrectos (palabras en español)
      { 
        id: 9, 
        image: '/images/fish_blue.png', 
        isCorrect: false, 
        indicatorId: 1,
        word: 'actor', // Versión en español
        audio: null
      },
      { 
        id: 10, 
        image: '/images/fish_yellow.png', 
        isCorrect: false, 
        indicatorId: 1,
        word: 'chocolate', 
        audio: null
      },
      { 
        id: 11, 
        image: '/images/fish_green.png', 
        isCorrect: false, 
        indicatorId: 1,
        word: 'hospital', 
        audio: null
      },
      { 
        id: 12, 
        image: '/images/fish_orange.png', 
        isCorrect: false, 
        indicatorId: 1,
        word: 'taxi', 
        audio: null
      },
      { 
        id: 13, 
        image: '/images/fish_purple.png', 
        isCorrect: false, 
        indicatorId: 1,
        word: 'piano', 
        audio: null
      },
      { 
        id: 14, 
        image: '/images/fish_pink.png', 
        isCorrect: false, 
        indicatorId: 1,
        word: 'radio', 
        audio: null
      },
      { 
        id: 15, 
        image: '/images/fish_teal.png', 
        isCorrect: false, 
        indicatorId: 1,
        word: 'banana', 
        audio: null
      },
      { 
        id: 16, 
        image: '/images/fish_red.png', 
        isCorrect: false, 
        indicatorId: 1,
        word: 'tigre', 
        audio: null
      }
    ],
    totalCorrect: 8 // Total de elementos correctos en este nivel
  };
  
  // Función para obtener la configuración de un nivel específico
  export const getNivelConfig = (gameType, difficulty, level) => {
    if (gameType === 'cognados') {
      if (difficulty === 'facil') {
        if (level === '1') return cognadosFacilNivel1;
        // Añadir otros niveles fáciles aquí
      } else if (difficulty === 'medio') {
        // Configuraciones para niveles medios
      } else if (difficulty === 'dificil') {
        // Configuraciones para niveles difíciles
      }
    } else if (gameType === 'pares-minimos') {
      // Configuraciones para pares mínimos
    }
    
    return null; // Retornar null si no existe configuración
  };