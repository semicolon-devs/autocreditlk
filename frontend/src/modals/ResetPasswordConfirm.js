import React from "react";

import AlertModal from "./AlertModal";

const ResetPasswordConfirm = ({ modalShow, setModalShow }) => {
  const confirmResetPassword = () => {
    // axio to delete user
    console.log("reset password");
  };

  const confirmButtonClick = () => {
    confirmResetPassword();
    setModalShow(false);
  };

  return (
    <AlertModal
      modalShow={modalShow}
      setModalShow={setModalShow}
      message={`Are you sure you want to reset your password ?`}
      primaryButtonText="confirm"
      primaryButtonClick={confirmResetPassword}
    />
  );
};

export default ResetPasswordConfirm;
