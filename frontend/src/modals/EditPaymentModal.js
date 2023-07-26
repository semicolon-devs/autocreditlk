import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { TextInput } from "../components/FormikElements";
import {
  primaryButtonClasses,
  secondaryButtonClasses,
  buttonTextClasses,
} from "../data/Classes";

const EditPaymentModal = ({ modalShow, setModalShow, paymentEntry }) => {
  const [message, setMessage] = useState(null);

  const editPaymentButtonClick = () => {
    console.log("edit payment");
  };

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
                Edit Payment
              </Dialog.Title>
              <Dialog.Description>
                Edit payment ID :{" "}
                <span className="font-semibold italic ">
                  {paymentEntry.paymentId}
                </span>
              </Dialog.Description>

              <Formik
                initialValues={{
                  newAmount: "",
                }}
                validationSchema={Yup.object({
                  newAmount: Yup.number()
                    .typeError("Amount must be a number")
                    .required("Amount is required")
                    .positive("Amount must be a positive number")
                    .integer("Amount must be an integer"),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  // signIn(values.email, values.password);
                  setSubmitting(false);
                }}
              >
                <Form className="flex flex-col w-full mt-3">
                  <TextInput
                    name="newAmount"
                    type="number"
                    placeholder={paymentEntry.amount}
                  />

                  {message && (
                    <div className="">
                      <p className="">{message}</p>
                    </div>
                  )}

                  <div className="flex">
                    <button
                      className={primaryButtonClasses}
                      onClick={editPaymentButtonClick}
                    >
                      <p className={buttonTextClasses}>edit payment</p>
                    </button>
                    <button
                      className={`ms-3 ${secondaryButtonClasses}`}
                      onClick={() => setModalShow(false)}
                    >
                      <p className={buttonTextClasses}>cancel</p>
                    </button>
                  </div>
                </Form>
              </Formik>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditPaymentModal;
