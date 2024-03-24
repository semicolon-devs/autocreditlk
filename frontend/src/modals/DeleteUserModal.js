import React from "react";
import axios from "axios";

import DeleteAlertModal from "./DeleteAlertModal";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const DeleteUserModal = ({
  modalShow,
  setModalShow,
  user,
  userList,
  setUserList,
}) => {
  const token = cookies.get("autoCreditCookie");

  const deleteUser = () => {
    const axiosConfig = {
      method: "DELETE",
      url: `${BASE_URL}collector/delete/${user._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(axiosConfig)
      .then((res) => {
        // alert(result.data.message);
        console.log(res);
        const updatedUsers = userList.filter(
          (listUser) => listUser._id !== user._id
        );
        setUserList(updatedUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeButtonClick = () => {
    deleteUser();
    setModalShow(false);
  };

  return (
    <DeleteAlertModal
      modalShow={modalShow}
      setModalShow={setModalShow}
      primaryButtonText="remove"
      primaryButtonClick={removeButtonClick}
    />
  );
};

export default DeleteUserModal;
