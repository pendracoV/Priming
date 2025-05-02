import React, { useState } from 'react';
import styled from "styled-components";
import { Input } from '../styles/styles';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { FormFieldContainer, FieldLabel } from './FormField';

export const PasswordInput = styled(Input)`
    padding-right: 40px;
`;

export const PasswordContainer = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 0.25rem;
`;

export const PasswordToggle = styled.button`
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    color: #000;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    padding: 0;
    margin: 0;
    outline: none;

    &:hover {
        color: #000;
    }
`;

const ValidationMessage = styled.div`
    color: ${props => props.valid ? '#ffffff' : '#ffffff'};
    font-size: 0.8rem;
    text-align: left;
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 0.25rem;
`;

const ValidationIcon = styled.span`
    margin-right: 5px;
    display: inline-flex;
    align-items: center;
`;

const ValidationContainer = styled.div`
    width: 100%;
    margin-bottom: 0.75rem;
`;

// Componente para el campo de contraseña principal
const PasswordField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    error, 
    required = true, 
    placeholder,
    showValidation = false,
    validation = {},
    isConfirmField = false
}) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };
    
    return (
        <FormFieldContainer>
            <FieldLabel>{label}</FieldLabel>
            <PasswordContainer>
                <PasswordInput
                    type={showPassword ? "text" : "password"}
                    name={name}
                    placeholder={placeholder || `Ingrese ${label.toLowerCase()}`}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
                <PasswordToggle 
                    onClick={togglePasswordVisibility}
                    type="button"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
            </PasswordContainer>
            
            {error && (
                <ValidationMessage valid={false}>
                    <ValidationIcon><FaTimes /></ValidationIcon>
                    {error}
                </ValidationMessage>
            )}
            
            {showValidation && !isConfirmField && (
                <ValidationContainer>
                    <ValidationMessage valid={validation.hasUpperCase}>
                        <ValidationIcon>
                            {validation.hasUpperCase ? <FaCheck /> : <FaTimes />}
                        </ValidationIcon>
                        Al menos una letra mayúscula
                    </ValidationMessage>
                    
                    <ValidationMessage valid={validation.hasNumber}>
                        <ValidationIcon>
                            {validation.hasNumber ? <FaCheck /> : <FaTimes />}
                        </ValidationIcon>
                        Al menos un número
                    </ValidationMessage>
                    
                    <ValidationMessage valid={validation.hasMinLength}>
                        <ValidationIcon>
                            {validation.hasMinLength ? <FaCheck /> : <FaTimes />}
                        </ValidationIcon>
                        Mínimo 6 caracteres
                    </ValidationMessage>
                </ValidationContainer>
            )}
            
            {showValidation && isConfirmField && (
                <ValidationContainer>
                    <ValidationMessage valid={validation.passwordsMatch}>
                        <ValidationIcon>
                            {validation.passwordsMatch ? <FaCheck /> : <FaTimes />}
                        </ValidationIcon>
                        Las contraseñas coinciden
                    </ValidationMessage>
                </ValidationContainer>
            )}
        </FormFieldContainer>
    );
};

export default PasswordField;