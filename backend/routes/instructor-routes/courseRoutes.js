import express from "express";
import {
  addNewCourse,
  getAllCourses,
  getCourseDetailsbyId,
  updateACoursebyId,
} from "../../controllers/instructorController.js";

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsbyId);
router.put("/update/:id", updateACoursebyId);

export default router;
