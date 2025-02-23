const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.requestPasswordReset = async (req, res) => {
    try{
        const { email } = req.body;

        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(404).json({ error: "User not found"});
        }


        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiration = Date.now() + 3600000;

        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;
        await user.save();

        const resetUrl = `${process.env.SERVER_URL}/reset-password/${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `We Recieved password reset request from you.\n Click the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour. \n\nIf you did not request this, please ignore the email.`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Password reset email sent" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try{
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
        if(!user) {
            return res.status(400).json({ error: "Invalid or expired token"});
        }

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}