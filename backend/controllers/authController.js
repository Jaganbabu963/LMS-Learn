import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const verifyJWT = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = async (req, res) => {
  const { userName, userEmail, Password, role } = req.body;

  const existingUser = await User.findOne({
    userEmail,
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already Exists,Please Log-In",
    });
  }

  const hashPassword = await bcrypt.hash(Password, 10);
  const newUser = new User({
    userName,
    userEmail,
    Password: hashPassword,
    role,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered Successfully",
  });
};

export const loginUser = async (req, res) => {
  const { userEmail, Password } = req.body;
  // console.log(Password);

  try {
    // Check if user exists
    const checkUser = await User.findOne({ userEmail });
    // console.log(checkUser.Password);

    // If user doesn't exist or password doesn't match
    if (!checkUser || !(await bcrypt.compare(Password, checkUser.Password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userEmail: checkUser.userEmail,
      },
      process.env.JWT_SECRET,
      { expiresIn: "120m" } // Fixed typo: 'expipresIn' to 'expiresIn'
    );

    // Respond with success and token
    res.status(200).json({
      success: true,
      message: "Logged in Successfully", // Fixed typo: 'Succesfully' to 'Successfully'
      data: {
        checkUser,
        accessToken, // Include the token in the response
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: "User not LoggeIn,Please LogIn",
    });
  }

  const token = authHeader.split(" ")[1];

  const payload = verifyJWT(token, process.env.JWT_SECRET);
  if (!payload) {
    return res.status(400).json({
      success: false,
      message: "User Logged Out, Please Login Again",
    });
  }
  // console.log(payload.userEmail);

  const loggedUser = await User.findById(payload._id);

  req.user = loggedUser;

  next();
};
