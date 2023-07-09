import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/SidebarComponent";

const RootLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-screen h-screen ">
        <Navbar />
        <div className="bg-purple-200 p-5 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
