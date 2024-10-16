import axiosInstance from "@/api/axiosInsatance.js";

export async function registerService(formData) {
  // console.log(formData);

  try {
    const { data } = await axiosInstance.post("/auth/register", {
      ...formData,
      role: "user",
    });
    return data; // Make sure to return the response data
  } catch (error) {
    console.error("Registration error:", error); // Log the error
    throw error; // Optionally rethrow the error to handle it where the service is called
  }
}

export async function loginService(formData) {
  // console.log(formData);

  try {
    const { data } = await axiosInstance.post("/auth/login", formData);
    return data; // Make sure to return the response data
  } catch (error) {
    console.error("LoginIn Unsuccessful:", error); // Log the error
    throw error; // Optionally rethrow the error to handle it where the service is called
  }
}

export async function checkAuthService() {
  // console.log(formData);

  const { data } = await axiosInstance.get("/auth/checkAuth");
  return data; // Make sure to return the response data
}

export async function mediaUploadService(formData, onProgressCallback) {
  // console.log(formData);

  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentageCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentageCompleted);
    },
  });
  return data; // Make sure to return the response data
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchCourseListService() {
  const { data } = await axiosInstance.get("/instructor/course/get");

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post("/instructor/course/add", formData);

  return data;
}

export async function fetchCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseDetailService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  // console.log(formData);

  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentageCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentageCompleted);
    },
  });
  return data; // Make sure to return the response data
}

export async function fetchStudentCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get/?${query}`);

  return data;
}

export async function fetchStudentCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}/`
  );

  return data;
}

export async function createOrderService(formData) {
  const { data } = await axiosInstance.post("/student/order/create", formData);

  return data;
}

export async function captureOrderService(paymentId, payerId, orderId) {
  const { data } = await axiosInstance.post("/student/order/capture", {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function getStudentbroughtCoursesService(id) {
  const { data } = await axiosInstance.get(`/student/courses-bought/get/${id}`);
  return data; // Make sure to return the response data
}

export async function checkCoursePurchaseInfo(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    { userId, courseId, lectureId }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-course`,
    { userId, courseId }
  );

  return data;
}
