/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const StudentContext = createContext(null);

const StudentProvider = ({ children }) => {
  const [studentViewCourseList, setStudentViewCourseList] = useState([]);
  const [studentViewCourseDetails, setStudentViewCourseDetails] =
    useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [loadingState, setLoadingState] = useState(true);
  const [studentBoughtCourses, setStudentBoughtCourses] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});
  return (
    <StudentContext.Provider
      value={{
        studentViewCourseList,
        setStudentViewCourseList,
        loadingState,
        setLoadingState,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        studentBoughtCourses,
        setStudentBoughtCourses,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
