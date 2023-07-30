import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

import SectionSubtitle from "../components/SectionSubtitle";

import { CloseIcon } from "../Icons/Icon";
import DeleteUserModal from "../modals/DeleteUserModal";

const PendingUserList = ({ pendingUsers, setPendingUsers, loading }) => {
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
      <div className="flex items-center justify-center">
        {!loading ? (
          pendingUsers &&
          pendingUsers.map((user) => (
            <div
              className="bg-pink w-full rounded-lg p-3 mb-3 flex justify-between items-center"
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
          ))
        ) : (
          <ThreeDots
            height="40"
            width="40"
            radius="9"
            color="#F2766B"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        )}
      </div>
      {displayUser && (
        <DeleteUserModal
          modalShow={DeletePendingUserModalShow}
          setModalShow={setDeletePendingUserModalShow}
          user={displayUser}
          userList={pendingUsers}
          setUserList={setPendingUsers}
        />
      )}
    </div>
  );
};

export default PendingUserList;
