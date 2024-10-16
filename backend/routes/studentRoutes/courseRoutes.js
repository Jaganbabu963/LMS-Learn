import express from "express";
import {
  getStudentViewCourseDetails,
  getStudentViewCoursesList,
  checkIfStudentBoughtCourse,
} from "../../controllers/studentController.js";

const router = express.Router();

router.get("/get", getStudentViewCoursesList);
router.get("/get/details/:id", getStudentViewCourseDetails);
router.get("/purchase-info/:id/:studentId", checkIfStudentBoughtCourse);

export default router;
