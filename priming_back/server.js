require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Acceso denegado" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Token inválido" });
    }
};

// Registro de usuario
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, codigo,tipo , correo_electronico, contrasena, tipo_usuario } = req.body;

        console.log('📩 Datos recibidos en el backend:', req.body);

        // Validaciones de datos
        if (!contrasena || typeof contrasena !== 'string' || contrasena.trim() === '') {
            return res.status(400).json({ error: "La contraseña es inválida o está vacía" });
        }
        if (!correo_electronico || typeof correo_electronico !== 'string' || correo_electronico.trim() === '') {
            return res.status(400).json({ error: "El correo electrónico es inválido o está vacío" });
        }
        // Verificar si el correo ya existe
        const correoExistente = await pool.query('SELECT id FROM usuarios WHERE correo_electronico = $1', [correo_electronico]);
        if (correoExistente.rows.length > 0) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado" });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasena.trim(), 10);
        console.log('🔑 Contraseña encriptada:', hashedPassword);

        // Iniciar transacción en PostgreSQL
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
        
            // Insertar usuario
            const usuarioResult = await client.query(
                'INSERT INTO usuarios (nombre, correo_electronico, contrasena, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING id',
                [nombre, correo_electronico, hashedPassword, tipo_usuario]
            );
        
            const userId = usuarioResult.rows[0].id;
        
            // Insertar datos del niño
            await client.query(
                'INSERT INTO evaluadores (usuario_id, codigo, tipo) VALUES ($1, $2, $3)',
                [userId, codigo,tipo ]
            );
        
            // Confirmar transacción
            await client.query('COMMIT');
            client.release();
        
            // 🔹 Enviar la respuesta exitosa al frontend
            res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
        
        } catch (error) {
            await client.query('ROLLBACK');
            client.release();
            console.error("❌ Error en el registro:", error);
            res.status(500).json({ error: 'Error registrando el usuario' });
        }
        
    } catch (error) {
        console.error('❌ Error en el registro:', error);
        res.status(500).json({ error: 'Error registrando el usuario' });
    }
});

// Inicio de sesión con sesión activa
app.post('/api/login', async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;

        if (!correo_electronico || !contrasena) {
            return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
        }

        const result = await pool.query('SELECT * FROM usuarios WHERE correo_electronico = $1', [correo_electronico]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id, tipo_usuario: user.tipo_usuario },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token, user });

    } catch (error) {
        console.error("❌ Error en el inicio de sesión:", error);
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});

// Obtener usuario autenticado
app.get('/api/user', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        res.json(result.rows[0]);
    } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
        res.status(500).json({ error: "Error obteniendo usuario" });
    }
});


app.post('/api/asignar-evaluador', verifyToken, async (req, res) => {
    try {
        console.log("📩 Datos recibidos en el backend:", req.body); // 🛠️ Verificar qué datos llegan

        const { nino_id, usuario_id, nombre, tipo_documento, codigo, tipo } = req.body;

        if (!nino_id || !usuario_id) {
            console.error("❌ Faltan datos: `nino_id` o `usuario_id` no pueden ser nulos");
            return res.status(400).json({ error: "Faltan datos: `nino_id` o `usuario_id` no pueden ser nulos" });
        }

        // Verificar si el código ya está registrado
        const codigoExistente = await pool.query('SELECT usuario_id FROM evaluadores WHERE codigo = $1', [codigo]);
        if (codigoExistente.rows.length > 0) {
            return res.status(400).json({ error: "El código ya está registrado con otro acompañante" });
        }

        // Insertar nuevo evaluador con `usuario_id` y `nino_id`
        const result = await pool.query(
            'INSERT INTO evaluadores (usuario_id, nino_id, nombre, tipo_documento, codigo, tipo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING usuario_id',
            [usuario_id, nino_id, nombre, tipo_documento, codigo, tipo]
        );

        res.json({ message: "✅ Acompañante asignado correctamente", usuarioId: result.rows[0].usuario_id });

    } catch (error) {
        console.error("❌ Error asignando acompañante:", error);
        res.status(500).json({ error: "Error asignando acompañante" });
    }
});


// Servidor corriendo
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
