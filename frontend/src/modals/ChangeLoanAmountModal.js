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

const ChangeLoanAmountModal = ({ modalShow, setModalShow, customer }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData"));

  const token = cookies.get("autoCreditCookie");

  const changeLoanAmount = (amount) => {
    setLoading(true);
    const axiosConfig = {
      method: "PUT",
      url: `${BASE_URL}customers//update-amount/${customer.customerID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        newAmount: amount,
      },
    };
    axios(axiosConfig)
      .then((response) => {
        console.log(response);
        setModalShow(false);
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
                Change Loan Amount
              </Dialog.Title>
              <Dialog.Description>
                Change loan amount of{" "}
                <span className="font-semibold italic ">{customer.name}</span>
              </Dialog.Description>

              <Formik
                initialValues={{
                  amount: customer.loanAmount,
                }}
                validationSchema={Yup.object({
                  amount: Yup.number()
                    .typeError("Amount must be a number")
                    .required("Amount is required")
                    .positive("Amount must be a positive number")
                    .integer("Amount must be an integer"),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  changeLoanAmount(values.amount);
                  setSubmitting(false);
                }}
              >
                <Form className="flex flex-col w-full mt-3">
                  <TextInput
                    name="amount"
                    type="number"
                    placeholder="Enter payment"
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
                        <p className={buttonTextClasses}>Change loan amount</p>
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

export default ChangeLoanAmountModal;
