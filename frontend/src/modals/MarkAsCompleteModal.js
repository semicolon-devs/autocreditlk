import React from "react";

import AlertModal from "./AlertModal";

const MarkAsCompleteModal = ({ modalShow, setModalShow, user }) => {
  const markAsComplete = () => {
    // axio to loan payment complete
    console.log("loan payment complete");
  };

  const completeButtonClick = () => {
    markAsComplete();
    setModalShow(false);
  };
  return (
    <AlertModal
      modalShow={modalShow}
      setModalShow={setModalShow}
      message={`Are you sure you want to mark ${user.name}'s loan payment as complete ?`}
      primaryButtonText="yes"
      primaryButtonClick={completeButtonClick}
    />
  );
};

export default MarkAsCompleteModal;
