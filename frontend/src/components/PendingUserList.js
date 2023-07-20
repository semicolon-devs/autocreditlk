import React, { useState } from "react";

import SectionSubtitle from "../components/SectionSubtitle";

import { pendingUserArr } from "../data/SampleData";
import { CloseIcon } from "../Icon/Icon";
import DeletePendingUserModal from "../modals/DeletePendingUserModal";

const PendingUserList = () => {
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
      {pendingUserArr &&
        pendingUserArr.map((user) => (
          <div
            className="bg-fadedGreen rounded-lg p-3 mb-3 flex justify-between items-center"
            key={user.id}
          >
            <div className="">
              <p className="capitalize text-lg font-semibold leading-none">
                {user.name}
              </p>
              <p className="">{user.email}</p>
              <p className="leading-none">{user.mobileNo}</p>
            </div>
            <div className="">
              <button
                className=""
                onClick={() => handleDeletePendingUserClick(user)}
              >
                <CloseIcon className="text-white" />
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
