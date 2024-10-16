/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { filterOptions, sortOptions } from "../../../config/index.js";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentContext } from "@/context/Student-context";
import {
  checkCoursePurchaseInfo,
  fetchStudentCourseListService,
} from "@/services/index.js";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { AuthContext } from "@/context/Auth-context.jsx";

const StudentCoursePage = () => {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [, setSearchParams] = useSearchParams();
  const {
    studentViewCourseList,
    setStudentViewCourseList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const fetchAllStudentViewCourses = async () => {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentCourseListService(query);
    if (response?.success) {
      setStudentViewCourseList(response?.data);
      setLoadingState(false);
    }
    // console.log(response);
  };

  const createSerchParamsHelper = (filterParams) => {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");

        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join("&");
  };

  useEffect(() => {
    const buildSearchQueryString = createSerchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildSearchQueryString));
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  const handleFilterOnChange = (getSectionId, getCurrentOption) => {
    // console.log(getCurrentOption);

    let cpyFilters = { ...filters };
    const indexofCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    // console.log(getCurrentOption.id);

    if (indexofCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
      // console.log(cpyFilters);
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );
      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    setFilters(cpyFilters);
    // console.log(indexofCurrentSection);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  };

  const handleCourseNavigate = async (getCurrentcourseId) => {
    const response = await checkCoursePurchaseInfo(
      getCurrentcourseId,
      auth?.user?._id
    );
    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentcourseId}`);
      } else {
        navigate(`/course/details/${getCurrentcourseId}`);
      }
    }
  };
  // console.log(filters);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-3">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div className=" space-y-4">
            {Object.keys(filterOptions).map((keyItem) => (
              <div key={keyItem} className=" space-y-4 ">
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      key={option.id}
                      className="flex font-medium items-center gap-3"
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() => {
                          handleFilterOnChange(keyItem, option);
                        }}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 p-5"
                >
                  <ArrowUpDownIcon className="w-4 h-4" />
                  <span className="text-[16px] font-medium">Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black font-bold">
              {studentViewCourseList?.length} Results
            </span>
          </div>
          <div className="space-y-4">
            {studentViewCourseList && studentViewCourseList?.length > 0 ? (
              studentViewCourseList.map((courseItem) => (
                <Card
                  onClick={() => {
                    handleCourseNavigate(courseItem?._id);
                  }}
                  className="cursor-pointer"
                  key={courseItem?._id}
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem?.image}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Created by{" "}
                        <span className="font-bold">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className="text-black text-[15px] mb-2">
                        {`${
                          courseItem?.curriculam?.length
                        } Lecture - ${courseItem?.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-lg">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1 className="font-extrabold text-4xl">No Courses Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentCoursePage;
