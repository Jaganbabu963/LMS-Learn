import FormControls from "@/components/common-form/FormControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstructorContext } from "@/context/InstructorContext";
import { courseLandingPageFormControls } from "../../../../config/index.js";
import { useContext } from "react";

const CourseLanding = () => {
  const { courseLandingPageFormdata, setCourseLandingPageFormdata } =
    useContext(InstructorContext);
  const courseFormControls = courseLandingPageFormControls;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>
      </CardHeader>
      <CardContent>
        <FormControls
          formControls={courseFormControls}
          formData={courseLandingPageFormdata}
          setFormData={setCourseLandingPageFormdata}
        />
      </CardContent>
    </Card>
  );
};

export default CourseLanding;
