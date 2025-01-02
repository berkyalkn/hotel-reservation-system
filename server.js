
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';  
import mysql from "mysql2";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err) => {
    if (err) {
        console.error('An error occured while connecting to the database: ', err.stack);
        return;
    }
    console.log('Successfully connected to database');
});

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));;
});


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())`;

    db.execute(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Username already exists!' });
            }
            console.error(err);
            return res.status(500).json({ message: 'Database error!' });
        }
        return res.status(200).json({ message: 'Registration successful!' });
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ?`;
    db.execute(query, [username], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error!' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found!' });
        }

        const user = result[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password!' });
        }

        console.log('Login successful!');
        return res.status(200).json({ message: 'Login successful!' });
    });
});


app.post('/reset-password', (req, res) => {
    const { email } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.execute(query, [email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error!' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'Email not found!' });
        }

        console.log('Email found! Resetting password...');

        return res.status(200).json({ message: 'Password reset link sent to your email.' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});