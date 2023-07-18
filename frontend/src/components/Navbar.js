import React from "react";
import { MenuIcon, LogoutIcon } from "./Icon";

const Navbar = ({ setCollapsed, collapsed }) => {
  return (
    <nav className=" w-full flex items-center justify-center sticky top-5 z-10 mb-5">
      <div className="bg-white p-3 rounded-lg drop-shadow-lg flex items-center justify-between w-full">
        <button className="border-none outline-none" onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon className="text-2xl"/>
        </button>
        <h1 className="font-bold uppercase text-dark text-2xl text-center">
          auto credit lk
        </h1>
        {/* <h2 className="font-semibold uppercase text-purple-50 text-lg">
          debtor management system
        </h2> */}
        <div className="">
          <button className="">
            <LogoutIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
