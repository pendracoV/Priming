import React from 'react';
import Modal from "./Modal";

// Componente para modales de error
const ErrorModal = ({ isOpen, onClose, title, message }) => (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        onConfirm={onClose}
        title={title}
        confirmText="Entendido"
        showCancel={false}
    >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>{message}</p>
    </Modal>
);

// Modal de correo duplicado
export const EmailExistsModal = ({ isOpen, onClose }) => (
    <ErrorModal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Correo ya registrado"
        message="El correo electrónico ya está registrado en el sistema. Por favor, utiliza un correo diferente."
    />
);

// Modal para validación de correo electrónico
export const EmailValidationModal = ({ isOpen, onClose }) => (
    <ErrorModal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Correo electrónico inválido"
        message="El formato del correo electrónico no es válido. Por favor, introduce una dirección de correo válida."
    />
);

// Modal de datos incompletos
export const IncompleteDataModal = ({ isOpen, onClose, missingFields = [] }) => (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        onConfirm={onClose}
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
);

// Modal de error de servidor
export const ServerErrorModal = ({ isOpen, onClose }) => (
    <ErrorModal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Error de conexión"
        message="Ha ocurrido un error al comunicarse con el servidor. Por favor, intenta nuevamente más tarde."
    />
);

// Modal para cuando el usuario no es evaluador
export const NotEvaluatorModal = ({ isOpen, onClose }) => (
    <ErrorModal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Permiso denegado"
        message="No tienes permisos de evaluador para realizar esta acción. Serás redirigido a la página principal."
    />
);

// Modal para token inválido
export const InvalidTokenModal = ({ isOpen, onClose }) => (
    <ErrorModal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Sesión expirada"
        message="Tu sesión ha expirado o no es válida. Por favor, inicia sesión nuevamente."
    />
);

// Modal de validación de contraseña
export const PasswordValidationModal = ({ isOpen, onClose, validation }) => (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        onConfirm={onClose}
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
                        color: validation.hasUpperCase ? '#4CAF50' : '#ff6b6b'
                    }}>
                        {validation.hasUpperCase ? <FaCheck /> : <FaTimes />}
                    </span>
                    Contener al menos una letra mayúscula
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ 
                        marginRight: '8px', 
                        color: validation.hasNumber ? '#4CAF50' : '#ff6b6b'
                    }}>
                        {validation.hasNumber ? <FaCheck /> : <FaTimes />}
                    </span>
                    Contener al menos un número
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ 
                        marginRight: '8px', 
                        color: validation.hasMinLength ? '#4CAF50' : '#ff6b6b'
                    }}>
                        {validation.hasMinLength ? <FaCheck /> : <FaTimes />}
                    </span>
                    Tener al menos 6 caracteres
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ 
                        marginRight: '8px', 
                        color: validation.passwordsMatch ? '#4CAF50' : '#ff6b6b'
                    }}>
                        {validation.passwordsMatch ? <FaCheck /> : <FaTimes />}
                    </span>
                    Las contraseñas deben coincidir
                </li>
            </ul>
        </div>
        <p>Por favor, asegúrate de que la contraseña cumpla con todos los requisitos.</p>
    </Modal>
);

// Modal de éxito
export const SuccessModal = ({ isOpen, onClose, message }) => (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        onConfirm={onClose}
        title="Operación Exitosa"
        confirmText="Aceptar"
        showCancel={false}
    >
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>{message}</p>
    </Modal>
);

export default {
    EmailExistsModal,
    EmailValidationModal,
    IncompleteDataModal,
    ServerErrorModal,
    NotEvaluatorModal,
    InvalidTokenModal,
    PasswordValidationModal,
    SuccessModal
};