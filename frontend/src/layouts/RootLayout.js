import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(null);
  const [toggled, setToggled] = useState(null);
  const windowWidth = useRef(window.innerWidth);

  useEffect(() => {
    const setSidebarState = () => {
      if (windowWidth.current > 768) {
        setCollapsed(false);
        setToggled(false);
      } else {
        setCollapsed(true);
        setToggled(true);
      }
    };

    setSidebarState();
  }, []);

  const screenHeight = window.innerHeight;

  const sidebarHeight = `calc(${screenHeight}px - 116px)`;

  const bodyHeight = screenHeight - 116;

  return (
    <div className="bg-light min-h-screen p-5 flex flex-col">
      <Navbar
        setCollapsed={setCollapsed}
        collapsed={collapsed}
        toggled={toggled}
        setToggled={setToggled}
      />
      <div className="flex">
        <div className="sticky top-[96px]" style={{ height: sidebarHeight }}>
          <Sidebar collapsed={collapsed} toggled={toggled} />
        </div>
        <div
          className={`overflow-y-auto rounded-lg w-full`}
          style={{ maxHeight: `${bodyHeight}px` }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
