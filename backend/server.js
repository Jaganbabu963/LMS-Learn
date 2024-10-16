import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import mediaRoutes from "./routes/instructor-routes/mediaRoutes.js";
import courseRoutes from "./routes/instructor-routes/courseRoutes.js";
import studentViewCourseRoutes from "./routes/studentRoutes/courseRoutes.js";
import orderRoutes from "./routes/studentRoutes/orderRoutes.js";
import studentRoutes from "./routes/studentRoutes/studentCoursesRoutes.js";
import studentCourseProgressRoutes from "./routes/studentRoutes/studentCourseProgressRoutes.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const PORT = process.env.PORT;
const mongo_Uri = process.env.DB_URI.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(mongo_Uri)
  .then(() => console.log("Db Connected Securely"))
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", courseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", orderRoutes);
app.use("/student/courses-bought", studentRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
