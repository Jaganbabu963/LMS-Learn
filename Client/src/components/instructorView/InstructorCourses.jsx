/* eslint-disable react/prop-types */
import { Delete, Edit } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { InstructorContext } from "@/context/InstructorContext";
import { courseCurriculumInitialFormData } from "../../../config/index.js";
import { courseLandingInitialFormData } from "../../../config/index.js";

const InstructorCourses = ({ listofCourses }) => {
  const navigate = useNavigate();
  const {
    setCurrentEdittedCourseId,
    setCourseLandingPageFormdata,
    setCourseCurriculamFormData,
  } = useContext(InstructorContext);

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
          <Button
            onClick={() => {
              navigate("/instructor/create-new-course");
              setCurrentEdittedCourseId(null);
              setCourseCurriculamFormData(courseCurriculumInitialFormData);
              setCourseLandingPageFormdata(courseLandingInitialFormData);
            }}
            className="p-6"
          >
            Add Courses
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Courses</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listofCourses && listofCourses?.length > 0
                  ? listofCourses.map((course) => (
                      <TableRow key={course?._id}>
                        <TableCell className=" font-bold">
                          {course?.title}
                        </TableCell>
                        <TableCell>{course?.students?.length}</TableCell>
                        <TableCell>
                          ${course?.pricing * course?.students?.length}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit
                              onClick={() => {
                                navigate(
                                  `/instructor/edit-course/${course?._id}`
                                );
                              }}
                              className="h-6 w-6"
                            />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Delete className="h-6 w-6" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InstructorCourses;
