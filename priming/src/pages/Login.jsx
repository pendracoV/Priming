import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
    GlobalStyle,
    Container,
    FormContainer,
    Input,
    Button,
    H1,
    Label,
    A
} from '../styles/styles';

// Importamos los iconos necesarios
import { FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';

// Definición de códigos de error para el frontend
const ERROR_CODES = {
    ACCESS_DENIED: 1001,
    INVALID_TOKEN: 1002,
    WRONG_PASSWORD: 1003,
    USER_NOT_FOUND: 1004,
    MISSING_CREDENTIALS: 1005,
    
    INVALID_PASSWORD: 2001,
    INVALID_EMAIL: 2002,
    EMAIL_EXISTS: 2003,
    CODE_EXISTS: 2004,
    MISSING_DATA: 2005,
    NOT_EVALUATOR: 2006,
    
    SERVER_ERROR: 5001
};

// Estilo para el input de contraseña personalizado, asegurando suficiente espacio para el icono
export const PasswordInput = styled(Input)`
  padding-right: 40px; /* Espacio para el icono */
  border: ${props => props.error ? '1px solid #ff6b6b' : '1px solid #ddd'};
  
  &:focus {
    border-color: ${props => props.error ? '#ff6b6b' : '#2684ff'};
    box-shadow: ${props => props.error ? '0 0 0 1px #ff6b6b' : '0 0 0 1px #2684ff'};
  }
`;

// Contenedor del input mejorado con margen para mensaje de error
export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${props => props.hasError ? '2.5rem' : '1rem'};
`;

// Estilo para el contenedor del input de contraseña
export const PasswordContainer = styled(InputContainer)`
  position: relative;
`;

// Estilo para el botón de mostrar/ocultar contraseña
export const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: ${props => props.hasError ? 'calc(50% - 10px)' : '50%'};
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
  outline: none; /* Quita el borde de foco */

  &:hover {
    color: #000;
  }
`;

// Estilo para el mensaje de error (color blanco para fondos oscuros)
export const ErrorMessage = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  color: #ffffff; /* Color blanco para que sea visible en fondos oscuros */
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
`;

export const ErrorIcon = styled.span`
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
  color: #ff6b6b; /* El icono en rojo para destacar */
`;

// Input con estilos de error
export const StyledInput = styled(Input)`
  border: ${props => props.error ? '1px solid #ff6b6b' : '1px solid #ddd'};
  
  &:focus {
    border-color: ${props => props.error ? '#ff6b6b' : '#2684ff'};
    box-shadow: ${props => props.error ? '0 0 0 1px #ff6b6b' : '0 0 0 1px #2684ff'};
  }
`;

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ correo_electronico: "", contrasena: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Limpiar error cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación del lado del cliente
        const newErrors = {};
        
        if (!formData.correo_electronico) {
            newErrors.correo_electronico = "El correo electrónico es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico)) {
            newErrors.correo_electronico = "Formato de correo electrónico inválido";
        }
        
        if (!formData.contrasena) {
            newErrors.contrasena = "La contraseña es obligatoria";
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData);
            login(res.data.token, res.data.user);
            navigate("/asignar-acompanante");
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            
            // Procesar error según el código
            handleLoginError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Manejador de errores específicos del login
    const handleLoginError = (error) => {
        const errorResponse = error.response?.data;
        const errorCode = errorResponse?.code;
        const errorMessage = errorResponse?.error;
        
        // Errores específicos según código
        switch (errorCode) {
            case ERROR_CODES.USER_NOT_FOUND:
                setErrors({
                    correo_electronico: "No existe una cuenta con este correo electrónico"
                });
                break;
                
            case ERROR_CODES.WRONG_PASSWORD:
                setErrors({
                    contrasena: "Contraseña incorrecta"
                });
                break;
                
            case ERROR_CODES.MISSING_CREDENTIALS:
                setErrors({
                    correo_electronico: !formData.correo_electronico ? "El correo es obligatorio" : null,
                    contrasena: !formData.contrasena ? "La contraseña es obligatoria" : null
                });
                break;
                
            case ERROR_CODES.INVALID_EMAIL:
                setErrors({
                    correo_electronico: "Formato de correo electrónico inválido"
                });
                break;
                
            default:
                // Error genérico si no hay código o no es reconocido
                setErrors({
                    general: errorMessage || "Error en el inicio de sesión. Intenta nuevamente."
                });
                break;
        }
    };

    // Función para alternar visibilidad de la contraseña
    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    return (
        <>
        <GlobalStyle />
        <Container>
            <FormContainer>
                <H1>PRIMING</H1>
                <form onSubmit={handleSubmit}>
                    <InputContainer hasError={!!errors.correo_electronico}>
                        <StyledInput 
                            type="email" 
                            name="correo_electronico" 
                            placeholder="Correo" 
                            onChange={handleChange}
                            value={formData.correo_electronico}
                            error={!!errors.correo_electronico}
                            required 
                        />
                        {errors.correo_electronico && (
                            <ErrorMessage>
                                <ErrorIcon><FaExclamationTriangle /></ErrorIcon>
                                {errors.correo_electronico}
                            </ErrorMessage>
                        )}
                    </InputContainer>
                    
                    <PasswordContainer hasError={!!errors.contrasena}>
                        <PasswordInput
                            type={showPassword ? "text" : "password"}
                            name="contrasena"
                            placeholder="Contraseña"
                            value={formData.contrasena}
                            onChange={handleChange}
                            error={!!errors.contrasena}
                            required
                        />
                        <PasswordToggle 
                            onClick={togglePasswordVisibility}
                            type="button"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            hasError={!!errors.contrasena}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </PasswordToggle>
                        
                        {errors.contrasena && (
                            <ErrorMessage>
                                <ErrorIcon><FaExclamationTriangle /></ErrorIcon>
                                {errors.contrasena}
                            </ErrorMessage>
                        )}
                    </PasswordContainer>
                    
                    {errors.general && (
                        <ErrorMessage style={{ marginBottom: '1rem', textAlign: 'center' }}>
                            <ErrorIcon><FaExclamationTriangle /></ErrorIcon>
                            {errors.general}
                        </ErrorMessage>
                    )}
                    
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>
                <Label>¿No tienes una cuenta? <A href="/register">REGISTRATE</A></Label>
            </FormContainer>
        </Container>
        </>
    );
};

export default Login;