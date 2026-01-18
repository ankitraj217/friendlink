// src/configs/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // Gmail SMTP server configuration
    service: 'gmail',
    host: 'smtp.gmail.com',
    // Port for SSL (465) or TSL (587)
    port: process.env.MAILER_PORT || 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD, // Use App Password for Gmail
    },
});

// Function to send an email with retry logic
const sendEmail = async (mailOptions, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully: ${info.response}`);
            return info;
        } catch (error) {
            console.error(
                `Attempt ${attempt} failed to send email: ${error.message}`
            );
            if (attempt < retries) {
                console.log(`Retrying in 1 second...`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } else {
                console.error(`All ${retries} attempts failed. Email not sent.`);
                // Do NOT throw error to crash server
                return null;
            }
        }
    }
};

export default sendEmail;