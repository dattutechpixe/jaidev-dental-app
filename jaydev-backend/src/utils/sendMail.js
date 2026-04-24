// utils/sendMail.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sitename = process.env.SITE_NAME;

// Configure Nodemailer transporter for Hostinger SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",       // Hostinger SMTP server
    port: 587,                        // Port for secure SMTP
    secure: false,                     // True for SSL
    auth: {
        user: process.env.SMTP_USER,  // Example: support@sitename.com
        pass: process.env.SMTP_PASS,  // Email password
    },
    tls: {
        rejectUnauthorized: false,    // Fix SSL issues (Hostinger requirement)
    }
});

// Global reusable SEND EMAIL function
exports.sendEmail = async ({ to, subject, text }) => {
    try {
        if (!to) {
            console.error("❌ Error: No recipient email provided.");
            return { success: false, message: "Recipient email missing" };
        }

        const mailOptions = {
            from: `"${sitename} Support" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html: text,   // Accepts HTML or plain text
        };

        const response = await transporter.sendMail(mailOptions);

        // console.log("📩 Email Sent:", {
        //     to,
        //     subject,
        //     messageId: response.messageId,
        // });

        return { success: true, response };

    } catch (error) {
        console.error("❌ Email Sending Failed:", error);
        return { success: false, error };
    }
};
