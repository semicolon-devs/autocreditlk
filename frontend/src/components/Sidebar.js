import React from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "../Icons/Icon";
import { LogoutIcon } from "../Icons/Icon";
import { sidebarItems } from "../data/Data";

import Cookies from "universal-cookie";

const cookies = new Cookies();

const Sidebar = ({ collapsed, toggled }) => {
  const logout = () => {
    cookies.remove("autoCreditCookie", { path: "/" });
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const userRole = JSON.parse(localStorage.getItem("userRole"));

  const renderIconComponent = (icon) => {
    const IconComponent = Icons[icon];
    if (IconComponent) {
      return <IconComponent />;
    }
    return null;
  };

  return (
    <div
      className={`bg-white h-full rounded-lg me-5 drop-shadow-lg  flex flex-col justify-between overflow-hidden ${
        collapsed ? "w-max" : "w-60"
      } ${toggled ? "hidden" : "block"} transition-transform duration-1000`}
    >
      <div className="">
        {sidebarItems &&
          sidebarItems.map((item) => (
            <NavLink to={item.path} className="w-full">
              <button
                key={item.id}
                className={`p-3 w-full flex items-center hover:bg-yellow cursor-pointer overflow-hidden aria-[current=page]:bg-yellow disabled:opacity-50 disabled:cursor-default disabled:hover:bg-transparent`}
                disabled={userRole == "collector" && !item.accessAll && true}
              >
                {renderIconComponent(item.icon)}
                <p
                  className={`ms-3 uppercase font-semibold text-md ${
                    collapsed ? "hidden" : "block"
                  }`}
                >
                  {item.name}
                </p>
              </button>
            </NavLink>
          ))}
      </div>
      <div
        className="p-3 flex items-center hover:bg-yellow cursor-pointer overflow-hidden"
        onClick={logout}
      >
        <LogoutIcon className="text-lg" />
        <p
          className={`ms-3 uppercase font-semibold text-md ${
            collapsed ? "hidden" : "block"
          }`}
        >
          log out
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
