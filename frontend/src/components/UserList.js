import React, { useState } from "react";

import SectionSubtitle from "../components/SectionSubtitle";

import { userArr } from "../data/SampleData";
import { CloseIcon } from "../Icons/Icon";
import DeleteUserModal from "../modals/DeleteUserModal";

const UserList = () => {
  const [displayUser, setDisplayUser] = useState(null);
  const [DeleteUserModalShow, setDeleteUserModalShow] = useState(false);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const axiosConfig = {
  //       method: "get",
  //       url: `${process.env.REACT_APP_BACKEND}/auth/users`,
  //       headers: {
  //         Authorization: `Bearer ${token.token}`,
  //       },
  //     };

  //     axios(axiosConfig)
  //       .then((response) => {
  //         setUsers(response.data.users);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   fetchUsers();
  // }, []);

  const handleDeleteUserClick = (user) => {
    setDisplayUser(user);
    setDeleteUserModalShow(true);
  };

  return (
    <div>
      <SectionSubtitle title="users" />
      {userArr &&
        userArr.map((user) => (
          <div
            className="bg-yellow rounded-lg p-3 mb-3 flex justify-between items-center"
            key={user.id}
          >
            <div className="">
              <p className="text-maroon capitalize text-lg font-semibold leading-none">
                {user.name}
              </p>
              <p className="text-maroon ">{user.email}</p>
              <p className="text-maroon leading-none">{user.mobileNo}</p>
            </div>
            <div className="">
              <button
                className="border-none outline-none"
                onClick={() => handleDeleteUserClick(user)}
              >
                <CloseIcon className="text-maroon" />
              </button>
            </div>
          </div>
        ))}
      {displayUser && (
        <DeleteUserModal
          modalShow={DeleteUserModalShow}
          setModalShow={setDeleteUserModalShow}
          user={displayUser}
        />
      )}
    </div>
  );
};

export default UserList;
