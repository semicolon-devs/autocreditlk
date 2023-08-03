import React, { useRef, useEffect } from "react";
import axios from "axios";
import { MenuIcon, AccountIcon } from "../Icons/Icon";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const Navbar = ({ setCollapsed, collapsed, setToggled, toggled }) => {
  const token = cookies.get("autoCreditCookie");

  const getUserData = async () => {
    const config = {
      method: "get",
      url: `${BASE_URL}auth/userData`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then((res) => {
        localStorage.setItem("userData", JSON.stringify(res.data.userData));
      })
      .catch((res) => {
        console.log(res);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

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
          auto credit
        </h1>
        {/* <h2 className="font-semibold uppercase text-purple-50 text-lg">
          debtor management system
        </h2> */}
      </div>
      <div className="bg-white h-full rounded-lg p-3 drop-shadow-lg flex items-center justify-center z-20">
        <AccountIcon />
        <p className="capitalize leading-8 font-semibold ms-3 hidden sm:block">
          {userData ? userData.name.split(" ")[0] : "Guest User"}
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
