import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signUp = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json({ success: false, message: "invalid email" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Password must be atleast 6 characters",
                });
        }

        const existingUserByEmail = await User.findOne({ email: email });

        if (existingUserByEmail) {
            return res
                .status(400)
                .json({ success: false, message: "Email already exists" });
        }

        const existingUserByUsername = await User.findOne({
            username: username,
        });
        if (existingUserByUsername) {
            return res
                .status(400)
                .json({ success: false, message: "Username already exists" });
        }

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

        const image =
            PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image,
        });
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,
                password: "",
            },
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
};

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(404).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "",
            },
        });
    } catch (error) {
        console.log("error in login controller", error.message);
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "logged out successfully",
        });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const  authCheck = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        console.log("Error in auth controller", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};
