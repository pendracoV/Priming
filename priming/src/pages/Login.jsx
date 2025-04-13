import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import {
    GlobalStyle,
    Container,
    FormContainer,
    Input,
    Button,
    H1,
    Label
} from '../styles/styles';
import { FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';

// Estilos existentes
export const PasswordInput = styled(Input)`
  padding-right: 40px;
  border: ${props => props.error ? '1px solid #ff6b6b' : '1px solid #ddd'};
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${props => props.hasError ? '2.5rem' : '1rem'};
`;

export const PasswordContainer = styled(InputContainer)`
  position: relative;
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
`;

export const ErrorMessage = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  color: #ffffff;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
`;

export const ErrorIcon = styled.span`
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
  color: #ff6b6b;
`;

export const StyledInput = styled(Input)`
  border: ${props => props.error ? '1px solid #ff6b6b' : '1px solid #ddd'};
`;

export const RegisterLink = styled(Link)`
  color: #fc7500;
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
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
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación básica
        const newErrors = {};
        if (!formData.correo_electronico) {
            newErrors.correo_electronico = "El correo electrónico es obligatorio";
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
            console.log("Iniciando solicitud de login");
            const apiUrl = `${import.meta.env.VITE_API_URL}/login`;
            console.log("URL de la API:", apiUrl);
            
            const response = await axios.post(apiUrl, formData);
            console.log("Respuesta recibida:", response.data);
            
            if (response.data && response.data.token) {
                // Guardar en localStorage (opcional, depende de tu implementación)
                localStorage.setItem('token', response.data.token);
                
                // Usar la función de login del contexto
                login(response.data.token, response.data.user);
                
                // Redirección basada en el tipo de usuario
                if (response.data.user.tipo_usuario === 'evaluador') {
                    navigate("/asignar-nino");
                } else if (response.data.user.tipo_usuario === 'niño') {
                    navigate("/juegos");
                } else if (response.data.user.tipo_usuario === 'admin') {
                    navigate("/usuarios");
                } else {
                    navigate("/");
                }
            } else {
                throw new Error("Respuesta inválida del servidor");
            }
        } catch (error) {
            console.error("Error en inicio de sesión:", error);
            
            // Manejar errores de forma simple
            setErrors({
                general: error.response?.data?.error || "Error al iniciar sesión. Intenta nuevamente."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
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
                        />
                        <PasswordToggle 
                            onClick={togglePasswordVisibility}
                            type="button"
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
                        <div style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>
                            <FaExclamationTriangle style={{ marginRight: '5px' }} />
                            {errors.general}
                        </div>
                    )}
                    
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>
                
                <Label>¿No tienes una cuenta? <RegisterLink to="/registro">REGISTRATE</RegisterLink></Label>
            </FormContainer>
        </Container>
        </>
    );
};

export default Login;