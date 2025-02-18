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

// Registro de usuario
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, correo_electronico, contrasena, tipo_usuario } = req.body;

        console.log('📩 Datos recibidos en el backend:', req.body);

        if (!contrasena || typeof contrasena !== 'string' || contrasena.trim() === '') {
            return res.status(400).json({ error: "La contraseña es inválida o está vacía" });
        }

        // Forzar que la contraseña sea una cadena de texto
        const passwordString = String(contrasena).trim();

        // Imprimir la contraseña para depuración
        console.log('🔐 Contraseña antes de encriptar:', passwordString);

        // Generar el hash de la contraseña
        const hashedPassword = await bcrypt.hash(passwordString, 10);

        console.log('🔑 Contraseña encriptada:', hashedPassword);

        const result = await pool.query(
            'INSERT INTO usuarios (nombre, correo_electronico, contrasena, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING id',
            [nombre, correo_electronico, hashedPassword, tipo_usuario]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.rows[0].id });
    } catch (error) {
        console.error('❌ Error en el registro:', error);
        res.status(500).json({ error: 'Error registrando el usuario' });
    }
});


// Inicio de sesión
app.post('/api/login', async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;
        const result = await pool.query('SELECT * FROM usuarios WHERE correo_electronico = $1', [correo_electronico]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id, tipo_usuario: user.tipo_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user.id, tipo_usuario: user.tipo_usuario });
    } catch (error) {
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});

// Servidor corriendo
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
