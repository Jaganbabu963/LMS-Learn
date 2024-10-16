import express from "express";
import { getCoursesbyStudentId } from "../../controllers/studentCoursesController.js";

const router = express.Router();

router.get("/get/:studentId", getCoursesbyStudentId);

export default router;
