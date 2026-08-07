import express from 'express';
import cors from 'cors';

import db from './config/dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import paperRoutes from './routes/paperRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend')));

app.use(express.json());
app.use(cors());

db.run(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name VARCHAR(50),
        username VARCHAR(50) UNIQUE,
        role VARCHAR(50),
        gmail VARCHAR(50),
        password VARCHAR(50)
    )
`);

app.use('/api/auth', authRoutes);
app.use('/api/paper', paperRoutes);

// PROTECTED ROUTE

// app.get(
//   '/api/protected/dashboard',

//   authenticateToken,

//   (req, res) => {
//     res.json({
//       message: 'Protected dashboard accessed',

//       loggedInUser: req.user,
//     });
//   },
// );

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log('server listen on port http://127.0.0.1:3000');
});
