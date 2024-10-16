/* eslint-disable no-unsafe-optional-chaining */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { InstructorContext } from "@/context/InstructorContext";
import { courseCurriculumInitialFormData } from "../../../../config/index.js";
import { useContext, useRef } from "react";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services/index.js";
import MediaProgressPercentage from "@/components/MediaProgressPercentage.jsx";
import VideoPlayer from "@/components/VideoPlayer.jsx";
import { Upload } from "lucide-react";

const CourseCurriculam = () => {
  const {
    courseCurriculamFormData,
    setCourseCurriculamFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const handleNewLecture = () => {
    setCourseCurriculamFormData([
      ...courseCurriculamFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  };

  const handleCourseTitleChange = (event, currentIndex) => {
    let cpyCourseCurriculamFormData = [...courseCurriculamFormData];
    cpyCourseCurriculamFormData[currentIndex] = {
      ...courseCurriculamFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculamFormData(cpyCourseCurriculamFormData);
  };
  const handleFreePreview = (value, currentIndex) => {
    let cpyCourseCurriculamFormData = [...courseCurriculamFormData];
    cpyCourseCurriculamFormData[currentIndex] = {
      ...courseCurriculamFormData[currentIndex],
      freePreview: value,
    };
    setCourseCurriculamFormData(cpyCourseCurriculamFormData);
  };

  const bulkUploadInputRef = useRef(null);
  const handleVideoLecture = async (event, currentIndex) => {
    // console.log(event.target.files[0]);
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          // console.log(response);
          let cpyCourseCurriculamFormData = [...courseCurriculamFormData];
          cpyCourseCurriculamFormData[currentIndex] = {
            ...courseCurriculamFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculamFormData(cpyCourseCurriculamFormData);
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  // console.log(courseCurriculamFormData);
  const isCourseCurriculamFormDataValid = () => {
    return courseCurriculamFormData.every(
      (item) =>
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
    );
  };

  const handleReplaceVideo = async (currentIndex) => {
    let cpyCourseCurriculamFormData = [...courseCurriculamFormData];
    const deleteId = cpyCourseCurriculamFormData[currentIndex]?.public_id;

    const deleteResponse = await mediaDeleteService(deleteId);

    if (deleteResponse.success) {
      let cpyCourseCurriculamFormData = [...courseCurriculamFormData];
      cpyCourseCurriculamFormData[currentIndex] = {
        ...courseCurriculamFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };
      setCourseCurriculamFormData(cpyCourseCurriculamFormData);
    }
  };

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  const handleMediaBulkUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    const bulkFormData = new FormData();

    selectedFiles.map((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      if (response.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculamFormData)
            ? []
            : [...courseCurriculamFormData];
        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormdata.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculamFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenBulkUploadDialog = () => {
    bulkUploadInputRef.current?.click();
  };

  const handleDeleteVideo = async (currentIndex) => {
    let cpyCourseCurriculamFormData = [...courseCurriculamFormData];
    const deleteId = cpyCourseCurriculamFormData[currentIndex]?.public_id;

    const deleteResponse = await mediaDeleteService(deleteId);

    if (deleteResponse?.success) {
      cpyCourseCurriculamFormData = cpyCourseCurriculamFormData.filter(
        (_, index) => index != currentIndex
      );
      setCourseCurriculamFormData(cpyCourseCurriculamFormData);
    }
  };
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Create Course Curriculam</CardTitle>
          <div>
            <Input
              type="file"
              ref={bulkUploadInputRef}
              accept="video/*"
              multiple
              className="hidden"
              id="bulk-media-upload"
              onChange={handleMediaBulkUpload}
            />
            <Button
              as="label"
              htmlFor="bulk-media-upload"
              variant="outline"
              className="cursor-pointer"
              onClick={handleOpenBulkUploadDialog}
            >
              <Upload className="w-4 h-5 mr-2" />
              Bulk upload
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Button
              disabled={
                !isCourseCurriculamFormDataValid() || mediaUploadProgress
              }
              onClick={handleNewLecture}
            >
              Add Course
            </Button>
            {mediaUploadProgress ? (
              <MediaProgressPercentage
                isMediaUploading={mediaUploadProgress}
                progress={mediaUploadProgressPercentage}
              />
            ) : null}
            <div className="mt-4 space-y-4">
              {courseCurriculamFormData.map((courseItem, index) => (
                <div key={index} className="p-5 border rounded-md">
                  <div className="flex gap-5 item-center">
                    <h3 className="font-semibold">Lecture {index + 1}</h3>
                    <Input
                      name={`title ${index + 1}`}
                      placeholder="Enter the name of the Course"
                      className="max-w-96"
                      onChange={(event) =>
                        handleCourseTitleChange(event, index)
                      }
                      value={courseCurriculamFormData[index]?.title}
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        onCheckedChange={(value) =>
                          handleFreePreview(value, index)
                        }
                        checked={courseCurriculamFormData[index]?.freePreview}
                        id={`free-Preview ${index + 1}`}
                      />
                      <Label htmlFor={`free-Preview ${index + 1}`}>
                        Free Preview
                      </Label>
                    </div>
                  </div>
                  <div className="mt-4">
                    {courseCurriculamFormData[index]?.videoUrl ? (
                      <div className="flex gap-3">
                        <VideoPlayer
                          url={courseCurriculamFormData[index]?.videoUrl}
                          width="450px"
                          height="200px"
                        />
                        <Button
                          onClick={() => {
                            handleReplaceVideo(index);
                          }}
                        >
                          Replace Video
                        </Button>
                        <Button
                          onClick={() => {
                            handleDeleteVideo(index);
                          }}
                          className="bg-red-500"
                        >
                          Delete Lecture
                        </Button>
                      </div>
                    ) : (
                      <Input
                        type="file"
                        accept="video/mp4, video/x-m4v, video/*"
                        className="mb-1"
                        onChange={(event) => {
                          handleVideoLecture(event, index);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CourseCurriculam;
