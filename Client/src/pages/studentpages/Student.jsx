/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import { courseCategories } from "../../../config/index.js";
import banner from "../../assets/public/photo4.jpg";
import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/Student-context.jsx";
import {
  checkCoursePurchaseInfo,
  fetchStudentCourseListService,
} from "@/services/index.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/Auth-context.jsx";

const Student = () => {
  const {
    studentViewCourseList,
    setStudentViewCourseList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);

  const fetchAllStudentViewCourses = async () => {
    const response = await fetchStudentCourseListService();
    if (response?.success) {
      setStudentViewCourseList(response?.data);
      setLoadingState(false);
    }
    // console.log(response);
  };
  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);
  // console.log(studentViewCourseList);

  const handleCourseNavigate = async (getCurrentcourseId) => {
    const response = await checkCoursePurchaseInfo(
      getCurrentcourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentcourseId}`);
      } else {
        navigate(`/course/details/${getCurrentcourseId}`);
      }
    }
  };

  const handleNavigateToCoursesPage = (getCurrentId) => {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
          <div className="lg:w-1/2 lg:pr-12 mb-2">
            <h1 className="text-4xl font-bold mb-4">Learning thet gets you</h1>
            <p className="text-xl">
              Skills for your present and your future. Get Started with US
            </p>
          </div>
          <div className="lg:w-full mb-8 lg:mb-0">
            <img
              src={banner}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </section>
        <section className="py-8 px-4 lg:px-8 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {courseCategories.map((categoryItem) => (
              <Button
                className="justify-start"
                variant="outline"
                key={categoryItem.id}
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              >
                {categoryItem.label}
              </Button>
            ))}
          </div>
        </section>
        <section className="py-12 px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentViewCourseList && studentViewCourseList.length > 0 ? (
              studentViewCourseList.map((courseItem) => (
                <div
                  onClick={() => {
                    handleCourseNavigate(courseItem?._id);
                  }}
                  className="border rounded-lg overflow-hidden shadow cursor-pointer"
                  key={courseItem?._id}
                >
                  <img
                    src={courseItem?.image}
                    width={300}
                    height={150}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {courseItem?.instructorName}
                    </p>
                    <p className="font-bold text-[16px]">
                      ${courseItem?.pricing}
                    </p>
                  </div>
                </div>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1>No Courses Found</h1>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
export default Student;
