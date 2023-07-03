import { Modal } from "react-bootstrap";
import React from "react";

const AddPaymentModal = (addPaymentModalShow, setAddPaymentModalShow) => {
  return (
    <Modal
      size="sm"
      show={addPaymentModalShow}
      onHide={setAddPaymentModalShow(false)}
      centered
    >
      <Modal.Body>
        <p className="text-center font-bold text-2xl">add payment</p>
        <p className="capitalize">saman kumara</p>
      </Modal.Body>
    </Modal>
  );
};

export default AddPaymentModal;
