/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "@/context/Auth-context";
import { StudentContext } from "@/context/Student-context";
import { getStudentbroughtCoursesService } from "@/services/index.js";
import { Watch } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentCourses = () => {
  const { auth } = useContext(AuthContext);
  const {
    studentBoughtCourses,
    setStudentBoughtCourses,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const studentId = auth?.user?._id;
  // console.log(studentId);
  const navigate = useNavigate();

  const fetchStudentboughtCourses = async () => {
    const response = await getStudentbroughtCoursesService(studentId);
    if (response?.success) {
      setStudentBoughtCourses(response?.data);
      setLoadingState(false);
    }
  };
  useEffect(() => {
    fetchStudentboughtCourses();
  }, []);
  return (
    <>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {studentBoughtCourses && studentBoughtCourses.length > 0 ? (
            studentBoughtCourses.map((course) => (
              <Card key={course._id} className="flex flex-col">
                <CardContent className="p-4 flex-grow">
                  <img
                    src={course?.courseImage}
                    alt={course?.title}
                    className="h-52 w-full object-cover rounded-md mb-4"
                  />
                  <h3 className="font-bold mb-1">{course?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {course?.instructorName}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      navigate(`/course-progress/${course?.courseId}`)
                    }
                    className="flex-1"
                  >
                    <Watch className="mr-2 h-4 w-4" />
                    Start Watching
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : loadingState ? (
            <Skeleton />
          ) : (
            <h1 className="text-3xl font-bold">No Courses found</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentCourses;
