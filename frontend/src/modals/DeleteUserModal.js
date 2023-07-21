import React from "react";

import AlertModal from "./AlertModal";

const DeleteUserModal = ({ modalShow, setModalShow, user }) => {
  const deleteUser = () => {
    // axio to delete user
    console.log("delete user");
  };

  const removeButtonClick = () => {
    deleteUser();
    setModalShow(false);
  };

  return (
    <AlertModal
      modalShow={modalShow}
      setModalShow={setModalShow}
      message={`Are you sure you want to remove ${user.name} from the system ?`}
      primaryButtonText="remove"
      primaryButtonClick={removeButtonClick}
    />
  );
};

export default DeleteUserModal;
