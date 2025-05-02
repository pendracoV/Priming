import React from 'react';
import styled from "styled-components";

// Nuevo contenedor para organizar el formulario en dos columnas
export const TwoColumnLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const FormContainer = styled.div`
    background: rgba(0, 0, 0, 0.5);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 800px;
    text-align: center;
    margin: 20px;
`;

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh; 
    margin: 0;
    padding: 0;
    padding-top: 70px;
    background: url('/images/image.png') no-repeat center center fixed;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

const FormLayout = ({ children, title }) => {
    return (
        <Container>
            <FormContainer>
                {title}
                {children}
            </FormContainer>
        </Container>
    );
};

export default FormLayout;