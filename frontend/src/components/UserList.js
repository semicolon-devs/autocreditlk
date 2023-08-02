import React, { useState, useEffect } from "react";
import axios from "axios";

import SectionSubtitle from "../components/SectionSubtitle";

import { CloseIcon } from "../Icons/Icon";
import DeleteUserModal from "../modals/DeleteUserModal";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [displayUser, setDisplayUser] = useState(null);
  const [DeleteUserModalShow, setDeleteUserModalShow] = useState(false);

  const token = cookies.get("autoCreditCookie");

  useEffect(() => {
    const fetchUsers = async () => {
      const axiosConfig = {
        method: "get",
        url: `${BASE_URL}collector/collectors`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios(axiosConfig)
        .then((res) => {
          setUsers(res.data.collectors);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchUsers();
  }, []);

  const handleDeleteUserClick = (user) => {
    setDisplayUser(user);
    setDeleteUserModalShow(true);
  };

  return (
    <div>
      <SectionSubtitle title="users" />
      <div className="flex flex-col items-center justify-center">
        {users &&
          users.map((user) => (
            <div
              className="bg-yellow w-full rounded-lg p-3 mb-3 flex justify-between items-center"
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
                  className="border-none outline-none"
                  onClick={() => handleDeleteUserClick(user)}
                >
                  <CloseIcon className="text-maroon" />
                </button>
              </div>
            </div>
          ))}
      </div>
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
