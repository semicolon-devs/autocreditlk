import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import SectionSubtitle from "../components/SectionSubtitle";
import { ModalCancelButton } from "../components/Button";

const AlertModal = ({ modalShow, setModalShow, message, primaryBtnText }) => {
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
              <Dialog.Title>
                <SectionSubtitle title="Alert !" />
              </Dialog.Title>
              <Dialog.Description>
                <p className="mb-3">{message}</p>
              </Dialog.Description>
              <button
                className="rounded-lg px-4 py-2 bg-maroon"
                onClick={() => setModalShow(false)}
              >
                <p className="text-white capitalize font-bold">
                  {primaryBtnText}
                </p>
              </button>
              <ModalCancelButton setModalShow={setModalShow} />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AlertModal;
