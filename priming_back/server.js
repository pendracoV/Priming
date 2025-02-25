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

// Registro de usuario (endpoint original)
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, codigo, tipo, correo_electronico, contrasena, tipo_usuario } = req.body;

        console.log('📩 Datos recibidos en el backend:', req.body);

        // Validaciones de datos
        if (!contrasena || typeof contrasena !== 'string' || contrasena.trim() === '') {
            return res.status(400).json({ error: "La contraseña es inválida o está vacía" });
        }
        if (!correo_electronico || typeof correo_electronico !== 'string' || correo_electronico.trim() === '') {
            return res.status(400).json({ error: "El correo electrónico es inválido o está vacío" });
        }

        const correoExistente = await pool.query('SELECT id FROM usuarios WHERE correo_electronico = $1', [correo_electronico]);
        if (correoExistente.rows.length > 0) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado" });
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
            res.status(500).json({ error: 'Error registrando el usuario' });
        }
        
    } catch (error) {
        console.error('❌ Error en el registro:', error);
        res.status(500).json({ error: 'Error registrando el usuario' });
    }
});


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
      console.log("📩 Datos recibidos en el backend:", req.body);
      const { nombre, correo_electronico, contrasena, edad, grado, colegio, jornada } = req.body;
  

      if (!nombre || !correo_electronico || !contrasena || !edad || !grado || !colegio || !jornada) {
        return res.status(400).json({ error: "Faltan datos obligatorios." });
      }
  

      const correoExistente = await pool.query(
        'SELECT id FROM usuarios WHERE correo_electronico = $1',
        [correo_electronico]
      );
      if (correoExistente.rows.length > 0) {
        return res.status(400).json({ error: "El correo electrónico ya está registrado." });
      }
  

      const hashedPassword = await bcrypt.hash(contrasena.trim(), 10);
  

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        

        const usuarioResult = await client.query(
          'INSERT INTO usuarios (nombre, correo_electronico, contrasena, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING id',
          [nombre, correo_electronico, hashedPassword, "niño"]
        );
        const nuevoUsuarioId = usuarioResult.rows[0].id;
        

        const ninoResult = await client.query(
          'INSERT INTO ninos (usuario_id, edad, grado, colegio, jornada) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [nuevoUsuarioId, edad, grado, colegio, jornada]
        );
        const ninoId = ninoResult.rows[0].id;
        

        const evaluadorQuery = await client.query(
          'SELECT id FROM evaluadores WHERE usuario_id = $1',
          [req.user.id]
        );
        if (evaluadorQuery.rows.length === 0) {
          throw new Error("El usuario logueado no tiene registro en evaluadores.");
        }
        const evaluadorId = evaluadorQuery.rows[0].id;
        

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
        res.status(500).json({ error: "Error registrando niño y encuesta" });
      }
    } catch (error) {
      console.error("❌ Error asignando evaluador:", error);
      res.status(500).json({ error: "Error asignando evaluador" });
    }
  });
  


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
        JOIN ninos ON encuestas.nino_id = ninos.id
        JOIN usuarios ON ninos.usuario_id = usuarios.id
        WHERE encuestas.evaluador_id = $1
        ORDER BY encuestas.fecha DESC
      `;
      const result = await pool.query(query, [evaluadorId]);
  
      res.json(result.rows);
    } catch (error) {
      console.error("❌ Error al obtener niños asignados:", error);
      res.status(500).json({ error: "Error al obtener niños asignados" });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
