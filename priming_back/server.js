require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

// Definición de códigos de error
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

// Configuración de la base de datos
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ 
        error: "Acceso denegado",
        code: ERROR_CODES.ACCESS_DENIED
    });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ 
            error: "Token inválido",
            code: ERROR_CODES.INVALID_TOKEN
        });
    }
};

// Registro de usuario
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, codigo, tipo, correo_electronico, contrasena, tipo_usuario } = req.body;

        console.log('📩 Datos recibidos en el backend:', req.body);

        // Validaciones de datos
        if (!contrasena || typeof contrasena !== 'string' || contrasena.trim() === '') {
            return res.status(400).json({ 
                error: "La contraseña es inválida o está vacía",
                code: ERROR_CODES.INVALID_PASSWORD
            });
        }
        if (!correo_electronico || typeof correo_electronico !== 'string' || correo_electronico.trim() === '') {
            return res.status(400).json({ 
                error: "El correo electrónico es inválido o está vacío",
                code: ERROR_CODES.INVALID_EMAIL
            });
        }

        const correoExistente = await pool.query('SELECT id FROM usuarios WHERE correo_electronico = $1', [correo_electronico]);
        if (correoExistente.rows.length > 0) {
            return res.status(400).json({ 
                error: "El correo electrónico ya está registrado",
                code: ERROR_CODES.EMAIL_EXISTS
            });
        }

        // Verificar si el código ya existe
        const codigoExistente = await pool.query('SELECT id FROM evaluadores WHERE codigo = $1', [codigo]);
        if (codigoExistente.rows.length > 0) {
            return res.status(400).json({
                error: `El código ya está registrado`,
                code: ERROR_CODES.CODE_EXISTS,
                detail: `Ya existe la llave (codigo)=(${codigo}).`
            });
        }

        const hashedPassword = await bcrypt.hash(contrasena.trim(), 10);
        console.log('🔑 Contraseña encriptada:', hashedPassword);

        const client = await pool.connect();

        try {
            await client.query('BEGIN');
        
            const usuarioResult = await client.query(
                'INSERT INTO usuarios (nombre, correo_electronico, contrasena, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING id',
                [nombre, correo_electronico, hashedPassword, tipo_usuario]
            );
        
            const userId = usuarioResult.rows[0].id;
        
            await client.query(
                'INSERT INTO evaluadores (usuario_id, codigo, tipo) VALUES ($1, $2, $3)',
                [userId, codigo, tipo]
            );

            await client.query('COMMIT');
            client.release();
        
            res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
        
        } catch (error) {
            await client.query('ROLLBACK');
            client.release();
            console.error("❌ Error en el registro:", error);

            // Verificar si es un error de código duplicado
            if (error.detail && error.detail.includes('(codigo)=')) {
                return res.status(400).json({
                    error: `El código ya está registrado`,
                    code: ERROR_CODES.CODE_EXISTS,
                    detail: error.detail
                });
            }

            res.status(500).json({ 
                error: "Error en el servidor",
                code: ERROR_CODES.SERVER_ERROR
            });
        }
        
    } catch (error) {
        console.error('❌ Error en el registro:', error);
        res.status(500).json({ 
            error: "Error en el servidor",
            code: ERROR_CODES.SERVER_ERROR
        });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;

        if (!correo_electronico || !contrasena) {
            return res.status(400).json({ 
                error: "Correo y contraseña son obligatorios",
                code: ERROR_CODES.MISSING_CREDENTIALS
            });
        }

        const result = await pool.query('SELECT * FROM usuarios WHERE correo_electronico = $1', [correo_electronico]);
        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: "Usuario no encontrado",
                code: ERROR_CODES.USER_NOT_FOUND
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ 
                error: "Contraseña incorrecta",
                code: ERROR_CODES.WRONG_PASSWORD
            });
        }

        const token = jwt.sign(
            { id: user.id, tipo_usuario: user.tipo_usuario },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token, user });

    } catch (error) {
        console.error("❌ Error en el inicio de sesión:", error);
        res.status(500).json({ 
            error: "Error en el servidor",
            code: ERROR_CODES.SERVER_ERROR
        });
    }
});

