import React, { useRef } from "react";
import { MenuIcon, AccountIcon } from "../Icon/Icon";

const Navbar = ({ setCollapsed, collapsed, setToggled, toggled }) => {
  const windowWidth = useRef(window.innerWidth);

  const handleSidebar = () => {
    windowWidth.current > 768 ? setCollapsed(!collapsed) : setToggled(!toggled);
  };

  return (
    <nav className="w-full flex items-center justify-center sticky top-5 z-10 mb-5">
      <div className="flex items-center justify-between w-full">
        <div className="bg-white hover:bg-orange rounded-lg drop-shadow-lg cursor-pointer me-5">
          <button
            className="border-none outline-none p-3 z-10"
            // onClick={() => setCollapsed(!collapsed)}
            onClick={handleSidebar}
          >
            <MenuIcon className="text-2xl" />
          </button>
        </div>
        <div className="bg-white rounded-lg drop-shadow-lg p-3 flex-grow flex items-center justify-center me-5">
          <h1 className="font-bold uppercase text-dark text-xl sm:text-2xl text-center">
            auto credit lk
          </h1>
          {/* <h2 className="font-semibold uppercase text-purple-50 text-lg">
          debtor management system
        </h2> */}
        </div>
        <div className="bg-white rounded-lg p-3 drop-shadow-lg flex items-center justify-center z-20">
          <AccountIcon />
          <p className="capitalize leading-8 font-semibold ms-3 hidden sm:block">
            will smith
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
