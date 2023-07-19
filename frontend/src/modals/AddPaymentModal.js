import { useState } from "react";
import { Dialog } from "@headlessui/react";

import SectionSubtitle from "../components/SectionSubtitle";

const AddPaymentModal = ({ modalShow, setModalShow }) => {
  return (
    <Dialog
      open={modalShow}
      onClose={() => setModalShow(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-3">
          <Dialog.Title>
            <SectionSubtitle title="add payment" />
          </Dialog.Title>
          <Dialog.Description>
            This will permanently deactivate your account
          </Dialog.Description>

          <p>
            Are you sure you want to deactivate your account? All of your data
            will be permanently removed. This action cannot be undone.
          </p>

          <button onClick={() => setModalShow(false)}>Deactivate</button>
          <button onClick={() => setModalShow(false)}>Cancel</button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddPaymentModal;
