/* eslint-disable react-hooks/exhaustive-deps */
import CourseCurriculam from "@/components/instructorView/addCourse/CourseCurriculam";
import CourseLanding from "@/components/instructorView/addCourse/CourseLanding";
import CourseSettings from "@/components/instructorView/addCourse/CourseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/context/Auth-context";
import { InstructorContext } from "@/context/InstructorContext";
import {
  addNewCourseService,
  fetchCourseDetailsService,
  updateCourseDetailService,
} from "@/services/index.js";
import { courseLandingInitialFormData } from "../../config/index.js";
import { courseCurriculumInitialFormData } from "../../config/index.js";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddnewCoursePage = () => {
  const {
    courseLandingPageFormdata,
    courseCurriculamFormData,
    setCourseLandingPageFormdata,
    setCourseCurriculamFormData,
    currentEdittedCourseId,
    setCurrentEdittedCourseId,
  } = useContext(InstructorContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  const fetchCurrentCourseDetails = async () => {
    const response = await fetchCourseDetailsService(currentEdittedCourseId);
    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});
      // console.log(setCourseFormData);
      setCourseLandingPageFormdata(setCourseFormData);
      setCourseCurriculamFormData(response?.data?.curriculam);
    }
  };

  useEffect(() => {
    if (currentEdittedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEdittedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEdittedCourseId(params.courseId);
  }, [params?.courseId]);

  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  };

  const validateFormData = () => {
    for (const key in courseLandingPageFormdata) {
      if (isEmpty(courseLandingPageFormdata[key])) {
        return false;
      }
    }

    let hasPreview = false;

    for (const item of courseCurriculamFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.freePreview) {
        hasPreview = true;
      }
    }
    return hasPreview;
  };

  const handleSubmit = async () => {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingPageFormdata,
      students: [],
      curriculam: courseCurriculamFormData,
      isPublished: true,
    };
    // console.log(courseFinalFormData);1

    const response =
      currentEdittedCourseId !== null
        ? await updateCourseDetailService(
            currentEdittedCourseId,
            courseFinalFormData
          )
        : await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseCurriculamFormData(courseCurriculumInitialFormData);
      setCourseLandingPageFormdata(courseLandingInitialFormData);
      navigate(-1);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <div className=" flex justify-between">
        <h1 className="text-3xl flex-extrabold mb-5"> Create New Course</h1>
        <Button
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleSubmit}
        >
          SUBMIT
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculam" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculam">Curriculam</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculam">
                <CourseCurriculam />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddnewCoursePage;
