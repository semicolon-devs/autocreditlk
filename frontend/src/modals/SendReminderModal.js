import React from "react";

import AlertModal from "./AlertModal";

const SendReminderModal = ({ modalShow, setModalShow, customer }) => {
  const sendReminder = () => {
    // axio to send reminder
    console.log("send reminder");
  };

  const sendReminderButtonClick = () => {
    sendReminder();
    setModalShow(false);
  };

  return (
    <AlertModal
      modalShow={modalShow}
      setModalShow={setModalShow}
      message={`Are you sure you want to send ${customer.name} an arrears reminder ?`}
      primaryButtonText="send reminder"
      primaryButtonClick={sendReminderButtonClick}
    />
  );
};

export default SendReminderModal;
