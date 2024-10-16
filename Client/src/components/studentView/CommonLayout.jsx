import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const CommonLayout = () => {
  const location = useLocation();
  return (
    <div>
      {!location.pathname.includes("course-progress") ? <Header /> : <></>}

      <Outlet />
    </div>
  );
};

export default CommonLayout;
