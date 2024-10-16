import express from "express";
import {
  registerUser,
  loginUser,
  authenticate,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/checkAuth", authenticate, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export default router;
