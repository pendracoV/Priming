import React from 'react';
import styled from "styled-components";
import Modal from "./Modal";

const AcompananteInfo = styled.div`
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  
  p {
    margin: 0.5rem 0;
  }
  
  strong {
    color: #fc7500;
  }
`;

const UserDataModal = ({ isOpen, onClose, onConfirm, userData }) => {
    const { nombre, correo_electronico, edad, grado, colegio, jornada } = userData;
    
    // Helper para mostrar el grado en formato legible
    const getGradoText = (grado) => {
        if (grado === "-1") return "Prescolar";
        if (grado === "1") return "Primero";
        if (grado === "2") return "Segundo";
        return grado;
    };
    
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            onConfirm={onConfirm}
            title="Confirmar Asignación"
            confirmText="Confirmar"
            cancelText="Cancelar"
            showCancel={true}
        >
            <p>¿Estás seguro de que deseas asignar este acompañante?</p>
            <AcompananteInfo>
                <p><strong>Nombre:</strong> {nombre}</p>
                <p><strong>Correo:</strong> {correo_electronico}</p>
                <p><strong>Edad:</strong> {edad} años</p>
                <p><strong>Grado:</strong> {getGradoText(grado)}</p>
                <p><strong>Colegio:</strong> {colegio}</p>
                <p><strong>Jornada:</strong> {jornada}</p>
            </AcompananteInfo>
        </Modal>
    );
};

export default UserDataModal;