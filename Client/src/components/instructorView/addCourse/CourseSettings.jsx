import MediaProgressPercentage from "@/components/MediaProgressPercentage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/InstructorContext";
import { mediaUploadService } from "@/services/index.js";
import { useContext } from "react";

const CourseSettings = () => {
  const {
    courseLandingPageFormdata,
    setCourseLandingPageFormdata,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const handleImageUpload = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingPageFormdata({
            ...courseLandingPageFormdata,
            image: response?.data?.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  // console.log(courseLandingPageFormdata);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Course Settings
          </CardTitle>
          {mediaUploadProgress ? (
            <MediaProgressPercentage
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            {courseLandingPageFormdata?.image ? (
              <img src={courseLandingPageFormdata?.image} />
            ) : null}
            <Input
              onChange={(event) => {
                handleImageUpload(event);
              }}
              type="file"
              accept="image/*"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CourseSettings;
