
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';  
import mysql from "mysql2";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
import session from "express-session";
import ejs from "ejs";
import { hash } from "crypto";

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
    res.render("index");
});

app.get('/register', (req, res) => {
    res.render("register");
});

const saltRounds = 10;

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
    bcrypt.hash(password, saltRounds, (err, hash) => {
        
        if(err) {
            console.log("Error hashing password : ", err);
        } else {
        const query = `INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())`;

        db.execute(query, [username, email, hash], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Username already exists!' });
                }
                console.error(err);
                return res.status(500).json({ message: 'Database error!' });
            }
            return res.status(200).json({ message: 'Registration successful!' });
         
        });
    }
    });
} catch (err) {
    console.log(err);
}
});

app.get('/login', (req, res) => {
    res.render("login");
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
        req.session.userId = result[0].id;

        console.log('Login successful!');
        return res.status(200).json({ message: 'Login successful!' });
    });
});

app.get('/reset-password', (req, res) => {
    res.render('reset_password');
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
    res.render('reset_password2');
});


app.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

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
    const offers = [
        {
            title: "20% Off on Beach Resorts",
            description: "Take advantage of this limited-time offer and enjoy a fantastic 20% discount on selected beach resorts. Whether you're looking for a peaceful getaway or an adventurous beach experience, our beach resorts offer the perfect combination of relaxation and activities. Book your stay before the end of the month to secure this amazing deal!",
            link: "/offers/beach-resorts",
            hotels: [
                'Sunset Resort & Spa',
                'Seaside Paradise Hotel',
                'Beachside Resort',
                'Pacific Coast Resort'
            ]
        },
        {
            title: "Last Minute Deals",
            description: "Hurry, don't miss out on last-minute deals for your next vacation! Get up to 50% off on select hotels for bookings made within 48 hours. This is the perfect opportunity for spontaneous travelers who want to save big while still enjoying top-notch accommodations. Whether you're planning a weekend getaway or a quick business trip, these deals are perfect for those who act fast.",
            link: "/offers/last-minute",
            hotels: [
                'Urban Comfort Inn',
                'Mountain View Lodge',
                'Historic Downtown Hotel',
                'City Center Suites'
            ]
        },
        {
            title: "Early Bird Discounts",
            description: "Be smart and plan your vacation early with our Early Bird Discounts. Book your stay now and enjoy exclusive savings of up to 30% off on premium hotels. This offer is designed for early planners who want the best rooms at the best prices. Don’t wait too long, as these discounts are only available for a limited time. Book now and guarantee your spot at some of the most luxurious resorts!",
            link: "/offers/early-bird",
            hotels: [
                'For All Hotels'
            ]
        },
    ];

    res.render('dashboard', { username: req.session.username, offers });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to log out.");
        }
        res.redirect('/login');
    });
});

app.get('/profile', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login');
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
        return res.redirect('/login'); 
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

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);


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
    res.render('contact')
});

app.post('/contact', (req, res) => {
    const { name, message} = req.body; 
    
    sendEmail(process.env.GMAIL_USER, 'New Message from Contact Form', `
        You have received a new message from the contact form:

        Name: ${name}
        Message: 

        "${message}"
        
        Best regards,
        Roomify Team
    `)
    .then(() => {
        res.json({
            success: true,
            message: 'Your message has been sent successfully! We will get back to you soon.'
        });
    })
    .catch((error) => {
        res.json({
            success: false,
            message: 'Oops! Something went wrong. Please try again later.'
        });
    });
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

app.get('/login-search', (req, res) => {
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

app.get('/login-search-results', (req, res) => {
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

        res.render('login_search', {
            hotels: result, 
            hotelCount: result.length,
            destination: destination,
            checkin: checkin,
            checkout: checkout,
            guests: guests,
            username: req.session.username
        });
    });
});

app.get('/hotel/:id', (req, res) => {
    const hotelId = req.params.id;

    const query = `
        SELECT name, location, description, price_per_night, total_rooms, image_url, 
               facilities, rating, reviews_count, contact_email, contact_phone, address, 
               checkin_time, checkout_time 
        FROM hotels 
        WHERE id = ?
    `;

    db.execute(query, [hotelId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(404).send('Hotel not found');
        }

        res.render('hotel_details', { hotel: result[0] });
    });
});

app.get('/login-hotel/:id', (req, res) => {
    const hotelId = req.params.id;

    const query = `
        SELECT name, location, description, price_per_night, total_rooms, image_url, 
               facilities, rating, reviews_count, contact_email, contact_phone, address, 
               checkin_time, checkout_time 
        FROM hotels 
        WHERE id = ?
    `;

    db.execute(query, [hotelId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(404).send('Hotel not found');
        }

        res.render('login_hotel_details', { hotel: result[0] });
    });
});

app.get('/book/:id', (req, res) => {
    const hotelId = req.params.id;

    db.execute('SELECT * FROM hotels WHERE id = ?', [hotelId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(404).send('Hotel not found');
        }

        res.render('book', { hotel: result[0] });
    });
});

