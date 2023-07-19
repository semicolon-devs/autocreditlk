import React from "react";

import SectionTitle from "../components/SectionTitle";
import AddUser from "../components/AddUser";
import UserList from "../components/UserList";
import PendingUserList from "../components/PendingUserList";

const ManageUsers = () => {
  return (
    <div className="w-full">
      <SectionTitle title="manage users" />
      <div className="bg-white w-full rounded-lg drop-shadow-lg p-3 mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AddUser />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <UserList />
        </div>
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <PendingUserList />
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
