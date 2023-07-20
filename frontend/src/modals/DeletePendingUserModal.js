import React from "react";

import AlertModal from "./AlertModal";

const DeletePendingUserModal = ({ modalShow, setModalShow, user }) => {
  return (
    <AlertModal
      modalShow={modalShow}
      setModalShow={setModalShow}
      message={`Are you sure you want to remove ${user.name} from the system ?`}
      primaryBtnText="remove"
    />
  );
};

export default DeletePendingUserModal;
