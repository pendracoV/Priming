// Objeto con códigos de error del backend
export const ERROR_CODES = {
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

// Opciones para los selects
export const OPTIONS = {
    edad: [
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" }
    ],
    grado: [
        { value: "-1", label: "Prescolar" },
        { value: "1", label: "Primero" },
        { value: "2", label: "Segundo" }
    ],
    jornada: [
        { value: "mañana", label: "Mañana" },
        { value: "tarde", label: "Tarde" },
        { value: "Continua", label: "Continua" }
    ]
};