app.post('/book', (req, res) => {
    const { name, email, hotel_id, checkin_date, checkout_date, guests } = req.body;

    const userId = req.session.userId || null; 

    const hotelQuery = `SELECT name, location FROM hotels WHERE id = ?`;
    db.execute(hotelQuery, [hotel_id], (err, hotelResult) => {
        if (err || hotelResult.length === 0) {
            console.error(err || 'Hotel not found');
            return res.status(500).send('Error retrieving hotel details');
        }

        const hotelName = hotelResult[0].name;
        const location = hotelResult[0].location;

        const bookingQuery = `
            INSERT INTO bookings (user_id, hotel_id, checkin_date, checkout_date, guests, name, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [userId, hotel_id, checkin_date, checkout_date, guests, name, email];

        db.execute(bookingQuery, params, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }

            const emailText = `
            Dear ${name},
            
            We are excited to confirm your booking with **Roomify**! Below are the details of your reservation:
            
            🏨 **Hotel Name:** ${hotelName}  
            📍 **Location:** ${location}  
            📅 **Check-in Date:** ${checkin_date}  
            📆 **Check-out Date:** ${checkout_date}  
            👥 **Number of Guests:** ${guests}  
            
            We are thrilled to have the opportunity to host you. Should you have any special requests or need further assistance, please don't hesitate to reach out to us.
            
            Thank you for choosing **Roomify** for your stay. We hope you have a pleasant experience and enjoy every moment of your trip!
            
            Best regards,  
            **The Roomify Team**  
            📧 support@roomify.com  
            🌐 www.roomify.com  
            📞 +90 123 456 7890
            `;

            sendEmail(email, 'Booking Confirmation', emailText)
                .then(() => {
                    console.log('Confirmation email sent successfully!');
                    res.redirect(`/confirmation/${result.insertId}`);
                })
                .catch((error) => {
                    console.error('Failed to send email:', error);
                    res.status(500).send('Booking was successful but failed to send confirmation email.');
                });
        });
    });
});

app.get('/login-book/:id', (req, res) => {
    const hotelId = req.params.id;
    const username = req.session.username;

    if (!username) {
        return res.redirect('/login'); 
    }

    const userQuery = `SELECT first_name, email FROM users WHERE username = ?`;
    db.execute(userQuery, [username], (err, userResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (userResult.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = userResult[0];


    db.execute('SELECT * FROM hotels WHERE id = ?', [hotelId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(404).send('Hotel not found');
        }

        res.render('login_book', { 
            hotel: result[0],
            user: user 
        });
    });
});
});

app.post('/login-book', (req, res) => {
    const { name, email, hotel_id, checkin_date, checkout_date, guests } = req.body;

    const userId = req.session.userId || null; 

    const hotelQuery = `SELECT name, location FROM hotels WHERE id = ?`;
    db.execute(hotelQuery, [hotel_id], (err, hotelResult) => {
        if (err || hotelResult.length === 0) {
            console.error(err || 'Hotel not found');
            return res.status(500).send('Error retrieving hotel details');
        }

        const hotelName = hotelResult[0].name;
        const location = hotelResult[0].location;

        const bookingQuery = `
            INSERT INTO bookings (user_id, hotel_id, checkin_date, checkout_date, guests, name, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [userId, hotel_id, checkin_date, checkout_date, guests, name, email];

        db.execute(bookingQuery, params, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }

            const emailText = `
            Dear ${name},

            We are delighted to have you back at **Roomify**! Below are the details of your upcoming reservation:

            🏨 **Hotel Name:** ${hotelName}  
            📍 **Location:** ${location}  
            📅 **Check-in Date:** ${checkin_date}  
            📆 **Check-out Date:** ${checkout_date}  
            👥 **Number of Guests:** ${guests}  

            As a valued member of the **Roomify** family, we want to ensure your stay is as seamless and enjoyable as possible. Should you have any special requests or preferences, feel free to update your booking details through your account or contact us directly.

            We greatly appreciate your trust and loyalty. Thank you for choosing **Roomify** for your travels again—we’re confident you’ll have a wonderful stay!

            Warm regards,  
            **The Roomify Team**  
            📧 support@roomify.com  
            🌐 www.roomify.com  
            📞 +90 123 456 7890
            `;

            sendEmail(email, 'Booking Confirmation', emailText)
                .then(() => {
                    console.log('Confirmation email sent successfully!');
                    res.redirect(`/login-confirmation/${result.insertId}`);
                })
                .catch((error) => {
                    console.error('Failed to send email:', error);
                    res.status(500).send('Booking was successful but failed to send confirmation email.');
                });
        });
    });
});

app.get('/confirmation/:id', (req, res) => {
    const bookingId = req.params.id;

    const query = `
    SELECT b.id, h.name AS hotel_name, h.location, b.checkin_date, b.checkout_date, b.guests, b.name, b.email
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    WHERE b.id = ?
    `;

    db.execute(query, [bookingId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(404).send('Booking not found');
        }

        res.render('confirmation', { booking: result[0] });
    });
});

