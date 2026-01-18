// src/routes/authRoute.js
import express from 'express';
import jwt from 'jsonwebtoken';
import sendEmail from '../configs/mailer.js';

import { findUser, createUser, updateUser } from '../controllers/userController.js';
import {
    generateUserId,
    matchPassword,
    generateToken,
    generateResetToken,
    generateEmailVerifyToken,
    generateHashedPassword
} from '../controllers/authController.js';

import {
    welcomeTemplate,
    emailVerificationTemplate,
    alertTemplate,
    resetTemplate
} from '../utils/emailTemplate.js';

import { requireAuth } from '../middlewares/authMiddleware.js';

// Router Initialization
const authRouter = express.Router();
// Environment Variables
const jwtResetSecret = process.env.JWT_RESET_SECRET;
// Routes
authRouter
    .get('/session', requireAuth, async (req, res) => {
        try {
            const user = await findUser(req.user, null);
            if (!user) return res.status(404).send('User Not Found');

            const authUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
            res.send({ user: authUser, message: 'Session Active' });
        } catch (err) {
            console.log('Error : Get/auth/session', err);
            return res.status(500).send("Server Error");
        }
    })
    .post('/login', async (req, res) => {
        const { userId, email, password } = req.body;
        const optionalUser = {
            userId: userId ? userId : '',
            email: email ? email : ''
        }
        try {
            // Finding User
            const user = await findUser(optionalUser.userId, optionalUser.email);
            if (!user) return res.status(404).send('User Not Found');
            // Matching Password
            const isMatch = await matchPassword(password, user.password);
            if (!isMatch) return res.status(401).send('Invalid Credentials');
            // Sending Token For Auto Login
            const token = generateToken(user.id);
            const authUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
            res.send({ user: authUser, token: token, message: `Login Success: ${user.id}` });
        } catch (err) {
            console.log('Error : Post/auth/login'.red, err);
            res.status(500).send("Server Error");
        }
    })
    .post('/register', async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const existingUser = await findUser(null, email);
            if (existingUser) return res.status(409).send('User Already Exists');
            // Generating Hashed Password
            const hashedPassword = await generateHashedPassword(password);

            let id, exists;
            do {
                id = generateUserId();
                exists = await findUser(id, null);
            } while (exists);

            const newUser = await createUser(id, name, email, hashedPassword);
            // Generate email verify token
            const verifyToken = generateEmailVerifyToken(newUser.id);
            const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
            // Send welcome email (non-blocking)
            try {
                await sendEmail({
                    from: `"FriendLink" <${process.env.MAILER_USER}>`,
                    to: email,
                    subject: 'Welcome to FriendLink!',
                    html: welcomeTemplate(name),
                });
            } catch (mailErr) {
                console.log('⚠ Welcome email failed:', mailErr);
            }
            // Send verification email (non-blocking)
            try {
                await sendEmail({
                    from: `"FriendLink" <${process.env.MAILER_USER}>`,
                    to: email,
                    subject: 'Verify your email – FriendLink',
                    html: emailVerificationTemplate(verifyLink),
                });
            } catch (mailErr) {
                console.log('⚠ Verification email failed:', mailErr);
            }
            res.status(201).json({
                message: 'Registration successful. Please verify your email.',
            });
        } catch (err) {
            console.error('Error : Post/auth/register'.red, err);
            res.status(500).send("Server Error");
        }
    })
    .get('/email/verify/:token', async (req, res) => {
        const { token } = req.params;
        try {
            const payload = jwt.verify(token, process.env.JWT_VERIFY_SECRET);
            // Check token type
            if (payload.type !== 'EMAIL_VERIFY') {
                return res.status(400).send('Invalid Token');
            }
            // Finding User
            const user = await findUser(payload.uid, null);
            if (!user) return res.status(404).send('User Not Found');
            // Check if already verified
            if (user.email_verified) {
                return res.send('Email already verified');
            }
            // Updating User as Verified
            await updateUser(user.id, { email_verified: true });
            res.send('Email verified successfully');
        } catch (err) {
            res.status(400).send('Invalid or expired verification link');
        }
    })
    .post('/email/resend', requireAuth, async (req, res) => {
        try {
            const user = await findUser(req.user, null);
            if (!user) return res.status(404).send('User Not Found');
            // Check if already verified
            if (user.email_verified) {
                return res.status(400).send('Email already verified');
            }
            // Generating and Sending Verification Email
            const verifyToken = generateEmailVerifyToken(user.id);
            const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
            // Sending Verification Email
            await sendEmail({
                from: `"FriendLink" <${process.env.MAILER_USER}>`,
                to: user.email,
                subject: 'Verify your email – FriendLink',
                html: emailVerificationTemplate(verifyLink),
            });
            res.send('Verification email sent');
        } catch (err) {
            console.log('Error : Post/auth/email/resend', err);
            res.status(500).send("Server Error");
        }
    })
    .post('/password/verify', requireAuth, async (req, res) => {
        const userId = req.user;
        const { password } = req.body;
        try {
            // Finding User
            const user = await findUser(userId, null);
            if (!user) return res.status(404).send('User Not Found');
            // Matching Password
            const isMatch = await matchPassword(password, user.password);
            if (!isMatch) return res.status(401).send('Invalid Password');
            res.send('Verified');
        } catch (err) {
            console.log('Error : Post/auth/password/verify', err);
            res.status(500).send("Server Error");
        }
    })
    .post('/password/change', requireAuth, async (req, res) => {
        const userId = req.user;
        const { password } = req.body;
        try {
            const user = await findUser(userId, null);
            if (!user) return res.status(404).send('User Not Found');
            // Generating Hashed Password and Updating
            const hashedPassword = await generateHashedPassword(password);
            await updateUser(userId, { password: hashedPassword });
            // Send alert email (non-blocking)
            try {
                await sendEmail({
                    from: `"FriendLink" <${process.env.MAILER_USER}>`,
                    to: user.email,
                    subject: "Alert! Password changed",
                    html: alertTemplate("password"),
                });
            } catch (mailErr) {
                console.log("⚠ Alert email failed:", mailErr);
            }
            res.send('Password Updated');
        } catch (err) {
            console.log('Error : Post/auth/password/change', err);
            res.status(500).send("Server Error");
        }
    })
    .post('/email/change', requireAuth, async (req, res) => {
        const userId = req.user;
        const { email } = req.body;
        try {
            // Updating User Email
            await updateUser(userId, { email: email });
            // Send alert email (non-blocking)
            try {
                await sendEmail({
                    from: `"FriendLink" <${process.env.MAILER_USER}>`,
                    to: email,
                    subject: "Alert! Email changed",
                    html: alertTemplate("email"),
                });
            } catch (mailErr) {
                console.log("⚠ Alert email failed:", mailErr);
            }
            res.send('Email Updated');
        } catch (err) {
            console.log('Error : Post/auth/email/change', err);
            res.status(500).send("Server Error");
        }
    })
    .post('/password/forget', async (req, res) => {
        const { email } = req.body;
        try {
            const user = await findUser(null, email);
            if (!user) {
                return res.status(200).send('If email exists, reset link sent');
            }
            // Generating Reset Token
            const resetToken = generateResetToken(user.id);
            const resetLink = `${process.env.CLIENT_URL}/reset/password?token=${resetToken}`;
            // Sending Reset Email
            await sendEmail({
                from: `"FriendLink" <${process.env.MAILER_USER}>`,
                to: email,
                subject: 'Reset your FriendLink password',
                html: resetTemplate(resetLink),
            });
            res.send('If email exists, reset link sent');
        } catch (err) {
            console.log('Error : Post/auth/password/forget', err);
            res.status(500).send("Server Error");
        }
    })
    .get('/password/reset/:token', async (req, res) => {
        const { token } = req.params;
        try {
            // Verifying Token
            const payload = jwt.verify(token, jwtResetSecret);
            if (payload.type !== 'PASSWORD_RESET') {
                return res.status(400).send({ valid: false });
            }
            res.send({ valid: true });
        } catch (err) {
            return res.status(400).send({ valid: false });
        }
    })
    .post('/password/reset', async (req, res) => {
        const { token, password } = req.body;
        try {
            const payload = jwt.verify(token, jwtResetSecret);
            if (payload.type !== 'PASSWORD_RESET') {
                return res.status(400).send('Invalid Token');
            }
            const userId = payload.uid;
            // Generating Hashed Password
            const hashedPassword = await generateHashedPassword(password);
            // Updating User Password
            await updateUser(userId, { password: hashedPassword });
            res.send('Password Reset Successful');
        } catch (err) {
            console.log('Error : Post/auth/password/reset', err);
            res.status(500).send("Server Error");
        }
    });

export default authRouter;
