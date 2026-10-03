require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const reportarConsulta = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};

app.use(reportarConsulta);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const verificarCredenciales = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email y contraseña son obligatorios",
    });
  }

  next();
};

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({
      error: 'Token no proporcionado'
    })
  }

  try {
    const tokenLimpio = token.split(' ')[1]

    const decoded = jwt.verify(
      tokenLimpio,
      process.env.JWT_SECRET
    )

    req.usuario = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido'
    })
  }
}



app.get("/", (req, res) => {
  res.send("Servidor Soft Jobs funcionando");
});

app.get('/usuarios', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, rol, lenguage
       FROM usuarios
       WHERE email = $1`,
      [req.usuario.email]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

app.post("/usuarios", verificarCredenciales, async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (email, password, rol, lenguage)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, rol, lenguage`,
      [email, passwordEncriptada, rol, lenguage],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post('/login', verificarCredenciales, async (req, res) => {
  try {
    const { email, password } = req.body

    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Email o contraseña incorrectos'
      })
    }

    const usuario = result.rows[0]

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password
    )

    if (!passwordValida) {
      return res.status(401).json({
        error: 'Email o contraseña incorrectos'
      })
    }

    const token = jwt.sign(
      { email: usuario.email },
      process.env.JWT_SECRET
    )

    res.json({
      token
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});
