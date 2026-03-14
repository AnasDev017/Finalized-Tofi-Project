import UserModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();
// SIGNUP
export const signUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required!" });
    }

    const existsUser = await UserModel.findOne({ email });
    if (existsUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new UserModel({
      email,
      password: hashPassword,
      name,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Account registered!",
      newUser,
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required!" });
    }

    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return res
        .status(400)
        .json({ success: false, message: "Account does not exist!" });
    }
    const isMatch = await bcryptjs.compare(password, findUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password!" });
    }

    // jwt token
    const access_token = jwt.sign(
      {
        userId: findUser._id,
        email: findUser.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    
    // Set cookie (works for same-origin)
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    // Also return token in response (works for cross-origin)
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: access_token,
      user: {
        id: findUser._id,
        email: findUser.email,
        name: findUser.name
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};


// SEND USER PROFILE DATA

export const sendUserData = async (req, res) => {
  // console.log("Recive user data id",req.user._id);
  const user = await UserModel.findById(req.user._id);
  console.log("----------------------------");
  console.log("Send user data of Profile");
  res.json(user);
};

// LOGOUT 
export const  logout = (req,res)=>{
   try {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
      path: '/'
    });
    return  res.send({ message: 'Logged out successfully' });
   } catch (error) {
    return  console.log(error);;
   }
}



