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
  A,
  Li,
  Ul,
  P,
} from '../styles/styles';

import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

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

export const FormContainer = styled.div`
    background: rgba(0, 0, 0, 0.5);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 550px;
    text-align: center;
    padding: 50px;
    margin: 20px; 
    margin-top: 0;
`;

export const Container2 = styled.div`
    background: rgba(255, 255, 255, 0.2);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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

// Objeto con códigos de error del backend
const ERROR_CODES = {
  // Errores de autenticación
  ACCESS_DENIED: 1001,
  INVALID_TOKEN: 1002,
  WRONG_PASSWORD: 1003,
  USER_NOT_FOUND: 1004,
  MISSING_CREDENTIALS: 1005,
  
  // Errores de registro
  INVALID_PASSWORD: 2001,
  INVALID_EMAIL: 2002,
  EMAIL_EXISTS: 2003,
  CODE_EXISTS: 2004,
  MISSING_DATA: 2005,
  NOT_EVALUATOR: 2006,
  
  // Errores de servidor
  SERVER_ERROR: 5001
};

const AsignarEvaluador = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [nino, setNino] = useState({
    nombre: "",
    correo_electronico: "",
    tipo_usuario: "niño",
    contrasena: "",
    confirmarContrasena: "",
    edad: "",
    grado: "",
    colegio: "",
    jornada: "",
  });
  
  const [listaNinos, setListaNinos] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasUpperCase: false,
    hasNumber: false,
    hasMinLength: false,
    passwordsMatch: false
  });
  const [errors, setErrors] = useState({});
  
  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  // Estados para modales de error
  const [modalError, setModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailExistsModal, setEmailExistsModal] = useState(false);
  const [incompleteDataModal, setIncompleteDataModal] = useState(false);
  const [serverErrorModal, setServerErrorModal] = useState(false);
  const [notEvaluatorModal, setNotEvaluatorModal] = useState(false);
  const [invalidTokenModal, setInvalidTokenModal] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [emailValidationModal, setEmailValidationModal] = useState(false);
  
  const [missingFields, setMissingFields] = useState([]);
  
  // Comprobar validación de contraseña cuando cambia
  useEffect(() => {
    const { contrasena, confirmarContrasena } = nino;
    
    setPasswordValidation({
      hasUpperCase: /[A-Z]/.test(contrasena),
      hasNumber: /[0-9]/.test(contrasena),
      hasMinLength: contrasena.length >= 6,
      passwordsMatch: contrasena === confirmarContrasena && contrasena !== ''
    });
  }, [nino.contrasena, nino.confirmarContrasena]);

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
  
  // Validar correo electrónico
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validar contraseñas y mostrar modal si hay errores
  const validatePasswords = () => {
    const { contrasena, confirmarContrasena } = nino;
    
    // Verificar requisitos de contraseña
    if (!contrasena || !passwordValidation.hasUpperCase || !passwordValidation.hasNumber || !passwordValidation.hasMinLength) {
      setPasswordModalOpen(true);
      return false;
    }
    
    // Verificar coincidencia de contraseñas
    if (!confirmarContrasena || contrasena !== confirmarContrasena) {
      setPasswordModalOpen(true);
      return false;
    }
    
    return true;
  };

  // Validar formulario completo
  const validateForm = () => {
    const newErrors = {};
    const missingFieldsList = [];
    
    // Validar campos obligatorios
    if (!nino.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
      missingFieldsList.push("Nombre");
    }
    
    if (!nino.correo_electronico.trim()) {
      newErrors.correo_electronico = "El correo electrónico es obligatorio";
      missingFieldsList.push("Correo electrónico");
    } else if (!validateEmail(nino.correo_electronico)) {
      newErrors.correo_electronico = "El formato del correo electrónico no es válido";
      setEmailValidationModal(true);
      return false;
    }
    
    if (!nino.colegio.trim()) {
      newErrors.colegio = "El nombre del colegio es obligatorio";
      missingFieldsList.push("Colegio");
    }
    
    if (!nino.edad) {
      newErrors.edad = "Debe seleccionar una edad";
      missingFieldsList.push("Edad");
    }
    
    if (!nino.grado) {
      newErrors.grado = "Debe seleccionar un grado";
      missingFieldsList.push("Grado");
    }
    
    if (!nino.jornada) {
      newErrors.jornada = "Debe seleccionar una jornada";
      missingFieldsList.push("Jornada");
    }
    
    setErrors(newErrors);
    
    // Si hay errores en los campos básicos, mostrar modal de datos incompletos
    if (Object.keys(newErrors).length > 0) {
      setMissingFields(missingFieldsList);
      setIncompleteDataModal(true);
      return false;
    }
    
    // Validar contraseñas
    return validatePasswords();
  };

  // Cargar la lista de niños asignados al evaluador cuando se cargue el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (user) {
      fetchAssignedNinos();
    }
  }, [user, navigate]);

  // Función para obtener los niños asignados al evaluador
  const fetchAssignedNinos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/evaluador/ninos`,
        { headers: { Authorization: token } }
      );
      setListaNinos(response.data);
    } catch (error) {
      console.error("Error obteniendo niños asignados:", error);
      
      // Manejar errores específicos en la carga de niños
      if (error.response?.data?.code) {
        switch (error.response.data.code) {
          case ERROR_CODES.INVALID_TOKEN:
            setInvalidTokenModal(true);
            setTimeout(() => {
              logout();
              navigate("/login");
            }, 3000);
            break;
          case ERROR_CODES.NOT_EVALUATOR:
            setNotEvaluatorModal(true);
            setTimeout(() => {
              navigate("/");
            }, 3000);
            break;
          default:
            setServerErrorModal(true);
            break;
        }
      }
    }
  };

  // Manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    setNino({ ...nino, [e.target.name]: e.target.value });
    
    // Borrar errores cuando el usuario empiece a escribir de nuevo
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  // Mostrar el modal de confirmación
  const showConfirmationModal = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setModalOpen(true);
  };
  
  // Función para enviar los datos al servidor
  const submitForm = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setModalOpen(false);
      setInvalidTokenModal(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    if (!user?.id) {
      setModalOpen(false);
      setInvalidTokenModal(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    const datosEnviados = {
      nombre: nino.nombre,
      correo_electronico: nino.correo_electronico,
      contrasena: nino.contrasena,
      edad: parseInt(nino.edad),
      grado: parseInt(nino.grado),
      colegio: nino.colegio,
      jornada: nino.jornada,
    };

    console.log("📩 Datos enviados al backend:", datosEnviados);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/asignar-evaluador`,
        datosEnviados,
        { headers: { Authorization: token } }
      );

      setModalOpen(false);
      setModalSuccess(true);
      setModalMessage(res.data.message || "✅ Acompañante asignado correctamente");
      
      // Actualizamos la lista de niños asignados tras el registro exitoso
      fetchAssignedNinos();

      // Reiniciamos el formulario
      setNino({
        nombre: "",
        correo_electronico: "",
        tipo_usuario: "niño",
        contrasena: "",
        confirmarContrasena: "",
        edad: "",
        grado: "",
        colegio: "",
        jornada: "",
      });
      setErrors({});
    } catch (error) {
      console.error("❌ Error asignando acompañante:", error);
      setModalOpen(false);
      
      // Manejar errores específicos según códigos del backend
      if (error.response?.data?.code) {
        switch (error.response.data.code) {
          case ERROR_CODES.EMAIL_EXISTS:
            setEmailExistsModal(true);
            break;
          case ERROR_CODES.MISSING_DATA:
            setMissingFields(error.response.data.fields || ["Datos del formulario"]);
            setIncompleteDataModal(true);
            break;
          case ERROR_CODES.NOT_EVALUATOR:
            setNotEvaluatorModal(true);
            setTimeout(() => {
              navigate("/");
            }, 3000);
            break;
          case ERROR_CODES.INVALID_TOKEN:
          case ERROR_CODES.ACCESS_DENIED:
            setInvalidTokenModal(true);
            setTimeout(() => {
              logout();
              navigate("/login");
            }, 3000);
            break;
          case ERROR_CODES.INVALID_EMAIL:
            setEmailValidationModal(true);
            break;
          case ERROR_CODES.INVALID_PASSWORD:
            setPasswordModalOpen(true);
            break;
          case ERROR_CODES.SERVER_ERROR:
          default:
            setServerErrorModal(true);
            break;
        }
      } else {
        // Error genérico
        setErrorMessage(error.response?.data?.error || "Error al asignar acompañante");
        setModalError(true);
      }
    }
  };

  // Cerrar modal de éxito
  const closeSuccessModal = () => {
    setModalSuccess(false);
  };

  // Manejar cierre de sesión
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <GlobalStyle />
      
      {/* Navbar fuera del Container */}
      <Navbar 
        logoSrc="../images/logo.png"
        appName="PRIMING"
        links={[
          { text: 'Inicio', url: '/' },
          { text: 'Servicios', url: '/servicios' },
          { text: 'Acerca de', url: '/acerca' },
          { text: 'Contacto', url: '/contacto' },
          { text: 'Cerrar Sesión', onClick: handleLogout }
        ]}
        user={{ name: user?.nombre || 'Usuario', avatar: '/avatar.jpg' }}
      />

      <Container>
        <FormContainer>
          <H1>Asignar Acompañante</H1>

          <form onSubmit={showConfirmationModal}>
            <Input
              type="text"
              name="nombre"
              placeholder="Ingrese el nombre"
              value={nino.nombre}
              onChange={handleChange}
              required
            />
            {errors.nombre && (
              <ValidationMessage valid={false}>
                <ValidationIcon><FaTimes /></ValidationIcon>
                {errors.nombre}
              </ValidationMessage>
            )}

            <Select name="edad" value={nino.edad} onChange={handleChange} required>
              <option value="">Seleccione edad</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </Select>
            {errors.edad && (
              <ValidationMessage valid={false}>
                <ValidationIcon><FaTimes /></ValidationIcon>
                {errors.edad}
              </ValidationMessage>
            )}

            <Select name="grado" value={nino.grado} onChange={handleChange} required>
              <option value="">Seleccione grado</option>
              <option value="-1">Prescolar</option>
              <option value="1">Primero</option>
              <option value="2">Segundo</option>
            </Select>
            {errors.grado && (
              <ValidationMessage valid={false}>
                <ValidationIcon><FaTimes /></ValidationIcon>
                {errors.grado}
              </ValidationMessage>
            )}

            <Select name="jornada" value={nino.jornada} onChange={handleChange} required>
              <option value="">Seleccione jornada</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="Continua">Continua</option>
            </Select>
            {errors.jornada && (
              <ValidationMessage valid={false}>
                <ValidationIcon><FaTimes /></ValidationIcon>
                {errors.jornada}
              </ValidationMessage>
            )}

            <Input
              type="text"
              name="colegio"
              placeholder="Ingrese el nombre del Colegio"
              value={nino.colegio}
              onChange={handleChange}
              required
            />
            {errors.colegio && (
              <ValidationMessage valid={false}>
                <ValidationIcon><FaTimes /></ValidationIcon>
                {errors.colegio}
              </ValidationMessage>
            )}

            <Input
              type="email"
              name="correo_electronico"
              placeholder="Ingrese el correo electrónico"
              value={nino.correo_electronico}
              onChange={handleChange}
              required
            />
            {errors.correo_electronico && (
              <ValidationMessage valid={false}>
                <ValidationIcon><FaTimes /></ValidationIcon>
                {errors.correo_electronico}
              </ValidationMessage>
            )}

            {/* Campo de contraseña con botón para mostrar/ocultar */}
            <PasswordContainer>
              <PasswordInput
                type={showPassword ? "text" : "password"}
                name="contrasena"
                placeholder="Contraseña"
                value={nino.contrasena}
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

            {/* Mensajes de validación para la contraseña */}
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
              
              {errors.contrasena && (
                <ValidationMessage valid={false}>
                  <ValidationIcon><FaTimes /></ValidationIcon>
                  {errors.contrasena}
                </ValidationMessage>
              )}
            </ValidationContainer>

            {/* Campo de confirmar contraseña con botón para mostrar/ocultar */}
            <PasswordContainer>
              <PasswordInput
                type={showConfirmPassword ? "text" : "password"}
                name="confirmarContrasena"
                placeholder="Confirmar contraseña"
                value={nino.confirmarContrasena}
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
            
            {/* Mensaje de coincidencia de contraseñas */}
            <ValidationMessage valid={passwordValidation.passwordsMatch}>
              <ValidationIcon>
                {passwordValidation.passwordsMatch ? <FaCheck /> : <FaTimes />}
              </ValidationIcon>
              Las contraseñas coinciden
            </ValidationMessage>
            
            {errors.confirmarContrasena && (
              <ValidationMessage valid={false}>
                <ValidationIcon><FaTimes /></ValidationIcon>
                {errors.confirmarContrasena}
              </ValidationMessage>
            )}

            <Button type="submit">Asignar Acompañante</Button>
          </form>

          <H3>Niños asignados</H3>
          {listaNinos.length === 0 ? (
              <P>No hay niños asignados.</P>
          ) : (
              <Ul>
                  {listaNinos.map((item) => (
                      <Li key={item.encuesta_id}>
                          {item.nino_nombre} ({item.nino_correo}) - Edad: {item.edad}, Grado: {item.grado}, Colegio: {item.colegio}, Jornada: {item.jornada}
                      </Li>
                  ))}
              </Ul>
          )}
        </FormContainer>
      </Container>
      
      {/* Modal de confirmación */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onConfirm={submitForm}
        title="Confirmar Asignación"
        confirmText="Confirmar"
        cancelText="Cancelar"
        showCancel={true}
      >
        <p>¿Estás seguro de que deseas asignar este niño?</p>
        <AcompananteInfo>
          <p><strong>Nombre:</strong> {nino.nombre}</p>
          <p><strong>Correo:</strong> {nino.correo_electronico}</p>
          <p><strong>Edad:</strong> {nino.edad} años</p>
          <p><strong>Grado:</strong> {
            nino.grado === "-1" ? "Prescolar" : 
            nino.grado === "1" ? "Primero" : 
            nino.grado === "2" ? "Segundo" : nino.grado
          }</p>
          <p><strong>Colegio:</strong> {nino.colegio}</p>
          <p><strong>Jornada:</strong> {nino.jornada}</p>
        </AcompananteInfo>
      </Modal>
      
      {/* Modal de éxito */}
      <Modal 
        isOpen={modalSuccess} 
        onClose={closeSuccessModal}
        onConfirm={closeSuccessModal}
        title="Operación Exitosa"
        confirmText="Aceptar"
        showCancel={false}
      >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>{modalMessage}</p>
      </Modal>
      
      {/* Modal de error general */}
      <Modal 
        isOpen={modalError} 
        onClose={() => setModalError(false)}
        onConfirm={() => setModalError(false)}
        title="Error"
        confirmText="Entendido"
        showCancel={false}
      >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>{errorMessage}</p>
      </Modal>

      {/* Modal de correo duplicado */}
      <Modal 
        isOpen={emailExistsModal} 
        onClose={() => setEmailExistsModal(false)}
        onConfirm={() => setEmailExistsModal(false)}
        title="Correo ya registrado"
        confirmText="Entendido"
        showCancel={false}
      >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
          El correo electrónico ya está registrado en el sistema. Por favor, utiliza un correo diferente.
        </p>
      </Modal>

      {/* Modal para validación de correo electrónico */}
      <Modal 
        isOpen={emailValidationModal} 
        onClose={() => setEmailValidationModal(false)}
        onConfirm={() => setEmailValidationModal(false)}
        title="Correo electrónico inválido"
        confirmText="Entendido"
        showCancel={false}
      >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
          El formato del correo electrónico no es válido. Por favor, introduce una dirección de correo válida.
        </p>
      </Modal>

      {/* Modal de datos incompletos */}
      <Modal 
        isOpen={incompleteDataModal} 
        onClose={() => setIncompleteDataModal(false)}
        onConfirm={() => setIncompleteDataModal(false)}
        title="Datos incompletos"
        confirmText="Entendido"
        showCancel={false}
      >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
          Por favor, completa todos los campos obligatorios antes de continuar.
        </p>
        {missingFields.length > 0 && (
          <div style={{ textAlign: 'left', marginTop: '1rem' }}>
            <ul>
              {missingFields.map((field, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  {field}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* Modal de error de servidor */}
      <Modal 
        isOpen={serverErrorModal} 
        onClose={() => setServerErrorModal(false)}
        onConfirm={() => setServerErrorModal(false)}
        title="Error de conexión"
        confirmText="Entendido"
        showCancel={false}
      >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
          Ha ocurrido un error al comunicarse con el servidor. Por favor, intenta nuevamente más tarde.
        </p>
      </Modal>

      {/* Modal para cuando el usuario no es evaluador */}
      <Modal 
        isOpen={notEvaluatorModal} 
        onClose={() => setNotEvaluatorModal(false)}
        onConfirm={() => setNotEvaluatorModal(false)}
        title="Permiso denegado"
        confirmText="Entendido"
        showCancel={false}
      >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
          No tienes permisos de evaluador para realizar esta acción. Serás redirigido a la página principal.
        </p>
      </Modal>

      {/* Modal para token inválido */}
      <Modal 
        isOpen={invalidTokenModal} 
        onClose={() => setInvalidTokenModal(false)}
        onConfirm={() => setInvalidTokenModal(false)}
        title="Sesión expirada"
        confirmText="Entendido"
        showCancel={false}
      >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
          Tu sesión ha expirado o no es válida. Por favor, inicia sesión nuevamente.
        </p>
      </Modal>
      
      {/* Modal de validación de contraseña */}
      <Modal 
        isOpen={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)}
        onConfirm={() => setPasswordModalOpen(false)}
        title="Requisitos de contraseña"
        confirmText="Entendido"
        showCancel={false}
      >
        <p>La contraseña debe cumplir con los siguientes requisitos:</p>
        <div style={{ margin: '1rem 0', textAlign: 'left' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ 
                marginRight: '8px', 
                color: passwordValidation.hasUpperCase ? '#4CAF50' : '#ff6b6b'
              }}>
                {passwordValidation.hasUpperCase ? <FaCheck /> : <FaTimes />}
              </span>
              Contener al menos una letra mayúscula
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ 
                marginRight: '8px', 
                color: passwordValidation.hasNumber ? '#4CAF50' : '#ff6b6b'
              }}>
                {passwordValidation.hasNumber ? <FaCheck /> : <FaTimes />}
              </span>
              Contener al menos un número
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ 
                marginRight: '8px', 
                color: passwordValidation.hasMinLength ? '#4CAF50' : '#ff6b6b'
              }}>
                {passwordValidation.hasMinLength ? <FaCheck /> : <FaTimes />}
              </span>
              Tener al menos 6 caracteres
            </li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ 
                marginRight: '8px', 
                color: passwordValidation.passwordsMatch ? '#4CAF50' : '#ff6b6b'
              }}>
                {passwordValidation.passwordsMatch ? <FaCheck /> : <FaTimes />}
              </span>
              Las contraseñas deben coincidir
            </li>
          </ul>
        </div>
        <p>Por favor, asegúrate de que la contraseña cumpla con todos los requisitos.</p>
      </Modal>
    </>
  );
};

export default AsignarEvaluador;