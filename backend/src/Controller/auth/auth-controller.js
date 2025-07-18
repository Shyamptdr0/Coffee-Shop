import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

// Register
export const registerUser = async (req, res) => {
    try {
        let { userName, email, password, gender } = req.body;

        userName = userName.trim();
        email = email.trim().toLowerCase();
        password = password.trim();

        if (!userName || !email || !password || !gender) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.json({ success: false, message: "Email already exists" });
        }

        const checkUser = await User.findOne({ userName });
        if (checkUser) {
            return res.json({ success: false, message: "Username already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const profile =
            gender === "male"
                ? `https://avatar.iran.liara.run/public/boy?userName=${userName}`
                : `https://avatar.iran.liara.run/public/girl?userName=${userName}`;

        const newUser = new User({ userName, email, password: hashPassword, gender, profile });
        await newUser.save();

        res.status(200).json({ success: true, message: "Registration successful" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Login
export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email.trim().toLowerCase();
        password = password.trim();

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist! Please register first" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password! Please try again" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                userName: user.userName,
                gender: user.gender,
                profile: user.profile,
            },
            process.env.JWT_SECRET, // ✅ secure
            { expiresIn: "60m" }
        );

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                userName: user.userName,
                gender: user.gender,
                profile: user.profile,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Login error" });
    }
};

// Logout
export const logoutUser = (req, res) => {
    res.clearCookie("token").json({ success: true, message: "Logout successfully!" });
};
