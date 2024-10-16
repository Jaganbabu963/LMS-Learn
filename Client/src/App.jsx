import { Routes, Route } from "react-router-dom";
// import Auth from "./pages/auth";
import RouteGuard from "./components/RouteGuard";
import { useContext } from "react";
import { AuthContext } from "./context/Auth-context";
import Instructor from "./pages/Instructor";
import CommonLayout from "./components/studentView/CommonLayout";
import Student from "./pages/studentpages/Student";
import NotFound from "./pages/NotFound";
import AddnewCoursePage from "./pages/AddnewCourse";
import StudentCoursePage from "./pages/studentpages/StudentCoursePage";
import StudentCourseDetailsPage from "./pages/studentpages/StudentCourseDetailsPage";
import PaymentReturnPage from "./pages/studentpages/PaymentReturnPage";
// import StudentCourses from "./pages/studentpages/myCourses";
import CourseProgresPage from "./pages/studentpages/CourseProgresPage";
import Auth from "./pages/Auth";
import StudentCourses from "./pages/studentpages/MyCourses";

const App = () => {
  const { auth } = useContext(AuthContext);
  // console.log(auth);

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<Auth />}
              user={auth?.user}
              authenticated={auth?.authenticate}
            />
          }
        />

        <Route
          path="/instructor"
          element={
            <>
              <RouteGuard
                element={<Instructor />}
                user={auth?.user}
                authenticated={auth?.authenticate}
              />
            </>
          }
        />
        <Route
          path="/instructor/create-new-course"
          element={
            <>
              <RouteGuard
                element={<AddnewCoursePage />}
                user={auth?.user}
                authenticated={auth?.authenticate}
              />
            </>
          }
        />
        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <>
              <RouteGuard
                element={<AddnewCoursePage />}
                user={auth?.user}
                authenticated={auth?.authenticate}
              />
            </>
          }
        />
        <Route
          path="/"
          element={
            <RouteGuard
              element={<CommonLayout />}
              user={auth?.user}
              authenticated={auth?.authenticate}
            />
          }
        >
          <Route path="" element={<Student />} />
          <Route path="/home" element={<Student />} />
          <Route path="/courses" element={<StudentCoursePage />} />
          <Route
            path="/course/details/:id"
            element={<StudentCourseDetailsPage />}
          />
          <Route path="/payment-return" element={<PaymentReturnPage />} />
          <Route path="/student-courses" element={<StudentCourses />} />
          <Route path="/course-progress/:id" element={<CourseProgresPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
