import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import db from '../config/dbConnection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

console.log(process.env.JWT_SECRET);
const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);

const router = express.Router();

router.get('/check-username/:username', (req, res) => {
  const username = req.params.username;
  const dbQuery = `
    SELECT * FROM users
    WHERE username = ?
  `;
  db.get(dbQuery, [username], (err, row) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({
        available: false,
        message: 'Database error',
      });
    }
    if (row) {
      return res.json({
        available: false,
        message: 'username already taken',
      });
    } else {
      return res.json({
        available: true,
        message: 'username available',
      });
    }
  });
});

router.post('/register', async (req, res) => {
  console.log(req.body);
  const { full_name, username, role, gmail, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const dbQuery = `
        INSERT INTO users(full_name,username, role, gmail, password)
        VALUES(?,?,?,?,?)
    `;
  db.run(
    dbQuery,
    [full_name, username, role, gmail, hashedPassword],

    function (err) {
      if (err) {
        console.log(err.message);
        return res.status(400).json({
          detail: err.message,
        });
      }

      res.json({
        success: true,
        message: 'Registration successful',
        userId: this.lastID,
      });
    },
  );
});

//middleware

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      detail: 'Token missing',
    });
  }

  //verify token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        detail: 'Invalid token',
      });
    }
    req.user = user;
    next();
  });
}

router.post('/login', async (req, res) => {
  console.log(req.body);
  const { identifier, role, password } = req.body;
  const dbQuery = `
    SELECT * FROM users
    WHERE(username =? OR gmail=?)
    AND role=?
    

  `;

  db.get(dbQuery, [identifier, identifier, role], async (err, user) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({
        detail: 'Database error',
      });
    }
    if (!user) {
      return res.status(401).json({
        detail: 'user not found',
      });
    }

    //bcrypt password check
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        details: 'Invalid credentials',
      });
    }

    //JWT TOKEN
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );

    res.json({
      access_token: token,
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
      },
    });
  });
});

export default router;
