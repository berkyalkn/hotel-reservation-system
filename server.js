
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';  
import mysql from "mysql2";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
import session from "express-session";
import ejs from "ejs";

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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, 
    })
);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

        req.session.username = username;

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

app.get('/dashboard', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login.html');
    }

    res.render('dashboard', { username: req.session.username });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to log out.");
        }
        res.redirect('/login.html');
    });
});

app.get('/profile', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login.html');
    }

    const query = `SELECT first_name, last_name, bio, phone_number, address FROM users WHERE username = ?`;
    db.execute(query, [req.session.username], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error!' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found!' });
        }

        const user = result[0];

        const message = req.session.message || null; 
        req.session.message = null; 
        
        res.render('profile', { 
            user, 
            message});

        req.session.message = null;
    });
});

app.post('/profile', (req, res) => {

   console.log(req.body);
  
    const { first_name, last_name, bio, phone_number, address } = req.body;

    if (!first_name || !last_name || !bio || !phone_number || !address) {
        req.session.message = {
            type: 'danger',
            text: 'All fields must be filled out'
        };
        return res.redirect('/profile');
    }
    

    const query = `
        UPDATE users
        SET first_name = ?, last_name = ?, bio = ?, phone_number = ?, address = ?
        WHERE username = ?`;

        db.execute(query, [
            first_name || null,
            last_name || null,
            bio || null,
            phone_number || null,
            address || null,
            req.session.username
        ], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                req.session.message = {
                    type: 'danger',
                    text: 'Database error'
                };
                return res.redirect('/profile');
            }
    
            req.session.message = {
                type: 'success',
                text: 'Profile updated successfully!'
            };
    
            res.redirect('/profile');
        
        });
});

app.get('/change-password', (req, res) => {
    if (!req.session.username) {
        return res.redirect('login.html'); 
    }

    const message = req.session.message || null; 
    req.session.message = null; 
    

   res.render('change_password', { 
    username: req.session.username, 
    message});


req.session.message = null;
});

app.post('/update-password2', async (req, res) => {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        req.session.message = {
            type: 'danger',
            text: "Passwords don't match"
        };
        return res.redirect('/change-password');
    }

    db.execute('SELECT * FROM users WHERE username = ?', [req.session.username], async (err, result) => {
        if (err) {
            console.error(err);
            req.session.message = {
                type: 'danger',
                text: 'Database error'
            };
            return res.redirect('/change-password');
        }

        if (result.length === 0) {
            req.session.message = {
                type: 'danger',
                text: 'User not found'
            };
            return res.redirect('/change-password');
        }

        const user = result[0];
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordCorrect) {
            req.session.message = {
                type: 'danger',
                text: ' Incorrect current password'
            };
            return res.redirect('/change-password');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);


        db.execute('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, req.session.username], (err, result) => {
            if (err) {
                console.error(err);
                req.session.message = {
                    type: 'danger',
                    text: 'Database error'
                };
                return res.redirect('/change-password');
            } 

            req.session.message = {
                type: 'success',
                text: 'Password updated successfully'
            };

            res.redirect('/profile');
        });
    });
});


app.get('/about', (req, res) => {
    res.render('about'); 
});

app.get('/contact', (req, res) => {
    res.render('contact'); 
});

app.get('/search', (req, res) => {
    const { destination, checkin, checkout, guests } = req.query;

    let query = 'SELECT * FROM hotels WHERE 1=1';
    let queryParams = [];

    if (destination) {
        query += ' AND (name LIKE ? OR location LIKE ?)';
        queryParams.push(`%${destination}%`, `%${destination}%`);
    }

    if (checkin && checkout) {
        query += ' AND (checkin_date >= ? AND checkout_date <= ?)';
        queryParams.push(checkin, checkout);
    }

    db.execute(query, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({
            hotels: result
        });
    });
});

app.get('/search-results', (req, res) => {
    const { destination, checkin, checkout, guests } = req.query;

    let query = 'SELECT * FROM hotels WHERE 1=1';
    let queryParams = [];

    if (destination) {
        query += ' AND (name LIKE ? OR location LIKE ?)';
        queryParams.push(`%${destination}%`, `%${destination}%`);
    }

    db.execute(query, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        res.render('search', {
            hotels: result, 
            hotelCount: result.length,
            destination: destination,
            checkin: checkin,
            checkout: checkout,
            guests: guests
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});