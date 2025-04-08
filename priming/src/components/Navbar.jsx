import React, { useState } from 'react';
import styled from 'styled-components';
import { A } from '../styles/styles';
import { LogoutButton } from '../styles/styles';

// Navbar container
export const NavbarContainer = styled.nav`
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
  height: 70px; /* Altura fija para el navbar */
`;

// Logo container
export const NavbarLogo = styled.div`
  display: flex;
  align-items: center;
`;

// Logo image
export const LogoImage = styled.img`
  height: 40px;
  margin-right: 10px;
`;

// Logo text
export const LogoText = styled.h2`
  color: #f4f4f4;
  margin: 0;
  font-size: 1.5rem;
`;

// Navigation links container - modificado para alinearse a la derecha
export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto; /* Empuja los enlaces a la derecha */

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
    margin-left: 0; /* Resetea el margen en móvil */
  }
`;

// Individual navigation link
export const NavLink = styled(A)`
  margin: 0 1rem;
  text-decoration: none;
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
export const HamburgerButton = styled.button`
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
  margin-left: auto; /* Lo coloca a la derecha cuando se muestra */

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
export const NavbarSpacer = styled.div`
  height: 70px; /* Debe coincidir con la altura del navbar */
  width: 100%;
`;

// Complete Navbar component
const Navbar = ({ logoSrc, appName, links = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NavbarContainer>
        <NavbarLogo>
          {logoSrc && <LogoImage src={logoSrc} alt={`${appName} logo`} />}
          <LogoText>{appName}</LogoText>
        </NavbarLogo>

        <HamburgerButton onClick={() => setIsOpen(!isOpen)}>
          <div />
          <div />
          <div />
        </HamburgerButton>

        <NavLinks isOpen={isOpen}>
          {links.map((link, index) => (
            <NavLink key={index} href={link.url}>
              {link.text}
            </NavLink>
          ))}
        </NavLinks>
      </NavbarContainer>
      <NavbarSpacer />
    </>
  );
};

export default Navbar;