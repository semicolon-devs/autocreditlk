import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import { TextInput } from "../components/FormikElements";
import {
  primaryButtonClasses,
  secondaryButtonClasses,
  buttonTextClasses,
} from "../data/Classes";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const AddPaymentModal = ({ modalShow, setModalShow, customer }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const today = new Date();

  const userData = JSON.parse(localStorage.getItem("userData"));

  const token = cookies.get("autoCreditCookie");

  // console.log(userData);

  const addPayment = (amount) => {
    setLoading(true);
    const axiosConfig = {
      method: "post",
      url: `${BASE_URL}installment/add-payment`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        customerID: customer.customerID,
        amount: amount,
        paidDate: today,
        collectedBy: userData.userID,
      },
    };
    axios(axiosConfig)
      .then((response) => {
        console.log(response);
        // setModalShow(false);
        window.location.reload(false);
      })
      .catch((err) => {
        // setMessage(err.data.message);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
                Add Installment
              </Dialog.Title>
              <Dialog.Description>
                Add{" "}
                <span className="font-semibold italic ">{customer.name}'s</span>{" "}
                installment
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
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  addPayment(values.amount);
                  setSubmitting(false);
                  resetForm({});
                }}
              >
                <Form className="flex flex-col w-full mt-3">
                  <TextInput
                    name="amount"
                    type="number"
                    placeholder="Enter installment amount"
                  />

                  <div className="flex">
                    <button className={primaryButtonClasses} type="submit">
                      {loading ? (
                        <ThreeDots
                          height="40"
                          width="40"
                          radius="9"
                          color="white"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClassName=""
                          visible={true}
                        />
                      ) : (
                        <p className={buttonTextClasses}>add payment</p>
                      )}
                    </button>
                    <button
                      className={`ms-3 ${secondaryButtonClasses}`}
                      onClick={() => setModalShow(false)}
                    >
                      <p className={buttonTextClasses}>cancel</p>
                    </button>
                  </div>

                  {message && (
                    <div className="border-red border rounded-lg p-3 text-center">
                      <p className="text-red">{message}</p>
                    </div>
                  )}
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
