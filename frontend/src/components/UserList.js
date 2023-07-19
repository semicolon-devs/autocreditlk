import React from "react";

import SectionSubtitle from "../components/SectionSubtitle";

import { userArr } from "../data/SampleData";
import { CloseIcon } from "./Icon";

const UserList = () => {
  return (
    <div>
      <SectionSubtitle title="users" />
      {userArr &&
        userArr.map((user) => (
          <div className="bg-fadedGreen rounded-lg p-3 mb-3 flex justify-between items-center" key={user.id}>
            <div className="">
              <p className="capitalize text-lg font-semibold leading-none">
                {user.name}
              </p>
              <p className="">{user.email}</p>
              <p className="leading-none">{user.mobileNo}</p>
            </div>
            <div className="">
              <button className="">
                <CloseIcon className="text-white"/>
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default UserList;
