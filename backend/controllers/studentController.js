import Course from "../models/courses.js";
import StudentCourses from "../models/studentCourses.js";

export const getStudentViewCoursesList = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;

        break;
      case "price-hightolow":
        sortParam.pricing = -1;

        break;
      case "title-atoz":
        sortParam.title = 1;

        break;
      case "title-ztoa":
        sortParam.title = -1;

        break;

      default:
        sortParam.pricing = 1;
        break;
    }
    const courseList = await Course.find(filters).sort(sortParam);

    res.status(200).json({
      success: true,
      data: courseList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

export const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    // const studentCourses = await StudentCourses.findOne({ userId: studentId });
    // // console.log(studentCourses);
    // const isStudentAlreadyBoughtCourse =
    //   studentCourses?.courses?.findIndex((item) => item?.courseId === id) > -1;
    // // console.log(isStudentAlreadyBoughtCourse);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details Found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

export const checkIfStudentBoughtCourse = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const studentCourses = await StudentCourses.findOne({ userId: studentId });

    const isStudentAlreadyBoughtCourse =
      studentCourses?.courses?.findIndex((item) => item?.courseId === id) > -1;

    res.status(200).json({
      success: true,
      data: isStudentAlreadyBoughtCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};
