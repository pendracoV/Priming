import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Creamos el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para el usuario autenticado
  const [user, setUser] = useState(null);
  // Estado para indicar si la autenticación está siendo verificada
  const [loading, setLoading] = useState(true);

  // Función para iniciar sesión
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verificar el token con el backend usando la ruta correcta
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/verify-token`, 
            { headers: { Authorization: token } }
          );
          
          // Si el token es válido, establecer el usuario
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            // Si el token no es válido, eliminar el token
            logout();
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          logout();
        }
      }
      
      // Indicar que la verificación ha terminado
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Proporcionar el contexto de autenticación a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Mostrar los hijos solo cuando la verificación de autenticación haya terminado */}
      {!loading ? children : 
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          Cargando...
        </div>
      }
    </AuthContext.Provider>
  );
};