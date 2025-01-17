# Hotel Reservation System - Project

## Project Overview
This project is a web-based Hotel Reservation System developed to streamline the hotel booking process. The system enables users to make reservations, view available rooms, manage their profiles, and receive booking confirmations. It provides a seamless user experience for both guests and hotel administrators.

## Features

### Common Features for All Users
- **User Registration and Login**: Users can register by providing basic details (e.g., name, email, password) and can log in to access system features based on their role.
- **Password Reset**: Users can reset their passwords via email if forgotten.
- **Homepage**: A general homepage accessible to all, with informational sections like About, Contact, and FAQ.

### Guest Features
- **Reservation Without Logging In**: Guests can make reservations without needing to create an account, providing flexibility and ease of use.
  
### Logged-in User Features
- **Personalized Dashboard**: Access to promotions, profile updates, and other personalized features.
- **Manage Reservations**: Users can view, modify, and cancel their existing bookings.
- **Profile Management**: Ability to update user profile information.


## Technologies Used
- **Frontend**: HTML, CSS, JavaScript, Bootstrap, EJS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Session Management**: express-session
- **Password Hashing**: bcryptjs
- **Email Notifications**: Nodemailer

## Database Structure
The project uses the following database tables:
- **users**: Stores user information (user_id, username, email, password, role, etc.).
- **bookings**: Stores reservation details (reservation_id, user_id, hotel_id, check_in_date, check_out_date, etc.).
- **hotels**: Stores hotel details (hotel_id, name, location, description).


## System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 16.x or higher
- **npm**: Node Package Manager for dependency management
- **Database**: MySQL (or compatible RDBMS)

## Setup Instructions

### Installation
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/berkyalkn/hotel-reservation-system.git

2. Navigate to the project directory:
   ```bash
    cd hotel-reservation-system

3. Install the required dependencies:
   ```bash
   npm install

4. Set up the MySQL database:
+ Create a new database, e.g., hotel_reservation_system.
+ Import the database schema from the database.sql file (if available) or manually create tables as per project requirements.
5. Configure the environment variables:
+ Create a .env file in the root directory.
+ Set necessary environment variables, such as database credentials, email service configurations, etc.

6. Start the application
   ```bash
   npm start
   
7. Open your browser and navigate to http://localhost:3000 to access the Hotel Reservation System.

### Usage
Once the setup is complete, you can access the following features based on your role:
+ For Guests: Make reservations, view hotel details, and more.
+ For Logged-in Users: Access personalized features like profile management, reservation history, and booking modifications.

## License
This project is open-source and available under the MIT License.