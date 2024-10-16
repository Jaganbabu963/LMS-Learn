import mongoose from "mongoose";

const StudentCourseSchema = new mongoose.Schema({
  userId: String,
  courses: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      instructorName: String,
      DateofPurchase: Date,
      courseImage: String,
    },
  ],
});

const StudentCourses = mongoose.model("StudentCourses", StudentCourseSchema);
export default StudentCourses;
