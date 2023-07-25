import React, { useState } from "react";

import SectionSubtitle from "../components/SectionSubtitle";

import { CloseIcon } from "../Icons/Icon";
import DeletePendingUserModal from "../modals/DeletePendingUserModal";

const PendingUserList = ({ pendingUsers, setPendingUsers }) => {
  const [displayUser, setDisplayUser] = useState(null);
  const [DeletePendingUserModalShow, setDeletePendingUserModalShow] =
    useState(false);

  const handleDeletePendingUserClick = (user) => {
    setDisplayUser(user);
    setDeletePendingUserModalShow(true);
  };

  return (
    <div>
      <SectionSubtitle title="pending users" />
      {pendingUsers &&
        pendingUsers.map((user) => (
          <div
            className="bg-pink rounded-lg p-3 mb-3 flex justify-between items-center"
            key={user._id}
          >
            <div className="">
              <p className="text-maroon capitalize text-lg font-semibold leading-none">
                {user.name}
              </p>
              <p className="text-maroon ">{user.email}</p>
              <p className="text-maroon leading-none">{user.phone}</p>
            </div>
            <div className="">
              <button
                className=""
                onClick={() => handleDeletePendingUserClick(user)}
              >
                <CloseIcon className="text-maroon" />
              </button>
            </div>
          </div>
        ))}
      {displayUser && (
        <DeletePendingUserModal
          modalShow={DeletePendingUserModalShow}
          setModalShow={setDeletePendingUserModalShow}
          user={displayUser}
        />
      )}
    </div>
  );
};

export default PendingUserList;
