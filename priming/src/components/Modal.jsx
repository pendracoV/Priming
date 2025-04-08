// Modal.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/styles';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  max-width: 500px;
  width: 90%;
  color: #f4f4f4;
  text-align: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalHeader = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #f4f4f4;
  font-size: 1.5rem;
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
  
  p {
    margin-bottom: 0.75rem;
    line-height: 1.5;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #f4f4f4;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #fc7500;
  width: auto;
  padding: 0.5rem 1.5rem;
  
  &:hover {
    background-color: #e56700;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #444;
  width: auto;
  padding: 0.5rem 1.5rem;
  
  &:hover {
    background-color: #333;
  }
`;

// Componente Modal
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  showCancel = true 
}) => {
  // Evitar scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Limpieza al desmontar
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;
  
  // Handler para prevenir la propagación de clics dentro del modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={handleModalClick}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        
        <ModalBody>
          {children}
        </ModalBody>
        
        <ModalFooter>
          {showCancel && (
            <SecondaryButton onClick={onClose}>
              {cancelText}
            </SecondaryButton>
          )}
          
          <PrimaryButton onClick={onConfirm}>
            {confirmText}
          </PrimaryButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;