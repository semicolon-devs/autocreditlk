import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import {
  primaryButtonClasses,
  secondaryButtonClasses,
  buttonTextClasses,
} from "../data/Classes";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const DeletePaymentModal = ({ modalShow, setModalShow, paymentEntry }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = cookies.get("autoCreditCookie");

  const deletePayment = () => {
    setLoading(true);
    const axiosConfig = {
      method: "DELETE",
      url: `${BASE_URL}installment/${paymentEntry._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
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
                Delete Payment
              </Dialog.Title>
              <Dialog.Description className="mb-3">
                Are you sure you want to delete the payment of{" "}
                <span className="font-semibold italic ">
                  {paymentEntry.amount &&
                    CurrencyFormatter(paymentEntry.amount)}{" "}
                  LKR
                </span>{" "}
                made on{" "}
                <span className="font-semibold italic ">
                  {new Date(paymentEntry.paidDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    timeZone: "Asia/Colombo",
                  })}{" "}
                  {new Date(paymentEntry.paidDate).toLocaleTimeString("en-US", {
                    timeZone: "Asia/Colombo",
                  })}
                </span>{" "}
              </Dialog.Description>
              <div className="flex">
                <button
                  onClick={deletePayment}
                  className={primaryButtonClasses}
                >
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
                    <p className={buttonTextClasses}>delete</p>
                  )}
                </button>
                <button
                  className={`ms-3 ${secondaryButtonClasses}`}
                  onClick={() => setModalShow(false)}
                >
                  <p className={buttonTextClasses}>cancel</p>
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeletePaymentModal;
