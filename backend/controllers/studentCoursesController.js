import StudentCourses from "../models/studentCourses.js";

export const getCoursesbyStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    // console.log(studentId);

    const studentBroughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    res.status(200).json({
      success: true,
      data: studentBroughtCourses.courses,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};
