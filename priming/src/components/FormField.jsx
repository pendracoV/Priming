import React from 'react';
import styled from "styled-components";
import { Input, Select } from '../styles/styles';
import { FaTimes } from 'react-icons/fa';

// Contenedor para cada campo del formulario
export const FormFieldContainer = styled.div`
    margin-bottom: 0.5rem;
    text-align: left;
`;

// Etiqueta para campos de formulario
export const FieldLabel = styled.label`
    display: block;
    margin-bottom: 0.3rem;
    color: #ffffff;
    font-weight: 500;
    font-size: 0.9rem;
`;

export const ValidationMessage = styled.div`
    color: ${props => props.valid ? '#ffffff' : '#ffffff'};
    font-size: 0.8rem;
    text-align: left;
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 0.25rem;
`;

export const ValidationIcon = styled.span`
    margin-right: 5px;
    display: inline-flex;
    align-items: center;
`;

const FormField = ({ label, name, type = "text", value, onChange, error, required = true, placeholder, children }) => {
    return (
        <FormFieldContainer>
            <FieldLabel>{label}</FieldLabel>
            
            {children ? children : (
                type === "select" ? (
                    <Select 
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                    />
                ) : (
                    <Input 
                        type={type}
                        name={name}
                        placeholder={placeholder || `Ingrese ${label.toLowerCase()}`}
                        value={value}
                        onChange={onChange}
                        required={required}
                    />
                )
            )}
            
            {error && (
                <ValidationMessage valid={false}>
                    <ValidationIcon><FaTimes /></ValidationIcon>
                    {error}
                </ValidationMessage>
            )}
        </FormFieldContainer>
    );
};

export default FormField;