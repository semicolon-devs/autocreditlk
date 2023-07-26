import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import {
  buttonTextClasses,
  modalCancelButtonClasses,
  modalPrimaryButtonClasses,
} from "../data/Classes";

const AlertModal = ({
  modalShow,
  setModalShow,
  message,
  primaryButtonText,
  primaryButtonClick,
}) => {
  return (
    <Transition show={modalShow} as={Fragment}>
      <Dialog
        open={modalShow}
        onClose={() => setModalShow(false)}
        className="relative z-50"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-3">
              <Dialog.Title className="text-2xl font-semibold mb-3">
                Alert !
              </Dialog.Title>
              <Dialog.Description className="mb-3">
                {message}
              </Dialog.Description>
              <button
                className={modalPrimaryButtonClasses}
                onClick={primaryButtonClick}
              >
                <p className={buttonTextClasses}>{primaryButtonText}</p>
              </button>
              <button
                className={`ms-3 ${modalCancelButtonClasses}`}
                onClick={() => setModalShow(false)}
              >
                <p className={buttonTextClasses}>cancel</p>
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AlertModal;
