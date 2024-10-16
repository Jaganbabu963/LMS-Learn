import InstructorCourses from "@/components/instructorView/InstructorCourses";
import InstructorDashboard from "@/components/instructorView/InstructorDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/Auth-context";
import { InstructorContext } from "@/context/InstructorContext";
import { fetchCourseListService } from "@/services/index.js";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";

const Instructor = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);
  const { instrctorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  useEffect(() => {
    const fetchAllCourses = async () => {
      const response = await fetchCourseListService();
      if (response?.success) {
        setInstructorCoursesList(response?.data);
      }
    };
    fetchAllCourses();
  }, [setInstructorCoursesList]);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listofCourses={instrctorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listofCourses={instrctorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Log out",
      value: "log-out",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }
  // console.log(instrctorCoursesList);

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                onClick={
                  menuItem.value === "log-out"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
                className="w-full justify-start mb-2"
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                key={menuItem.value}
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent value={menuItem.value} key={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};
export default Instructor;
