import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import Cookies from "universal-cookie";

import {
  secondaryButtonClasses,
  buttonTextClasses,
} from "../data/Classes";

const cookies = new Cookies();

const WorkingDayModal = ({ modalShow, setModalShow, checkingIn }) => {

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
              <Dialog.Title className="text-2xl font-semibold mb-3 capitalize">
                Check in
              </Dialog.Title>
              <Dialog.Description className="mb-3">
                Do you work today?
              </Dialog.Description>

              <button
                className={`w-full mt-3 ${secondaryButtonClasses}`}
                onClick={() => {
                  setModalShow(false);
                  checkingIn = true;
                  console.log(checkingIn);
                }}
              >
                <p className={buttonTextClasses}>Yes</p>
              </button>
              <button
                className={`w-full mt-3 ${secondaryButtonClasses}`}
                onClick={() => {
                  setModalShow(false);
                  checkingIn = false;
                  console.log(checkingIn);
                }}
              >
                <p className={buttonTextClasses}>No</p>
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WorkingDayModal;
