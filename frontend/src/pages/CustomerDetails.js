import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import ChangeCustomerDetailsModal from "../modals/ChangeCustomerDetailsModal";
import SendReminderModal from "../modals/SendReminderModal";
import AddPaymentModal from "../modals/AddPaymentModal";
import EditPaymentModal from "../modals/EditPaymentModal";

// import { customerArr, paymentsArr } from "../data/SampleData";
import { EditIcon, DeleteIcon } from "../Icons/Icon";
import {
  buttonClasses,
  buttonTextClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from "../data/Classes";
import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const CustomerDetails = () => {
  const [changeCustomerDetailsModalShow, setChangeCustomerDetailsModalShow] =
    useState(false);
  const [sendReminderModalShow, setSendReminderModalShow] = useState(false);
  const [addPaymentModalShow, setAddPaymentModalShow] = useState(false);
  const [editPaymentModalShow, setEditPaymentModalShow] = useState(false);
  const [displayEditPayment, setDisplayEditPayment] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [customerPayments, setCustomerPayments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { id } = useParams();

  const token = cookies.get("autoCreditCookie");

  // const customer = customerArr.find((item) => item.loanId === id);

  var startDate = new Date(customer && customer.startDate);
  const today = new Date();

  useEffect(() => {
    const getCustomer = () => {
      setLoading(true);
      const axiosConfig = {
        method: "get",
        url: `${BASE_URL}customers/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(axiosConfig)
        .then((response) => {
          // console.log(response);
          setCustomer(response.data.customer);
          setCustomerPayments(response.data.payments);
        })
        .catch((err) => {
          setMessage(err.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getCustomer();
  }, []);

  const editPaymentButtonClick = (payment) => {
    setDisplayEditPayment(payment);
    setEditPaymentModalShow(true);
  };

  return (
    <div className="w-full">
      <SectionTitle title="customer details" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* <div className=""> */}
        <div className="bg-white drop-shadow-lg rounded-lg p-3">
          {loading ? (
            <div className="w-full flex items-center justify-center">
              <ThreeDots
                height="40"
                width="40"
                radius="9"
                color="#F2D852"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div>
          ) : (
            customer && (
              <>
                <p className="">
                  <span className="font-semibold capitalize">name : </span>
                  {customer.name}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">loan ID : </span>#
                  {customer.customerID}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">NIC : </span>
                  {customer.NIC}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">
                    mobile no. 01 :{" "}
                  </span>
                  {customer.phone}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">
                    mobile no. 02 :{" "}
                  </span>
                  {customer.phoneTwo}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">address : </span>
                  {customer.address}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">
                    start date :{" "}
                  </span>
                  {startDate.toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    timeZone: "Asia/Colombo",
                  })}
                </p>

                <div className="flex gap-3">
                  <div className="bg-yellow p-3 rounded-lg">
                    <p className="font-semibold capitalize">loan amount</p>
                    <p className="">{customer.loanAmount}</p>
                  </div>

                  <div className="bg-yellow p-3 rounded-lg">
                    <p className="font-semibold capitalize">amount paid</p>
                    <p className="">{customer.paidAmount}</p>
                  </div>

                  <div className="bg-pink p-3 rounded-lg">
                    <p className="font-semibold capitalize">
                      arrears as at{" "}
                      {today.toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        timeZone: "Asia/Colombo",
                      })}
                    </p>
                    <p className="">{customer.arrears}</p>
                  </div>
                </div>

                <p className="">
                  <span className="font-semibold capitalize">
                    billing cycle :{" "}
                  </span>
                  {customer.billingCycle}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">
                    Installment amount :{" "}
                  </span>
                  {customer.installmentAmount}
                </p>

                {/* <p className="">
                  <span className="font-semibold capitalize">
                    No of installments :{" "}
                  </span>
                  {customer.noOfInstallments}
                </p> */}

                <p className="">
                  <span className="font-semibold capitalize">
                    description :{" "}
                  </span>
                  {customer.description}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">documents : </span>
                </p>

                <div
                  className="bg-pink w-max px-4 py-1 rounded-md cursor-pointer"
                  onClick={() =>
                    window.open(customer.NICFrontCopyLink, "_blank")
                  }
                >
                  <p className="capitalize text-white">NIC front copy</p>
                </div>

                <div
                  className="bg-pink w-max px-4 py-1 rounded-md mt-2 cursor-pointer"
                  onClick={() =>
                    window.open(customer.NICRearCopyLink, "_blank")
                  }
                >
                  <p className="capitalize text-white">NIC rear copy</p>
                </div>

                <div
                  className="bg-pink w-max px-4 py-1 rounded-md mt-2 cursor-pointer mb-3"
                  onClick={() =>
                    window.open(customer.customerPhotoLink, "_blank")
                  }
                >
                  <p className="capitalize text-white">customer photo</p>
                </div>

                <p className="">
                  <span className="font-semibold capitalize">
                    guarantor name :{" "}
                  </span>
                  {customer.guarantor}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">
                    guarantor NIC :{" "}
                  </span>
                  {customer.guarantorNIC}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">
                    guarantor Mobile No. 1 :{" "}
                  </span>
                  {customer.guarantorMobile}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">
                    guarantor Mobile No. 2 :{" "}
                  </span>
                  {customer.guarantorMobileTwo}
                </p>

                <p className="">
                  <span className="font-semibold capitalize">
                    guarantor documents :{" "}
                  </span>
                </p>

                <div
                  className="bg-pink w-max px-4 py-1 rounded-md cursor-pointer"
                  onClick={() =>
                    window.open(customer.guarantorNICFrontCopyLink, "_blank")
                  }
                >
                  <p className="capitalize text-white">
                    Guarantor NIC front copy
                  </p>
                </div>

                <div
                  className="bg-pink w-max px-4 py-1 rounded-md mt-2 cursor-pointer"
                  onClick={() =>
                    window.open(customer.guarantorNICRearCopyLink, "_blank")
                  }
                >
                  <p className="capitalize text-white">
                    Guarantor NIC rear copy
                  </p>
                </div>

                <div className=" flex mt-4">
                  <button
                    className={buttonClasses}
                    onClick={() => setChangeCustomerDetailsModalShow(true)}
                  >
                    <p className={buttonTextClasses}>change details</p>
                  </button>
                </div>

                {changeCustomerDetailsModalShow && (
                  <ChangeCustomerDetailsModal
                    modalShow={changeCustomerDetailsModalShow}
                    setModalShow={setChangeCustomerDetailsModalShow}
                    customer={customer}
                  />
                )}
              </>
            )
          )}
          {message && (
            <div className="w-full border border-orange rounded-lg">
              <p className="text-orange">{message}</p>
            </div>
          )}
        </div>
        {/* </div> */}
        <div>
          <div className="bg-white drop-shadow-lg rounded-lg p-3 mb-5">
            <SectionSubtitle title="payments" />
            <button
              className={secondaryButtonClasses}
              onClick={() => setAddPaymentModalShow(true)}
            >
              <p className={buttonTextClasses}>add payment</p>
            </button>
            <button
              className={`ms-3 ${primaryButtonClasses}`}
              onClick={() => setSendReminderModalShow(true)}
            >
              <p className={buttonTextClasses}>send reminder</p>
            </button>
          </div>
          {addPaymentModalShow && (
            <AddPaymentModal
              modalShow={addPaymentModalShow}
              setModalShow={setAddPaymentModalShow}
              customer={customer}
            />
          )}
          {sendReminderModalShow && (
            <SendReminderModal
              modalShow={sendReminderModalShow}
              setModalShow={setSendReminderModalShow}
              customer={customer}
            />
          )}
          <div className="bg-white drop-shadow-lg rounded-lg p-3">
            <SectionSubtitle title="payment history" />
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <ThreeDots
                  height="40"
                  width="40"
                  radius="9"
                  color="#F2766B"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            ) : (
              <div className=" overflow-y-auto max-h-96">
                {customerPayments &&
                  customerPayments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex bg-yellow px-4 py-2 rounded-lg mb-3 w-full justify-between"
                    >
                      <div className="">
                        {/* <p className="font-semibold capitalize">
                        payment Id : {payment.paymentId}
                      </p> */}
                        <p className="">Date : {payment.paidDate}</p>
                        <p className="">Amount : {payment.amount}</p>
                        <p className="">Collected by : {payment.collectedBy}</p>
                      </div>
                      <div className="flex flex-col items-end justify-end gap-2">
                        <button
                          className="bg-maroon flex rounded-lg px-3 py-1"
                          onClick={() => editPaymentButtonClick(payment)}
                        >
                          <EditIcon className="text-white" fontSize="small" />
                          <p className="text-white uppercase font-semibold ms-2 text-sm">
                            edit
                          </p>
                        </button>
                        <button
                          className="bg-orange flex rounded-lg px-3 py-1"
                          onClick={() => editPaymentButtonClick(payment)}
                        >
                          <DeleteIcon className="text-white" fontSize="small" />
                          <p className="text-white uppercase font-semibold ms-2 text-sm">
                            delete
                          </p>
                        </button>
                      </div>
                    </div>
                  ))}
                {displayEditPayment && (
                  <EditPaymentModal
                    modalShow={editPaymentModalShow}
                    setModalShow={setEditPaymentModalShow}
                    paymentEntry={displayEditPayment}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className=" mt-5"></div>
    </div>
  );
};

export default CustomerDetails;
