import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import SectionSubtitle from "../components/SectionSubtitle";

import { TextInput } from "../components/FormikElements";
import { ModalCancelButton } from "../components/Button";

const AddPaymentModal = ({ modalShow, setModalShow, customer }) => {
  const [message, setMessage] = useState(null);

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
                <SectionSubtitle title="add payment" />
              </Dialog.Title>
              <Dialog.Description>
                <p className="">Add {customer.name}'s payment</p>
              </Dialog.Description>

              <Formik
                initialValues={{
                  amount: "",
                }}
                validationSchema={Yup.object({
                  amount: Yup.number()
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
                    name="amount"
                    type="number"
                    placeholder="Enter payment"
                  />

                  {message && (
                    <div className="">
                      <p className="">{message}</p>
                    </div>
                  )}

                  <div className="flex">
                    <button
                      type="submit"
                      className="bg-maroon rounded-lg px-4 py-2"
                    >
                      <p className="text-white capitalize font-bold">
                        add payment
                      </p>
                    </button>
                    {/* <button
                      onClick={() => setModalShow(false)}
                      className="bg-darkGrey rounded-lg px-4 py-2 ms-3"
                    >
                      <p className="text-white capitalize font-bold">cancel</p>
                    </button> */}
                    <ModalCancelButton setModalShow={setModalShow} />
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

export default AddPaymentModal;
