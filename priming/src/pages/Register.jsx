// Register.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import {
    GlobalStyle,
    Container,
    FormContainer,
    Input,
    Select,
    Button,
    H1,
    Label,
    A
} from '../styles/styles';
import Modal from '../components/Modal';

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

// Componentes estilados
const PasswordInput = styled(Input)`
    padding-right: 40px;
`;

const PasswordContainer = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
`;

const PasswordToggle = styled.button`
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
    margin-top: 0.25rem;
    text-align: left;
    display: flex;
    align-items: center;
    width: 100%;
`;

const ValidationIcon = styled.span`
    margin-right: 5px;
    display: inline-flex;
    align-items: center;
`;

const ErrorContainer = styled.div`
    width: 100%;
    margin-bottom: 1rem;
`;

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        hasUpperCase: false,
        hasNumber: false,
        passwordsMatch: false
    });
    const [errors, setErrors] = useState({});
    
    // Estado para el modal
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: '',
        onConfirm: () => {},
        confirmText: 'Aceptar',
        showCancel: false
    });

    const [formData, setFormData] = useState({
        nombre: '',
        codigo: '',
        tipo: 'Estudiante',
        correo_electronico: '',
        contrasena: '',
        confirmar_contrasena: '',
        tipo_usuario: 'evaluador'
    });

    // Validar la contraseña cuando cambie
    useEffect(() => {
        const { contrasena, confirmar_contrasena } = formData;
        
        setPasswordValidation({
            hasUpperCase: /[A-Z]/.test(contrasena),
            hasNumber: /[0-9]/.test(contrasena),
            passwordsMatch: contrasena === confirmar_contrasena && contrasena !== ''
        });
    }, [formData.contrasena, formData.confirmar_contrasena]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Borrar errores cuando el usuario empiece a escribir de nuevo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Función para mostrar modal
    const showModal = (title, message, type, onConfirm = null, confirmText = 'Aceptar', showCancel = false) => {
        setModal({
            isOpen: true,
            title,
            message,
            type,
            onConfirm: onConfirm || (() => closeModal()),
            confirmText,
            showCancel
        });
    };

    // Función para cerrar modal
    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    const validateForm = () => {
        const newErrors = {};
        const { nombre, correo_electronico, contrasena, confirmar_contrasena, codigo } = formData;

        if (!nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio";
        }

        if (!codigo.trim()) {
            newErrors.codigo = "El código es obligatorio";
        }

        if (!correo_electronico.trim()) {
            newErrors.correo_electronico = "El correo electrónico es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
            newErrors.correo_electronico = "Introduce un correo electrónico válido";
        }

        if (!contrasena.trim()) {
            newErrors.contrasena = "La contraseña es obligatoria";
        } else {
            if (!passwordValidation.hasUpperCase) {
                newErrors.contrasena = "La contraseña debe contener al menos una letra mayúscula";
            }
            
            if (!passwordValidation.hasNumber) {
                newErrors.contrasena = newErrors.contrasena 
                    ? `${newErrors.contrasena} y un número` 
                    : "La contraseña debe contener al menos un número";
            }
        }

        if (!confirmar_contrasena.trim()) {
            newErrors.confirmar_contrasena = "Debes confirmar la contraseña";
        } else if (contrasena !== confirmar_contrasena) {
            newErrors.confirmar_contrasena = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showModal(
                "Error de validación", 
                "Por favor, corrige los errores en el formulario antes de continuar.",
                "error"
            );
            return;
        }

        // Verificación de correo institucional para estudiantes
        if (formData.tipo === 'Estudiante' && !formData.correo_electronico.endsWith('@utp.edu.co')) {
            showModal(
                "Advertencia", 
                "Para estudiantes se recomienda usar el correo institucional (@utp.edu.co). ¿Deseas continuar con este correo?",
                "warning",
                () => submitForm(),
                "Continuar de todos modos",
                true
            );
            return;
        }

        // Si todo está bien, enviar el formulario
        submitForm();
    };

    const submitForm = async () => {
        try {
            // Mostrar modal de carga
            showModal(
                "Procesando", 
                "Enviando datos de registro...",
                "info"
            );
            
            // Excluir confirmar_contrasena del objeto que se envía al backend
            const { confirmar_contrasena, ...dataToSend } = formData;
            
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, dataToSend);
            
            // Cerrar modal de carga
            closeModal();
            
            // Mostrar modal de éxito
            showModal(
                "Registro Exitoso", 
                res.data.message || "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
                "success",
                () => navigate("/login"),
                "Ir a iniciar sesión"
            );
        } catch (error) {
            console.error("Error en el registro:", error);
            
            // Cerrar modal de carga
            closeModal();
            
            // Manejar el error según el código recibido
            handleApiError(error);
        }
    };

    // Manejador de errores de la API
    const handleApiError = (error) => {
        // Obtener información del error
        const errorResponse = error.response?.data;
        const errorCode = errorResponse?.code;
        const errorMessage = errorResponse?.error;
        const errorDetail = errorResponse?.detail;
        
        // Si no hay código, mostrar un error genérico
        if (!errorCode) {
            showModal(
                "Error", 
                "Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde.",
                "error"
            );
            return;
        }
        
        // Manejar errores según su código
        switch (errorCode) {
            case ERROR_CODES.INVALID_PASSWORD:
                showModal(
                    "Contraseña inválida", 
                    "La contraseña debe tener al menos una letra mayúscula y un número.",
                    "error"
                );
                break;
                
            case ERROR_CODES.INVALID_EMAIL:
                showModal(
                    "Correo inválido", 
                    "Por favor, introduce un correo electrónico válido.",
                    "error"
                );
                break;
                
            case ERROR_CODES.EMAIL_EXISTS:
                showModal(
                    "Correo ya registrado", 
                    "Este correo electrónico ya está registrado. ¿Deseas iniciar sesión?",
                    "warning",
                    () => navigate("/login"),
                    "Ir a iniciar sesión",
                    true
                );
                break;
                
            case ERROR_CODES.CODE_EXISTS:
                // Extraer el código específico del detalle si está disponible
                let codeMessage = "Este código ya está registrado en el sistema.";
                if (errorDetail) {
                    const codeMatch = errorDetail.match(/\(codigo\)=\(([^)]+)\)/);
                    if (codeMatch) {
                        codeMessage = `El código "${codeMatch[1]}" ya está registrado en el sistema.`;
                    }
                }
                
                showModal(
                    "Código duplicado", 
                    codeMessage,
                    "error"
                );
                break;
                
            case ERROR_CODES.MISSING_DATA:
                showModal(
                    "Datos incompletos", 
                    "Por favor, completa todos los campos obligatorios.",
                    "error"
                );
                break;
                
            case ERROR_CODES.SERVER_ERROR:
            default:
                showModal(
                    "Error del servidor", 
                    "Ha ocurrido un error en el servidor. Por favor, intenta más tarde.",
                    "error"
                );
                break;
        }
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <FormContainer>
                    <H1>REGISTRO PRIMING</H1>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        {errors.nombre && (
                            <ValidationMessage valid={false}>
                                <ValidationIcon><FaTimes /></ValidationIcon>
                                {errors.nombre}
                            </ValidationMessage>
                        )}

                        <Select name="tipo" value={formData.tipo} onChange={handleChange}>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Docente">Docente</option>
                            <option value="Egresado">Egresado</option>
                        </Select>

                        <Input
                            type="text"
                            name="codigo"
                            placeholder="Código"
                            value={formData.codigo}
                            onChange={handleChange}
                            required
                        />
                        {errors.codigo && (
                            <ValidationMessage valid={false}>
                                <ValidationIcon><FaTimes /></ValidationIcon>
                                {errors.codigo}
                            </ValidationMessage>
                        )}

                        <Input
                            type="email"
                            name="correo_electronico"
                            placeholder="Correo Electrónico"
                            value={formData.correo_electronico}
                            onChange={handleChange}
                            required
                        />
                        {errors.correo_electronico && (
                            <ValidationMessage valid={false}>
                                <ValidationIcon><FaTimes /></ValidationIcon>
                                {errors.correo_electronico}
                            </ValidationMessage>
                        )}

                        <PasswordContainer>
                            <PasswordInput
                                type={showPassword ? "text" : "password"}
                                name="contrasena"
                                placeholder="Contraseña"
                                value={formData.contrasena}
                                onChange={handleChange}
                                required
                            />
                            <PasswordToggle 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </PasswordToggle>
                        </PasswordContainer>
                        
                        <ErrorContainer>
                            <ValidationMessage valid={passwordValidation.hasUpperCase}>
                                <ValidationIcon>
                                    {passwordValidation.hasUpperCase ? <FaCheck /> : <FaTimes />}
                                </ValidationIcon>
                                Debe contener al menos una letra mayúscula
                            </ValidationMessage>
                            
                            <ValidationMessage valid={passwordValidation.hasNumber}>
                                <ValidationIcon>
                                    {passwordValidation.hasNumber ? <FaCheck /> : <FaTimes />}
                                </ValidationIcon>
                                Debe contener al menos un número
                            </ValidationMessage>
                            
                            {errors.contrasena && (
                                <ValidationMessage valid={false}>
                                    <ValidationIcon><FaTimes /></ValidationIcon>
                                    {errors.contrasena}
                                </ValidationMessage>
                            )}
                        </ErrorContainer>

                        <PasswordContainer>
                            <PasswordInput
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmar_contrasena"
                                placeholder="Confirmar Contraseña"
                                value={formData.confirmar_contrasena}
                                onChange={handleChange}
                                required
                            />
                            <PasswordToggle 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </PasswordToggle>
                        </PasswordContainer>
                        
                        <ValidationMessage valid={passwordValidation.passwordsMatch}>
                            <ValidationIcon>
                                {passwordValidation.passwordsMatch ? <FaCheck /> : <FaTimes />}
                            </ValidationIcon>
                            Las contraseñas coinciden
                        </ValidationMessage>
                        
                        {errors.confirmar_contrasena && (
                            <ValidationMessage valid={false}>
                                <ValidationIcon><FaTimes /></ValidationIcon>
                                {errors.confirmar_contrasena}
                            </ValidationMessage>
                        )}

                        <Button type="submit">Registrarse</Button>
                    </form>
                    <Label>¿Ya tienes una cuenta? <A href="/login">INICIA SESIÓN AQUÍ</A></Label>
                </FormContainer>
            </Container>
            
            {/* Modal para mostrar mensajes */}
            <Modal 
                isOpen={modal.isOpen} 
                onClose={closeModal}
                title={modal.title}
                onConfirm={modal.onConfirm}
                confirmText={modal.confirmText}
                showCancel={modal.showCancel}
            >
                {modal.message}
            </Modal>
        </>
    );
};

export default Register;