import React from "react";

import AlertModal from "./AlertModal";

const DeletePendingUserModal = ({ modalShow, setModalShow, user }) => {
  const deletePendingUser = () => {
    // axio to delete pending user
    console.log("delete pending user");
  };

  const removeButtonClick = () => {
    deletePendingUser();
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

export default DeletePendingUserModal;
