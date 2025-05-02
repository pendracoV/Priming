import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Páginas públicas
import Login from '../pages/Login';
import Register from '../pages/Register';

// Páginas protegidas/privadas
import AsignarAcompanante from '../pages/AsignarAcompanante';
import Perfil from '../pages/Perfil';
import NinosList from '../pages/NinosListPage';
import SeleccionMundos from '../Game/SeleccionMundos';

// Componentes del juego
import NivelCognados from '../Game/levels/NivelCognados';
import NivelParesMinimos from '../Game/levels/NivelParesMinimos';
import Encuesta from '../Game/Encuesta';

// Componente de protección de rutas privadas
const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  
  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si hay usuario, permitir acceso a la ruta
  return <Outlet />;
};

// Componente de protección de rutas de rol específico
const RoleRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);
  
  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si el usuario no tiene el rol permitido, redirigir a home
  if (!allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/login" replace />;
  }
  
  // Si el usuario tiene el rol permitido, permitir acceso
  return <Outlet />;
};

// Componente de protección para rutas públicas (no accesibles si ya está autenticado)
const PublicRoute = ({ restricted = false }) => {
  const { user } = useContext(AuthContext);
  
  // Si está restringido y hay usuario autenticado, redirigir según tipo usuario
  if (restricted && user) {
    // Redirigir según el tipo de usuario - mantén solo los que funcionan
    return <Navigate to="/perfil" replace />;
  }
  
  // Si no está restringido o no hay usuario, permitir acceso
  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas restringidas (no accesibles si ya hay sesión) */}
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Route>
        
        {/* Rutas privadas (requieren autenticación) */}
        <Route element={<PrivateRoute />}>
          <Route path="/perfil" element={<Perfil />} />
          
          {/* Rutas para evaluadores */}
          <Route element={<RoleRoute allowedRoles={['evaluador']} />}>
            <Route path="/asignar-nino" element={<AsignarAcompanante />} />
            <Route path="/ninoslist" element={<NinosList />} />
            <Route path="/seleccion-mundo" element={<SeleccionMundos />}/>
            
            {/* Rutas del juego */}
            <Route path="/nivel/cognados/:dificultad/:nivel" element={<NivelCognados />} />
            <Route path="/nivel/pares-minimos/:dificultad/:nivel" element={<NivelParesMinimos />} />
            <Route path="/encuesta" element={<Encuesta />} />
          </Route>
        </Route>
        
        {/* Ruta para manejar rutas no encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;