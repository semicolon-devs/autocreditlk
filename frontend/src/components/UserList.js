import React, { useState, useEffect } from "react";
import axios from "axios";

import SectionSubtitle from "../components/SectionSubtitle";

import { CloseIcon } from "../Icons/Icon";
import DeleteUserModal from "../modals/DeleteUserModal";
import { EditIcon, DeleteIcon, DateIcon } from "../Icons/Icon";
import { ThreeDots } from "react-loader-spinner";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";
import EditAccountModal from "../modals/EditAccountModal";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import { secondaryButtonClasses } from "../data/Classes";
import Grid from "@mui/material/Grid";
import CustomDateModal from "../modals/CustomDateModal";

const cookies = new Cookies();

const UserList = () => {
  const [users, setUsers] = useState([]);
  // const [displayUser, setDisplayUser] = useState(null);
  const [editUserModalShow, setEditUserModalShow] = useState(false);
  const [displayEditUser, setDisplayEditUser] = useState(null);
  const [deleteUserModalShow, setDeleteUserModalShow] = useState(false);
  const [displayDeleteUser, setDisplayDeleteUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editPasswordModalShow, setEditPasswordModalShow] = useState(false);
  const [displayEditPasswordUser, setDisplayEditPasswordUser] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const token = cookies.get("autoCreditCookie");

  useEffect(() => {
    const fetchCollectors = async () => {
      setLoading(true);
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
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchCollectors();
  }, []);

  const editUserButtonClick = (user) => {
    setDisplayEditUser(user);
    setEditUserModalShow(true);
  };

  const deleteUserButtonClick = (user) => {
    setDeleteUserModalShow(true);
    setDisplayDeleteUser(user);
  };

  const changePasswordButtonClick = (user) => {
    setEditPasswordModalShow(true);
    setDisplayEditPasswordUser(user);
  };

  const markHolidaysButtonClick = (user) => {
    setShowDatePicker(true);
    setCurrentUser(user);
  };

  const isAdmin = () => {
    if (JSON.parse(localStorage.getItem("userRole")) === "admin") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <SectionSubtitle title="users" />
      <div className="flex flex-col items-center justify-center">
        {!loading ? (
          users &&
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
              {isAdmin() ? (
                <div className="flex items-end justify-end gap-2 mt-2 ml-5">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <button
                        className="bg-green flex rounded-lg px-3 py-1"
                        onClick={() => changePasswordButtonClick(user)}
                      >
                        <EditIcon className="text-white" fontSize="small" />
                        <p className="text-white uppercase font-semibold ms-2 text-sm">
                          change password
                        </p>
                      </button>
                    </Grid>
                    <Grid item xs={6}>
                      <button
                        className="bg-blue flex rounded-lg px-3 py-1"
                        onClick={() => markHolidaysButtonClick(user)}
                      >
                        <DateIcon className="text-white" fontSize="small" />
                        <p className="text-white uppercase font-semibold ms-2 text-sm">
                          Mark Holidays
                        </p>
                      </button>
                    </Grid>
                    <Grid item xs={6}>
                      <button
                        className="bg-maroon flex rounded-lg px-3 py-1"
                        onClick={() => editUserButtonClick(user)}
                      >
                        <EditIcon className="text-white" fontSize="small" />
                        <p className="text-white uppercase font-semibold ms-2 text-sm">
                          edit
                        </p>
                      </button>
                    </Grid>
                    <Grid item xs={6}>
                      <button
                        className="bg-orange flex rounded-lg px-3 py-1"
                        onClick={() => deleteUserButtonClick(user)}
                      >
                        <DeleteIcon className="text-white" fontSize="small" />
                        <p className="text-white uppercase font-semibold ms-2 text-sm">
                          delete
                        </p>
                      </button>
                    </Grid>
                  </Grid>

                  {/* <button
                    className={`${secondaryButtonClasses}`}
                    // className="bg-green flex rounded-lg px-3 py-1"
                    onClick={() => changePasswordButtonClick(user)}
                  >
                    <EditIcon className="text-white" fontSize="small" />
                    <p className="text-white uppercase font-semibold ms-2 text-sm">
                      change password
                    </p>
                  </button> */}
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <ThreeDots
            height="40"
            width="40"
            radius="9"
            color="#808080"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        )}
      </div>
      {editUserModalShow && (
        <EditAccountModal
          modalShow={editUserModalShow}
          setModalShow={setEditUserModalShow}
          user={displayEditUser}
        />
      )}
      {deleteUserModalShow && (
        <DeleteUserModal
          modalShow={deleteUserModalShow}
          setModalShow={setDeleteUserModalShow}
          user={displayDeleteUser}
          userList={users}
          setUserList={setUsers}
        />
      )}
      {editPasswordModalShow && (
        <ChangePasswordModal
          modalShow={editPasswordModalShow}
          setModalShow={setEditPasswordModalShow}
          user={displayEditPasswordUser}
        />
      )}
      {showDatePicker && (
        <CustomDateModal
          modalShow={showDatePicker}
          setModalShow={setShowDatePicker}
          user={currentUser}
        />
      )}
    </div>
  );
};

export default UserList;
