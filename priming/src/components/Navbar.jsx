import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaUser } from 'react-icons/fa';

// Navbar container
const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem 3rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  height: 70px;
`;

// Logo container
const NavbarLogo = styled.div`
  display: flex;
  align-items: center;
`;

// Logo image
const LogoImage = styled.img`
  height: 40px;
  margin-right: 10px;
`;

// Logo text
const LogoText = styled.h2`
  color: #f4f4f4;
  margin: 0;
  font-size: 1.5rem;
`;

// Navigation links container - alineados a la derecha
const NavLinks = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    padding: 1rem 0;
    width: 100%;
    margin-left: 0;
  }
`;

// Individual navigation link
const NavLink = styled(Link)`
  margin: 0 1rem;
  text-decoration: none;
  color: #f4f4f4;
  position: relative;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #fc7500;
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: #fc7500;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    padding: 0.5rem 0;
    width: 100%;
    text-align: center;
  }
`;

// Hamburger menu button for mobile
const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  margin-left: auto;

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    display: flex;
  }
  
  div {
    width: 2rem;
    height: 0.25rem;
    background: #f4f4f4;
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }
`;

// Contenedor principal que añade espacio para el navbar
const NavbarSpacer = styled.div`
  height: 70px;
  width: 100%;
`;

// Componente de información del usuario
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  position: relative;
  cursor: pointer;
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    padding: 0.5rem 0;
    width: 100%;
    justify-content: center;
  }
`;

const UserAvatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #fc7500;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2rem;
`;

const UserName = styled.span`
  color: #f4f4f4;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const ChevronIcon = styled.span`
  margin-left: 5px;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

// Dropdown menu
const DropdownMenu = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 180px;
  padding: 0.5rem 0;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    margin-top: 0.5rem;
    box-shadow: none;
    border-radius: 0;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #f4f4f4;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(252, 117, 0, 0.2);
    color: #fc7500;
  }

  svg {
    margin-right: 10px;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  color: #f4f4f4;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;

  &:hover {
    background-color: rgba(252, 117, 0, 0.2);
    color: #fc7500;
  }

  svg {
    margin-right: 10px;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  // Cierra el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    // Agregar evento cuando el dropdown está abierto
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Función para definir las rutas disponibles según el tipo de usuario
  const getRoutes = () => {
    // Rutas públicas (accesibles sin iniciar sesión)
    const publicRoutes = [
      { path: '/', label: 'Inicio' },
      { path: '/acerca-de', label: 'Acerca de' },
      { path: '/contacto', label: 'Contacto' }
    ];

    // Si no hay usuario autenticado, mostrar solo rutas públicas y login/registro
    if (!user) {
      return [
        ...publicRoutes,
        { path: '/login', label: 'Iniciar Sesión' },
        { path: '/registro', label: 'Registrarse' }
      ];
    }

    // Rutas para niños
    if (user.tipo_usuario === 'niño') {
      return [
        { path: '/', label: 'Inicio' },
        { path: '/juegos', label: 'Juegos' }
      ];
    }

    // Rutas para evaluadores (docentes, estudiantes, egresados)
    if (user.tipo_usuario === 'evaluador') {
      return [
        { path: '/', label: 'Inicio' },
        { path: '/asignar-nino', label: 'Asignar Niño' },
        { path: '/resultados', label: 'Resultados' },
        { path: '/ninoslist', label: 'Asignaciones' }
      ];
    }

    // Rutas para administradores
    if (user.tipo_usuario === 'admin') {
      return [
        { path: '/', label: 'Inicio' },
        { path: '/usuarios', label: 'Gestión de Usuarios' },
        { path: '/encuestas', label: 'Gestión de Encuestas' },
        { path: '/estadisticas', label: 'Estadísticas' }
      ];
    }

    // Por defecto, devolver rutas públicas
    return publicRoutes;
  };

  const routes = getRoutes();

  // Función para obtener la inicial del nombre de usuario
  const getUserInitial = () => {
    if (!user || !user.nombre) return "U";
    return user.nombre.charAt(0).toUpperCase();
  };

  return (
    <>
      <NavbarContainer>
        <NavbarLogo>
          <LogoImage src="/images/logo.png" alt="PRIMING logo" />
          <LogoText>PRIMING</LogoText>
        </NavbarLogo>

        <HamburgerButton onClick={() => setIsOpen(!isOpen)}>
          <div />
          <div />
          <div />
        </HamburgerButton>

        <NavLinks isOpen={isOpen}>
          {routes.map((route, index) => (
            <NavLink key={index} to={route.path} onClick={() => setIsOpen(false)}>
              {route.label}
            </NavLink>
          ))}
          
          {user && (
            <UserInfo ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <UserAvatar>
                {getUserInitial()}
              </UserAvatar>
              <UserName>
                {user.nombre}
                <ChevronIcon isOpen={dropdownOpen}>
                  <FaChevronDown />
                </ChevronIcon>
              </UserName>
              
              <DropdownMenu isOpen={dropdownOpen}>
                <DropdownItem to="/perfil" onClick={() => setDropdownOpen(false)}>
                  <FaUser />
                  Mi Perfil
                </DropdownItem>
                <LogoutButton onClick={handleLogout}>
                  <FaSignOutAlt />
                  Cerrar Sesión
                </LogoutButton>
              </DropdownMenu>
            </UserInfo>
          )}
        </NavLinks>
      </NavbarContainer>
      <NavbarSpacer />
    </>
  );
};

export default Navbar;