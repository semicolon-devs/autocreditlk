import { useState, Fragment, useEffect } from "react";
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

const EditPaymentModal = ({ modalShow, setModalShow, paymentEntry }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = cookies.get("autoCreditCookie");

  useEffect(() => {
    setMessage(null);
  }, [paymentEntry]);

  const editPayment = (amount) => {
    setLoading(true);
    const axiosConfig = {
      method: "PUT",
      url: `${BASE_URL}installment/${paymentEntry._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        amount: amount,
      },
    };
    axios(axiosConfig)
      .then((response) => {
        console.log(response);
        // setModalShow(false);
        window.location.reload(false);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        // console.log(err);
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
                Edit Installment
              </Dialog.Title>
              <Dialog.Description>
                Edit installment ID :{" "}
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
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  editPayment(values.newAmount);
                  setSubmitting(false);
                  resetForm({});
                }}
              >
                <Form className="flex flex-col w-full mt-3">
                  <TextInput
                    name="newAmount"
                    type="number"
                    placeholder={paymentEntry.amount}
                  />

                  {message && (
                    <div className="border border-red p-3 rounded-lg mb-3">
                      <p className="text-red">{message}</p>
                    </div>
                  )}

                  <div className="flex">
                    <button type="submit" className={primaryButtonClasses}>
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
                        <p className={buttonTextClasses}>edit installment</p>
                      )}
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
