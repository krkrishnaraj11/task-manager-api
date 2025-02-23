const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user
exports.signup = async (req,res) => {
    try{
        const { email, name, password } = req.body;
        const user = new User({ email, name, password });
        await user.save();
        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Authenticate user and return JWT
exports.login = async (req,res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "48h",
        });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};