// Endpoint para asignar acompañante
app.post('/api/asignar-evaluador', verifyToken, async (req, res) => {
    try {
      console.log("📩 Datos recibidos en el backend:", req.body);
      const { nombre, correo_electronico, contrasena, edad, grado, colegio, jornada } = req.body;
  
      // Validación de datos requeridos
      if (!nombre || !correo_electronico || !contrasena || !edad || !grado || !colegio || !jornada) {
        return res.status(400).json({ 
          error: "Faltan datos obligatorios.",
          code: ERROR_CODES.MISSING_DATA
        });
      }
  
      // Verificar si el correo ya existe
      const correoExistente = await pool.query(
        'SELECT id FROM usuarios WHERE correo_electronico = $1',
        [correo_electronico]
      );
      
      if (correoExistente.rows.length > 0) {
        return res.status(400).json({ 
          error: "El correo electrónico ya está registrado.",
          code: ERROR_CODES.EMAIL_EXISTS
        });
      }
  
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(contrasena.trim(), 10);
  
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        // 1. Crear el usuario
        const usuarioResult = await client.query(
          'INSERT INTO usuarios (nombre, correo_electronico, contrasena, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING id',
          [nombre, correo_electronico, hashedPassword, "niño"]
        );
        const nuevoUsuarioId = usuarioResult.rows[0].id;
        
        // 2. Crear el registro del niño
        const ninoResult = await client.query(
          'INSERT INTO ninos (usuario_id, edad, grado, colegio, jornada) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [nuevoUsuarioId, edad, grado, colegio, jornada]
        );
        const ninoId = ninoResult.rows[0].id;
        
        // 3. Obtener el ID del evaluador
        const evaluadorQuery = await client.query(
          'SELECT id FROM evaluadores WHERE usuario_id = $1',
          [req.user.id]
        );
        
        if (evaluadorQuery.rows.length === 0) {
          throw new Error("El usuario logueado no tiene registro en evaluadores.");
        }
        
        const evaluadorId = evaluadorQuery.rows[0].id;
        
        // 4. Crear la encuesta/relación entre niño y evaluador
        const encuestaResult = await client.query(
          'INSERT INTO encuestas (nino_id, evaluador_id, fecha, num_intentos, num_sesion, observaciones) VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING id',
          [ninoId, evaluadorId, 0, 1, '']
        );
        
        await client.query('COMMIT');
        client.release();
        
        res.status(201).json({
          message: "Niño registrado y encuesta iniciada exitosamente",
          encuestaId: encuestaResult.rows[0].id
        });
      } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        console.error("❌ Error registrando niño y encuesta:", error);
        
        if (error.message === "El usuario logueado no tiene registro en evaluadores.") {
          return res.status(400).json({ 
            error: "No tienes permisos de evaluador para realizar esta acción.",
            code: ERROR_CODES.NOT_EVALUATOR
          });
        }
        
        res.status(500).json({ 
          error: "Error en el servidor",
          code: ERROR_CODES.SERVER_ERROR
        });
      }
    } catch (error) {
      console.error("❌ Error asignando evaluador:", error);
      res.status(500).json({ 
        error: "Error en el servidor",
        code: ERROR_CODES.SERVER_ERROR
      });
    }
});

// Endpoint para obtener la lista de niños asignados a un evaluador
app.get('/api/evaluador/ninos', verifyToken, async (req, res) => {
    try {
      const evaluadorId = req.user.id;
  
      const query = `
        SELECT 
          encuestas.id AS encuesta_id, 
          ninos.id AS nino_id, 
          usuarios.nombre AS nino_nombre, 
          usuarios.correo_electronico AS nino_correo,
          ninos.edad, 
          ninos.grado, 
          ninos.colegio, 
          ninos.jornada,
          encuestas.fecha,
          encuestas.num_intentos,
          encuestas.num_sesion,
          encuestas.observaciones
        FROM encuestas
        JOIN evaluadores ON encuestas.evaluador_id = evaluadores.id
        JOIN ninos ON encuestas.nino_id = ninos.id
        JOIN usuarios ON ninos.usuario_id = usuarios.id
        WHERE evaluadores.usuario_id = $1
        ORDER BY encuestas.fecha DESC;
      `;
      
      const result = await pool.query(query, [evaluadorId]);
  
      res.json(result.rows);
    } catch (error) {
      console.error("❌ Error al obtener niños asignados:", error);
      res.status(500).json({ 
        error: "Error al obtener niños asignados",
        code: ERROR_CODES.SERVER_ERROR
      });
    }
});

// Obtener datos del usuario
app.get('/api/user', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: "Usuario no encontrado",
                code: ERROR_CODES.USER_NOT_FOUND
            });
        }

        // Eliminar la contraseña del resultado
        const user = result.rows[0];
        delete user.contrasena;
        
        res.json(user);
    } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
        res.status(500).json({ 
            error: "Error obteniendo usuario",
            code: ERROR_CODES.SERVER_ERROR
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));