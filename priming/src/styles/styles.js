// src/styles/styles.js
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Manrope', sans-serif;
  }
`;

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    background: url('/images/image.png') no-repeat center center / cover;
`;

export const FormContainer = styled.div`
    background: rgba(0, 0, 0, 0.5);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 550px;
    text-align: center;
    padding: 50px;
`;

export const Container2 = styled.div`
    background: rgba(255, 255, 255, 0.2);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

export const Input = styled.input`
    width: 75%;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    background: rgba(106, 106, 106);
    border-radius: 50px;
    font-size: 1rem;
    color: #f4f4f4;

    &::placeholder {
        color: #f4f4f4;
        opacity: 0.5;
    }
`;

export const Select = styled.select`
    width: 80%;
    background: rgba(106, 106, 106);
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 1rem;
    color: #f4f4f4;
`;

export const Button = styled.button`
    width: 80%;
    padding: 0.75rem;
    margin: 1rem 0;
    background-color: #fc7500;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e56700;
    }
`;

export const H1 = styled.h1`
    color: #f4f4f4;
`;

export const H3 = styled.h3`
    color: #f4f4f4;
`;

export const Label = styled.label`
    color: #f4f4f4;
`;

export const A = styled.a`
    color: #f4f4f4;
`;

export const LogoutButton = styled(Button)`
    position: fixed; 
    bottom: 20px;
    left: 20px; 
    width: auto; 
    padding: 10px 20px;
    background-color: #ff4d4d; 
    &:hover {
        background-color: #cc0000; 
    }
`;