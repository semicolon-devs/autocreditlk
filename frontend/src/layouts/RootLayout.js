import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/SidebarComponent";

const RootLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div>
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
