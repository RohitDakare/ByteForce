require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize clients
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verify Google token
const verifyGoogleToken = async (token) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        return ticket.getPayload();
    } catch (error) {
        throw new Error('Invalid Google token');
    }
};

// Send Email OTP
const sendEmailOTP = async (email, otp) => {
    try {
        await emailTransporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Login OTP for Echelon 25',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Your OTP for Echelon 25</h2>
                    <p>Your one-time password is: <strong>${otp}</strong></p>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this OTP, please ignore this email.</p>
                </div>
            `
        });
    } catch (error) {
        throw new Error('Failed to send email OTP');
    }
};

// Send SMS OTP
const sendSMSOTP = async (phone, otp) => {
    try {
        await twilioClient.messages.create({
            body: `Your Echelon 25 OTP is: ${otp}. Valid for 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
    } catch (error) {
        throw new Error('Failed to send SMS OTP');
    }
};

// Google Sign In
app.post('/api/auth/google', async (req, res) => {
    try {
        const { token } = req.body;
        const payload = await verifyGoogleToken(token);
        const otp = generateOTP();
        
        otpStore.set(payload.email, {
            otp,
            timestamp: Date.now(),
            type: 'google'
        });

        await sendEmailOTP(payload.email, otp);
        
        res.json({ 
            message: 'OTP sent to email',
            email: payload.email
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Phone Sign In
app.post('/api/auth/phone', async (req, res) => {
    try {
        const { phone } = req.body;
        const otp = generateOTP();
        
        otpStore.set(phone, {
            otp,
            timestamp: Date.now(),
            type: 'phone'
        });

        await sendSMSOTP(phone, otp);
        
        res.json({ 
            message: 'OTP sent to phone',
            phone
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
    const { identifier, otp } = req.body;
    const storedData = otpStore.get(identifier);

    if (!storedData) {
        return res.status(400).json({ error: 'OTP expired or not found' });
    }

    if (Date.now() - storedData.timestamp > 300000) { // 5 minutes expiry
        otpStore.delete(identifier);
        return res.status(400).json({ error: 'OTP expired' });
    }

    if (storedData.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP verified, generate JWT
    const token = jwt.sign(
        { identifier, type: storedData.type },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    otpStore.delete(identifier); // Clear used OTP
    res.json({ token });
});

// Verify JWT middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Protected route example
app.get('/api/auth/profile', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

// Logout (client-side only, invalidate token on client)
app.post('/api/auth/logout', verifyToken, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
