import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import {
  GlobalStyle,
  Input,
  Select,
  Button,
  H1,
  H3,
  Label,
  P,
} from '../styles/styles';

import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaUserCircle, FaEnvelope, FaIdCard, FaSchool, FaGraduationCap, FaClock } from 'react-icons/fa';

// Estilos específicos para el perfil
export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    min-height: 100vh; 
    margin: 0;
    padding: 0;
    padding-top: 90px;
    overflow: auto; 
    background: url('/images/image.png') no-repeat center center fixed;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

export const ProfileContainer = styled.div`
    background: rgba(0, 0, 0, 0.5);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 800px;
    text-align: center;
    padding: 50px;
    margin: 20px; 
    margin-top: 0;
`;

export const ProfileHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
`;

export const Avatar = styled.div`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: rgba(252, 117, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 3rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const ProfileDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin: 2rem 0;
    text-align: left;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const DetailItem = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5rem;
`;

export const DetailIcon = styled.div`
    margin-right: 1rem;
    color: #fc7500;
    font-size: 1.2rem;
    width: 30px;
    text-align: center;
`;

export const DetailLabel = styled.div`
    font-weight: bold;
    color: #f4f4f4;
    margin-right: 0.5rem;
`;

export const DetailValue = styled.div`
    color: #f4f4f4;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const PasswordInput = styled(Input)`
    padding-right: 40px;
`;

export const PasswordContainer = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
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
    margin-bottom: 0.5rem;
`;

const ValidationIcon = styled.span`
    margin-right: 5px;
    display: inline-flex;
    align-items: center;
`;

const ValidationContainer = styled.div`
    width: 100%;
    margin-bottom: 1rem;
`;

// Componente de perfil
const Perfil = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estado para el formulario de edición
    const [formData, setFormData] = useState({
        nombre: "",
        correo_electronico: "",
        tipo_usuario: "",
        contrasena: "",
        confirmarContrasena: "",
        codigo: "",
        tipo: "",
        edad: "",
        grado: "",
        colegio: "",
        jornada: "",
    });
    
    // Estado para contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        hasUpperCase: false,
        hasNumber: false,
        hasMinLength: false,
        passwordsMatch: false
    });
    
    // Estados para modales
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    
    // Estado para indicar si se está cargando o guardando datos
    const [loading, setLoading] = useState(false);
    
    // Cargar datos del usuario al iniciar
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        
        fetchUserData();
    }, [user, navigate]);
    
    // Comprobar validación de contraseña cuando cambia
    useEffect(() => {
        const { contrasena, confirmarContrasena } = formData;
        
        setPasswordValidation({
            hasUpperCase: /[A-Z]/.test(contrasena),
            hasNumber: /[0-9]/.test(contrasena),
            hasMinLength: contrasena.length >= 6,
            passwordsMatch: contrasena === confirmarContrasena && contrasena !== ''
        });
    }, [formData.contrasena, formData.confirmarContrasena]);
    
    // Obtener datos actualizados del usuario
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                navigate("/login");
                return;
            }
            
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/perfil`,
                { headers: { Authorization: token } }
            );
            
            const userData = response.data;
            
            // Actualizar el formulario con los datos del usuario
            setFormData({
                nombre: userData.nombre || "",
                correo_electronico: userData.correo_electronico || "",
                tipo_usuario: userData.tipo_usuario || "",
                contrasena: "",
                confirmarContrasena: "",
                codigo: userData.codigo || "",
                tipo: userData.tipo || "",
                edad: userData.edad || "",
                grado: userData.grado || "",
                colegio: userData.colegio || "",
                jornada: userData.jornada || "",
            });
        } catch (error) {
            console.error("Error obteniendo datos del perfil:", error);
            
            // Si hay error de token, cerrar sesión
            if (error.response?.status === 401) {
                logout();
                navigate("/login");
            } else {
                setErrorMessage("No se pudieron cargar los datos del perfil");
                setErrorModal(true);
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    // Abrir modal de edición de perfil
    const openEditModal = () => {
        setEditModalOpen(true);
    };
    
    // Abrir modal de cambio de contraseña
    const openPasswordModal = () => {
        // Resetear campos de contraseña
        setFormData(prev => ({
            ...prev,
            contrasena: "",
            confirmarContrasena: ""
        }));
        setPasswordModalOpen(true);
    };
    
    // Función para alternar visibilidad de la contraseña
    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };
    
    // Función para alternar visibilidad de la confirmación de contraseña
    const toggleConfirmPasswordVisibility = (e) => {
        e.preventDefault();
        setShowConfirmPassword(!showConfirmPassword);
    };
    
    // Guardar cambios de perfil
    const saveProfileChanges = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                navigate("/login");
                return;
            }
            
            // Datos a enviar (solo información básica)
            const dataToSend = {
                nombre: formData.nombre,
                correo_electronico: formData.correo_electronico
            };
            
            // Si es evaluador, incluir tipo y código
            if (user.tipo_usuario === "evaluador") {
                dataToSend.tipo = formData.tipo;
                dataToSend.codigo = formData.codigo;
            }
            
            // Si es niño, incluir datos adicionales
            if (user.tipo_usuario === "niño") {
                dataToSend.edad = formData.edad;
                dataToSend.grado = formData.grado;
                dataToSend.colegio = formData.colegio;
                dataToSend.jornada = formData.jornada;
            }
            
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/perfil`,
                dataToSend,
                { headers: { Authorization: token } }
            );
            
            setEditModalOpen(false);
            setSuccessMessage(response.data.message || "Perfil actualizado correctamente");
            setSuccessModal(true);
            
            // Actualizar datos del perfil
            fetchUserData();
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            setEditModalOpen(false);
            setErrorMessage(error.response?.data?.error || "Error al actualizar el perfil");
            setErrorModal(true);
        } finally {
            setLoading(false);
        }
    };
    
    // Cambiar contraseña
    const changePassword = async () => {
        // Validar contraseña
        if (!passwordValidation.hasUpperCase || !passwordValidation.hasNumber || 
            !passwordValidation.hasMinLength || !passwordValidation.passwordsMatch) {
            setErrorMessage("Por favor, asegúrate de que la contraseña cumple con todos los requisitos");
            setErrorModal(true);
            return;
        }
        
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                navigate("/login");
                return;
            }
            
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/cambiar-password`,
                { contrasena: formData.contrasena },
                { headers: { Authorization: token } }
            );
            
            setPasswordModalOpen(false);
            setSuccessMessage(response.data.message || "Contraseña actualizada correctamente");
            setSuccessModal(true);
            
            // Limpiar campos de contraseña
            setFormData(prev => ({
                ...prev,
                contrasena: "",
                confirmarContrasena: ""
            }));
        } catch (error) {
            console.error("Error cambiando contraseña:", error);
            setPasswordModalOpen(false);
            setErrorMessage(error.response?.data?.error || "Error al cambiar la contraseña");
            setErrorModal(true);
        } finally {
            setLoading(false);
        }
    };
    
    // Obtener la inicial del nombre de usuario
    const getUserInitial = () => {
        if (!user || !user.nombre) return "U";
        return user.nombre.charAt(0).toUpperCase();
    };
    
    // Renderizar el grado en formato legible
    const renderGrado = (grado) => {
        if (grado === "-1" || grado === -1) return "Preescolar";
        if (grado === "1" || grado === 1) return "Primero";
        if (grado === "2" || grado === 2) return "Segundo";
        return grado;
    };
    
    return (
        <>
            <GlobalStyle />
            <Navbar />
            
            <Container>
                <ProfileContainer>
                    {loading && <P>Cargando datos del perfil...</P>}
                    
                    {!loading && (
                        <>
                            <ProfileHeader>
                                <Avatar>{getUserInitial()}</Avatar>
                                <H1>{user?.nombre}</H1>
                                <P>{user?.correo_electronico}</P>
                                <P>{user?.tipo_usuario === 'niño' ? 'Estudiante' : 
                                    user?.tipo_usuario === 'evaluador' ? 'Evaluador' : 
                                    user?.tipo_usuario === 'admin' ? 'Administrador' : 'Usuario'}</P>
                            </ProfileHeader>
                            
                            <ProfileDetails>
                                <DetailItem>
                                    <DetailIcon><FaUserCircle /></DetailIcon>
                                    <DetailLabel>Nombre:</DetailLabel>
                                    <DetailValue>{formData.nombre}</DetailValue>
                                </DetailItem>
                                
                                <DetailItem>
                                    <DetailIcon><FaEnvelope /></DetailIcon>
                                    <DetailLabel>Correo:</DetailLabel>
                                    <DetailValue>{formData.correo_electronico}</DetailValue>
                                </DetailItem>
                                
                                {user?.tipo_usuario === 'evaluador' && (
                                    <>
                                        <DetailItem>
                                            <DetailIcon><FaIdCard /></DetailIcon>
                                            <DetailLabel>Código:</DetailLabel>
                                            <DetailValue>{formData.codigo}</DetailValue>
                                        </DetailItem>
                                        
                                        <DetailItem>
                                            <DetailIcon><FaGraduationCap /></DetailIcon>
                                            <DetailLabel>Tipo:</DetailLabel>
                                            <DetailValue>{formData.tipo}</DetailValue>
                                        </DetailItem>
                                    </>
                                )}
                                
                                {user?.tipo_usuario === 'niño' && (
                                    <>
                                        <DetailItem>
                                            <DetailIcon><FaIdCard /></DetailIcon>
                                            <DetailLabel>Edad:</DetailLabel>
                                            <DetailValue>{formData.edad} años</DetailValue>
                                        </DetailItem>
                                        
                                        <DetailItem>
                                            <DetailIcon><FaGraduationCap /></DetailIcon>
                                            <DetailLabel>Grado:</DetailLabel>
                                            <DetailValue>{renderGrado(formData.grado)}</DetailValue>
                                        </DetailItem>
                                        
                                        <DetailItem>
                                            <DetailIcon><FaSchool /></DetailIcon>
                                            <DetailLabel>Colegio:</DetailLabel>
                                            <DetailValue>{formData.colegio}</DetailValue>
                                        </DetailItem>
                                        
                                        <DetailItem>
                                            <DetailIcon><FaClock /></DetailIcon>
                                            <DetailLabel>Jornada:</DetailLabel>
                                            <DetailValue>{formData.jornada}</DetailValue>
                                        </DetailItem>
                                    </>
                                )}
                            </ProfileDetails>
                            
                            <ButtonGroup>
                                <Button onClick={openEditModal}>Editar Perfil</Button>
                                <Button onClick={openPasswordModal}>Cambiar Contraseña</Button>
                            </ButtonGroup>
                        </>
                    )}
                </ProfileContainer>
            </Container>
            
            {/* Modal de edición de perfil */}
            <Modal 
                isOpen={editModalOpen} 
                onClose={() => setEditModalOpen(false)}
                onConfirm={saveProfileChanges}
                title="Editar Perfil"
                confirmText="Guardar Cambios"
                cancelText="Cancelar"
                showCancel={true}
            >
                <Input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                
                <Input
                    type="email"
                    name="correo_electronico"
                    placeholder="Correo Electrónico"
                    value={formData.correo_electronico}
                    onChange={handleChange}
                    required
                />
                
                {user?.tipo_usuario === 'evaluador' && (
                    <>
                        <Input
                            type="text"
                            name="codigo"
                            placeholder="Código"
                            value={formData.codigo}
                            onChange={handleChange}
                            required
                        />
                        
                        <Select 
                            name="tipo" 
                            value={formData.tipo} 
                            onChange={handleChange}
                            required
                        >
                            <option value="Estudiante">Estudiante</option>
                            <option value="Docente">Docente</option>
                            <option value="Egresado">Egresado</option>
                        </Select>
                    </>
                )}
                
                {user?.tipo_usuario === 'niño' && (
                    <>
                        <Select 
                            name="edad" 
                            value={formData.edad} 
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione edad</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                        </Select>
                        
                        <Select 
                            name="grado" 
                            value={formData.grado} 
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione grado</option>
                            <option value="-1">Preescolar</option>
                            <option value="1">Primero</option>
                            <option value="2">Segundo</option>
                        </Select>
                        
                        <Input
                            type="text"
                            name="colegio"
                            placeholder="Nombre del Colegio"
                            value={formData.colegio}
                            onChange={handleChange}
                            required
                        />
                        
                        <Select 
                            name="jornada" 
                            value={formData.jornada} 
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione jornada</option>
                            <option value="mañana">Mañana</option>
                            <option value="tarde">Tarde</option>
                            <option value="Continua">Continua</option>
                        </Select>
                    </>
                )}
            </Modal>
            
            {/* Modal de cambio de contraseña */}
            <Modal 
                isOpen={passwordModalOpen} 
                onClose={() => setPasswordModalOpen(false)}
                onConfirm={changePassword}
                title="Cambiar Contraseña"
                confirmText="Guardar Contraseña"
                cancelText="Cancelar"
                showCancel={true}
            >
                <PasswordContainer>
                    <PasswordInput
                        type={showPassword ? "text" : "password"}
                        name="contrasena"
                        placeholder="Nueva Contraseña"
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                    />
                    <PasswordToggle 
                        onClick={togglePasswordVisibility}
                        type="button"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </PasswordToggle>
                </PasswordContainer>
                
                <ValidationContainer>
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
                    
                    <ValidationMessage valid={passwordValidation.hasMinLength}>
                        <ValidationIcon>
                            {passwordValidation.hasMinLength ? <FaCheck /> : <FaTimes />}
                        </ValidationIcon>
                        Debe tener al menos 6 caracteres
                    </ValidationMessage>
                </ValidationContainer>
                
                <PasswordContainer>
                    <PasswordInput
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmarContrasena"
                        placeholder="Confirmar Contraseña"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        required
                    />
                    <PasswordToggle 
                        onClick={toggleConfirmPasswordVisibility}
                        type="button"
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
            </Modal>
            
            {/* Modal de éxito */}
            <Modal 
                isOpen={successModal} 
                onClose={() => setSuccessModal(false)}
                onConfirm={() => setSuccessModal(false)}
                title="Operación Exitosa"
                confirmText="Aceptar"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>{successMessage}</p>
            </Modal>
            
            {/* Modal de error */}
            <Modal 
                isOpen={errorModal} 
                onClose={() => setErrorModal(false)}
                onConfirm={() => setErrorModal(false)}
                title="Error"
                confirmText="Entendido"
                showCancel={false}
            >
                <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>{errorMessage}</p>
            </Modal>
        </>
    );
};

export default Perfil;