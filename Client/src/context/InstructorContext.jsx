/* eslint-disable react/prop-types */
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "../../config/index.js";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);
const InstructorProvider = ({ children }) => {
  const [courseLandingPageFormdata, setCourseLandingPageFormdata] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculamFormData, setCourseCurriculamFormData] = useState(
    courseCurriculumInitialFormData
  );

  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);

  const [instrctorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEdittedCourseId, setCurrentEdittedCourseId] = useState(null);

  return (
    <InstructorContext.Provider
      value={{
        courseLandingPageFormdata,
        setCourseLandingPageFormdata,
        courseCurriculamFormData,
        setCourseCurriculamFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instrctorCoursesList,
        setInstructorCoursesList,
        currentEdittedCourseId,
        setCurrentEdittedCourseId,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
};

export default InstructorProvider;
