// src/routes/AppRoutes.jsx

import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminUserCreate from '../admin/AdminUserCreate';

// Páginas públicas
import Login from '../pages/Login';
import Register from '../pages/Register';

// Páginas privadas comunes
import Perfil from '../pages/Perfil';

// Páginas de evaluador
import AsignarAcompanante from '../pages/AsignarAcompanante';
import NinosList from '../pages/NinosListPage';
import SeleccionMundos from '../Game/SeleccionMundos';
import NivelCognados from '../Game/levels/NivelCognados';
import NivelParesMinimos from '../Game/levels/NivelParesMinimos';
import Encuesta from '../Game/Encuesta';

// ─── Middlewares de Ruta ───────────────────────────────────────────────────────

// Solo usuarios autenticados
const PrivateRoute = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Solo roles específicos
const RoleRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.tipo_usuario)) {
    // si no coincide el rol, volvemos al login
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// Solo rutas públicas (login/registro) cuando NO hay sesión
const PublicRoute = ({ restricted = false }) => {
  const { user } = useContext(AuthContext);
  if (restricted && user) {
    // si ya está logueado, lo mandamos al perfil
    return <Navigate to="/perfil" replace />;
  }
  return <Outlet />;
};

// ─── Definición de Rutas ──────────────────────────────────────────────────────

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1) PÚBLICAS (login / registro) */}
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/login"     element={<Login />} />
          <Route path="/registro"  element={<Register />} />
        </Route>

        {/* 2) PRIVADAS (cualquier usuario autenticado) */}
        <Route element={<PrivateRoute />}>
          <Route path="/perfil" element={<Perfil />} />

          {/* 2a) Evaluador */}
          <Route element={<RoleRoute allowedRoles={['evaluador']} />}>
            <Route path="/asignar-nino" element={<AsignarAcompanante />} />
            <Route path="/ninoslist"     element={<NinosList />} />
            <Route path="/seleccion-mundo" element={<SeleccionMundos />} />
            <Route path="/nivel/cognados/:dificultad/:nivel"    element={<NivelCognados />} />
            <Route path="/nivel/pares-minimos/:dificultad/:nivel" element={<NivelParesMinimos />} />
            <Route path="/encuesta"      element={<Encuesta />} />
          </Route>

          {/* 2b) Administrador */}
          <Route element={<RoleRoute allowedRoles={['administrador']} />}>
            <Route path="/admin/crear-usuario" element={<AdminUserCreate />} />
          </Route>
        </Route>

        {/* 3) CATCH-ALL: redirigir a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
