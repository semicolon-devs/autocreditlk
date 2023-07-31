import React, { useRef } from "react";
import { MenuIcon, AccountIcon } from "../Icons/Icon";

const Navbar = ({ setCollapsed, collapsed, setToggled, toggled }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const windowWidth = useRef(window.innerWidth);

  const handleSidebar = () => {
    windowWidth.current > 768 ? setCollapsed(!collapsed) : setToggled(!toggled);
  };

  return (
    <nav className="w-full h-[56px] flex items-center justify-between gap-5 mb-5 sticky top-5 z-10">
      <div className="bg-white hover:bg-yellow rounded-lg drop-shadow-lg cursor-pointer">
        <button
          className="h-full border-none outline-none p-3 z-10"
          onClick={handleSidebar}
        >
          <MenuIcon />
        </button>
      </div>
      <div className="bg-white h-full rounded-lg drop-shadow-lg p-3 flex-grow flex items-center justify-center">
        <h1 className="text-maroon font-bold uppercase text-dark text-xl sm:text-2xl text-center">
          auto credit lk
        </h1>
        {/* <h2 className="font-semibold uppercase text-purple-50 text-lg">
          debtor management system
        </h2> */}
      </div>
      <div className="bg-white rounded-lg p-3 drop-shadow-lg flex items-center justify-center z-20">
        <AccountIcon />
        <p className="capitalize leading-8 font-semibold ms-3 hidden sm:block">
          {userData ? userData.name : "Guest User"}
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
