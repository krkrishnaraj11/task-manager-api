const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user
exports.signup = async (req,res) => {
    try{
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Authenticate user and return JWT
exports.login = async (req,res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "48h",
        });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};