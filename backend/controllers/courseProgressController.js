import CourseProgress from "../models/courseProgress.js";
import Course from "../models/courses.js";
import StudentCourses from "../models/studentCourses.js";

//  Mark the current lecture as Viewed

export const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
      await progress.save();
    } else {
      const lecturesProgress = progress?.lecturesProgress?.find(
        (item) => item.lectureId === lectureId
      );
      if (lecturesProgress) {
        (lecturesProgress.viewed = true),
          (lecturesProgress.dateViewed = new Date());
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: " Course not found",
      });
    }

    //check all the lectures are viewed or not
    const allLecturesViewed =
      progress.lecturesProgress.length === course?.curriculam?.length;

    if (allLecturesViewed) {
      (progress.completed = true),
        (progress.completionDate = new Date()),
        await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: true,
      message: "Some Error Occured",
    });
  }
};

// get Current Progress

export const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const studentCourses = await StudentCourses.findOne({ userId });

    const isCurrentCoursePurchasedByCurrentUserorNot =
      studentCourses?.courses?.findIndex(
        (item) => item?.courseId === courseId
      ) > -1;

    if (!isCurrentCoursePurchasedByCurrentUserorNot) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchased: false,
        },
        message: "You need to Purchase this Course to Access it",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course Not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "No Progress Found, You Can Start Watching the Course",
        data: {
          courseDetails: course,
          progress: [],

          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,

        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: true,
      message: "Some Error Occured",
    });
  }
};

// reset Course Progress
export const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: true,
      message: "Some Error Occured",
    });
  }
};
