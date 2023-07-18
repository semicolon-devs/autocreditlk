import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-light min-h-screen p-5 flex flex-col">
      <Navbar setCollapsed={setCollapsed} collapsed={collapsed} />
      <div className="flex flex-grow">
        <div className="sticky top-[106px]">
          <Sidebar collapsed={collapsed} />
        </div>
          <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
