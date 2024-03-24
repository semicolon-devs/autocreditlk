import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import {
  buttonTextClasses,
  secondaryButtonClasses,
  primaryButtonClasses,
} from "../data/Classes";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInputWithLabel as TextInput } from "../components/FormikElements";

const DeleteAlertModal = ({ modalShow, setModalShow, primaryButtonClick }) => {
  const [confirmValue, setConfirmValue] = useState("");

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
                Type "delete" to confirm
              </Dialog.Description>

              <Formik
                initialValues={{
                  confirmDelete: "",
                }}
                validationSchema={Yup.object({
                  confirmDelete: Yup.string()
                    .required("confirm delete")
                    .test(
                      "confirm-delete",
                      "Type 'delete' to confirm",
                      (value) => value === "delete"
                    ),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(false);
                  resetForm({});
                  primaryButtonClick(); // Call the function to remove here
                }}
              >
                <Form>
                  <TextInput
                    name="confirmDelete"
                    type="text"
                    placeholder="delete"
                    value={confirmValue} // Pass the value prop
                    onChange={(e) => setConfirmValue(e.target.value)}
                  />
                </Form>
              </Formik>
              <button
                className={primaryButtonClasses}
                disabled={confirmValue !== "delete"}
                onClick={() => {
                  // Ensure the value is 'delete' before proceeding
                  if (confirmValue === "delete") {
                    primaryButtonClick();
                  }
                }}
              >
                <p className={buttonTextClasses}>Remove</p>
              </button>
              <button
                className={`ms-3 ${secondaryButtonClasses}`}
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

export default DeleteAlertModal;