app.get('/login-confirmation/:id', (req, res) => {
    const bookingId = req.params.id;

    const query = `
    SELECT b.id, h.name AS hotel_name, h.location, b.checkin_date, b.checkout_date, b.guests, b.name, b.email
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    WHERE b.id = ?
    `;

    db.execute(query, [bookingId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(404).send('Booking not found');
        }

        res.render('login_confirmation', { booking: result[0] });
    });
});

app.get('/bookings', (req, res) => {
    const username = req.session.username; 

    const query = `
    SELECT 
    bookings.*, 
    hotels.name AS hotel_name, 
    hotels.location AS hotel_location, 
    image_url AS hotel_image_url 
    FROM bookings
    INNER JOIN hotels ON bookings.hotel_id = hotels.id
    INNER JOIN users ON bookings.user_id = users.id
    WHERE users.username = ?`;


    db.execute(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        res.render('bookings', {
            bookings: results,
            username: username,
        });
    });
});

app.post('/bookings/edit/:id', (req, res) => {
    const bookingId = req.params.id;
    const { checkin, checkout, guests } = req.body;

    const query = `SELECT * FROM bookings WHERE id = ?`;
    db.execute(query, [bookingId], (err, result) => {
        if (err || result.length === 0) {
            console.error(err || 'Booking not found');
            return res.status(500).send('Error retrieving booking details');
        }

        const booking = result[0];
        const { name, email, hotel_id } = booking;

        const hotelQuery = `SELECT name, location FROM hotels WHERE id = ?`;
        db.execute(hotelQuery, [hotel_id], (err, hotelResult) => {
            if (err || hotelResult.length === 0) {
                console.error(err || 'Hotel not found');
                return res.status(500).send('Error retrieving hotel details');
            }

            const hotelName = hotelResult[0].name;
            const location = hotelResult[0].location;

            const updateQuery = `
                UPDATE bookings 
                SET checkin_date = ?, checkout_date = ?, guests = ? 
                WHERE id = ?`;
            const params = [checkin, checkout, guests, bookingId];

            db.execute(updateQuery, params, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }

                const emailText = `
                Dear ${name},

                Your booking for **${hotelName}** has been successfully updated. Below are the updated details:

                🏨 **Hotel Name:** ${hotelName}  
                📍 **Location:** ${location}  
                📅 **New Check-in Date:** ${checkin}  
                📆 **New Check-out Date:** ${checkout}  
                👥 **Number of Guests:** ${guests}  

                If you need further changes or have any questions, feel free to contact us.

                Warm regards,  
                **The Roomify Team**  
                📧 support@roomify.com  
                🌐 www.roomify.com  
                📞 +90 123 456 7890
                `;

                sendEmail(email, 'Booking Updated', emailText)
                    .then(() => {
                        console.log('Update email sent successfully!');
                        res.redirect('/bookings');
                    })
                    .catch((error) => {
                        console.error('Failed to send update email:', error);
                        res.status(500).send('Booking was updated but failed to send confirmation email.');
                    });
            });
        });
    });
});

app.post('/bookings/cancel/:id', (req, res) => {
    const bookingId = req.params.id;

    const query = `SELECT * FROM bookings WHERE id = ?`;
    db.execute(query, [bookingId], (err, result) => {
        if (err || result.length === 0) {
            console.error(err || 'Booking not found');
            return res.status(500).send('Error retrieving booking details');
        }

        const booking = result[0];
        const { name, email, hotel_id } = booking;

        const hotelQuery = `SELECT name, location FROM hotels WHERE id = ?`;
        db.execute(hotelQuery, [hotel_id], (err, hotelResult) => {
            if (err || hotelResult.length === 0) {
                console.error(err || 'Hotel not found');
                return res.status(500).send('Error retrieving hotel details');
            }

            const hotelName = hotelResult[0].name;
            const location = hotelResult[0].location;

            const deleteQuery = 'DELETE FROM bookings WHERE id = ?';
            db.execute(deleteQuery, [bookingId], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }

                const emailText = `
                Dear ${name},

                We regret to inform you that your booking for **${hotelName}** has been successfully cancelled. Below are the details:

                🏨 **Hotel Name:** ${hotelName}  
                📍 **Location:** ${location}  
                📅 **Check-in Date:** ${booking.checkin_date}  
                📆 **Check-out Date:** ${booking.checkout_date}  
                👥 **Number of Guests:** ${booking.guests}  

                If you change your mind or need assistance, feel free to reach out to us.

                Warm regards,  
                **The Roomify Team**  
                📧 support@roomify.com  
                🌐 www.roomify.com  
                📞 +90 123 456 7890
                `;

                sendEmail(email, 'Booking Cancelled', emailText)
                    .then(() => {
                        console.log('Cancellation email sent successfully!');
                        res.redirect('/bookings');
                    })
                    .catch((error) => {
                        console.error('Failed to send cancellation email:', error);
                        res.status(500).send('Booking was cancelled but failed to send cancellation email.');
                    });
            });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});