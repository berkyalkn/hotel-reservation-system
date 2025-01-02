
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';  
import mysql from "mysql2";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";

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


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS 
    }
});


const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to, 
        subject: subject, 
        text: text 
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('An error occurred while sending the email:', err);
                reject(err);
            } else {
                console.log('The email was sent successfully:', info.response);
                resolve(info);
            }
        });
    });
};

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

         try {
            const emailSubject = "Password Reset Request";
            const emailText = `Click the link to reset your password:\n\nhttp://localhost:3000/reset-password2?email=${email}`;
            await sendEmail(email, emailSubject, emailText);
            return res.status(200).json({ message: 'Password reset link sent to your email.' });
        } catch (error) {
            return res.status(500).json({ message: 'Error sending reset link.' });
        }
    });
});


app.get('/reset-password2', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset_password2.html'));
});

app.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = `UPDATE users SET password = ? WHERE email = ?`;
    db.execute(query, [hashedPassword, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Email not found' });
        }

        return res.status(200).json({ message: 'Password updated successfully' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});