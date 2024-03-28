import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import ChangeCustomerDetailsModal from "../modals/ChangeCustomerDetailsModal";
import ChangeLoanAmountModal from "../modals/ChangeLoanAmountModal";
import DeleteCustomerModal from "../modals/DeleteCustomerModal";
import SendReminderModal from "../modals/SendReminderModal";
import AddPaymentModal from "../modals/AddPaymentModal";
import EditPaymentModal from "../modals/EditPaymentModal";
import DeletePaymentModal from "../modals/DeletePaymentModal";

import { EditIcon, DeleteIcon } from "../Icons/Icon";
import {
  buttonClasses,
  buttonTextClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from "../data/Classes";
import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";
import PrintDetailsModal from "../modals/PrintDetailsModal";

const cookies = new Cookies();

const CustomerDetails = () => {
  const [changeCustomerDetailsModalShow, setChangeCustomerDetailsModalShow] =
    useState(false);
  const [printDetailsModelShow, setPrintDetailsModelShow] = useState(false);
  const [changeLoanAmountModalShow, setChangeLoanAmountModalShow] =
    useState(false);
  const [deleteCustomerModalShow, setDeleteCustomerModalShow] = useState(false);
  const [sendReminderModalShow, setSendReminderModalShow] = useState(false);
  const [addPaymentModalShow, setAddPaymentModalShow] = useState(false);
  const [editPaymentModalShow, setEditPaymentModalShow] = useState(false);
  const [displayEditPayment, setDisplayEditPayment] = useState(null);
  const [deletePaymentModalShow, setDeletePaymentModalShow] = useState(false);
  const [displayDeletePayment, setDisplayDeletePayment] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [customerPayments, setCustomerPayments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { id } = useParams();

  const token = cookies.get("autoCreditCookie");

  var startDate = new Date(customer && customer.startDate);
  const today = new Date();
  const isAdmin = () => {
    if (JSON.parse(localStorage.getItem("userRole")) === "admin") {
      return true;
    } else {
      return false;
    }
  };
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
          setCustomer(response.data.customer);
          setCustomerPayments(response.data.payments);
        })
        .catch((err) => {
          // setMessage(err.data.message);
          console.log(err);
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

  const deletePaymentButtonClick = (payment) => {
    setDisplayDeletePayment(payment);
    setDeletePaymentModalShow(true);
  };

  return (
    <div className="w-full">
      <SectionTitle title="customer details" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* <div className=""> */}
        <div className="">
          <div className="bg-white drop-shadow-lg rounded-lg p-3 mb-5">
            <SectionSubtitle title="loan details" />
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <ThreeDots
                  height="40"
                  width="40"
                  radius="9"
                  color="#808080"
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

                  <p className="">
                    <span className="font-semibold capitalize">
                      billing cycle :{" "}
                    </span>
                    {customer.billingCycle}
                  </p>

                  <p className="">
                    <span className="font-semibold capitalize">
                      amount paid :{" "}
                    </span>
                    {customer.paidAmount &&
                      CurrencyFormatter(customer.paidAmount)}{" "}
                    LKR
                  </p>

                  <p className="">
                    <span className="font-semibold capitalize">
                      remaining amount :{" "}
                    </span>
                    {customer.paidAmount &&
                      CurrencyFormatter(
                        customer.loanAmount - customer.paidAmount
                      )}{" "}
                    LKR
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 my-3">
                    <div className="bg-yellow p-3 rounded-lg flex flex-col justify-between">
                      <p className="font-semibold capitalize">loan amount</p>
                      <p className="">
                        {customer.loanAmount &&
                          CurrencyFormatter(customer.loanAmount)}{" "}
                        LKR
                      </p>
                    </div>

                    <div className="bg-yellow p-3 rounded-lg flex flex-col justify-between">
                      <p className="font-semibold capitalize">
                        installment amount
                      </p>
                      <p className="">
                        {customer.installmentAmount &&
                          CurrencyFormatter(customer.installmentAmount)}{" "}
                        LKR
                      </p>
                    </div>

                    <div className="bg-pink p-3 rounded-lg flex flex-col justify-between">
                      <p className="font-semibold capitalize">
                        arrears as at{" "}
                        {today.toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          timeZone: "Asia/Colombo",
                        })}
                      </p>
                      <p className="">
                        {customer.arrears &&
                          CurrencyFormatter(customer.arrears)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    {isAdmin() ? (
                      <button
                        className={`${secondaryButtonClasses} w-full`}
                        onClick={() => setChangeLoanAmountModalShow(true)}
                      >
                        <p className={buttonTextClasses}>change loan amount</p>
                      </button>
                    ) : null}
                  </div>
                  {changeLoanAmountModalShow && (
                    <ChangeLoanAmountModal
                      modalShow={changeLoanAmountModalShow}
                      setModalShow={setChangeLoanAmountModalShow}
                      customer={customer}
                    />
                  )}
                </>
              )
            )}
          </div>
          <div className="bg-white drop-shadow-lg rounded-lg p-3">
            <SectionSubtitle title="customer details" />
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <ThreeDots
                  height="40"
                  width="40"
                  radius="9"
                  color="#808080"
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
                    <span className="font-semibold capitalize">
                      customer ID :{" "}
                    </span>
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
                      description :{" "}
                    </span>
                    {customer.description}
                  </p>

                  <p className="">
                    <span className="font-semibold capitalize">
                      documents :{" "}
                    </span>
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
                  <div
                    className="bg-pink w-max px-4 py-1 rounded-md mt-2 cursor-pointer"
                    onClick={() =>
                      window.open(
                        customer.guarantorAdditionalDocumentLink,
                        "_blank"
                      )
                    }
                  >
                    <p className="capitalize text-white">
                      Guarantor Additional Photo
                    </p>
                  </div>
                  {isAdmin() ? (
                    <div className="flex flex-col gap-3 mt-4">
                      <button
                        className={`${secondaryButtonClasses} w-full`}
                        onClick={() => setChangeCustomerDetailsModalShow(true)}
                      >
                        <p className={buttonTextClasses}>change details</p>
                      </button>

                      <button
                        className={`${primaryButtonClasses} w-full`}
                        onClick={() => setDeleteCustomerModalShow(true)}
                      >
                        <p className={buttonTextClasses}>remove customer</p>
                      </button>
                    </div>
                  ) : null}
                  {changeCustomerDetailsModalShow && (
                    <ChangeCustomerDetailsModal
                      modalShow={changeCustomerDetailsModalShow}
                      setModalShow={setChangeCustomerDetailsModalShow}
                      customer={customer}
                    />
                  )}
                  {printDetailsModelShow && (
                    <PrintDetailsModal
                      modalShow={printDetailsModelShow}
                      setModalShow={setPrintDetailsModelShow}
                      customer={customer}
                      customerPayments={customerPayments}
                    />
                  )}
                  {deleteCustomerModalShow && (
                    <DeleteCustomerModal
                      modalShow={deleteCustomerModalShow}
                      setModalShow={setDeleteCustomerModalShow}
                      customer={customer}
                    />
                  )}
                </>
              )
            )}
            {console.log(customer)}
          </div>
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
            <div className="flex items-center justify-start gap-3">
              <button
                className={secondaryButtonClasses}
                onClick={() => setAddPaymentModalShow(true)}
              >
                <p className={buttonTextClasses}>add installment</p>
              </button>
              {isAdmin() ? (
                <button
                  className={`${primaryButtonClasses}`}
                  onClick={() => setSendReminderModalShow(true)}
                >
                  <p className={buttonTextClasses}>send reminder</p>
                </button>
              ) : null}
            </div>
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
            <SectionSubtitle title="installment history" />
            <button
              className={`mb-2 ${secondaryButtonClasses}`}
              onClick={() => setPrintDetailsModelShow(true)}
            >
              <p className={`${buttonTextClasses}`}>Print Details</p>
            </button>
            {/* <PDFDownloadLink
              document={<CustomPDF />}
              fileName="somename.pdf"
              style={{ color: "red", background: "blue", padding: "5" }}
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Download now!"
              }
            </PDFDownloadLink>
             */}
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <ThreeDots
                  height="40"
                  width="40"
                  radius="9"
                  color="#808080"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            ) : (
              <div className=" overflow-y-auto max-h-[400px]">
                {customerPayments &&
                  customerPayments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex flex-col bg-yellow px-4 py-2 rounded-lg mb-3 w-full justify-between"
                    >
                      <div className="">
                        {/* <p className="font-semibold capitalize">
                        payment Id : {payment.paymentId}
                      </p> */}
                        <p className="">
                          Installment on :{" "}
                          {new Date(payment.paidDate).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              timeZone: "Asia/Colombo",
                            }
                          )}{" "}
                          {new Date(payment.paidDate).toLocaleTimeString(
                            "en-US",
                            {
                              timeZone: "Asia/Colombo",
                            }
                          )}
                        </p>
                        <p className="">
                          Amount :{" "}
                          {payment.amount && CurrencyFormatter(payment.amount)}{" "}
                          LKR
                        </p>
                        <p className="">Collected by : {payment.collectedBy}</p>
                      </div>
                      {isAdmin() ? (
                        <div className="flex items-end justify-end gap-3 mt-2">
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
                            onClick={() => deletePaymentButtonClick(payment)}
                          >
                            <DeleteIcon
                              className="text-white"
                              fontSize="small"
                            />
                            <p className="text-white uppercase font-semibold ms-2 text-sm">
                              delete
                            </p>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                {console.log(customerPayments)}
                {displayEditPayment && (
                  <EditPaymentModal
                    modalShow={editPaymentModalShow}
                    setModalShow={setEditPaymentModalShow}
                    paymentEntry={displayEditPayment}
                  />
                )}
                {displayDeletePayment && (
                  <DeletePaymentModal
                    modalShow={deletePaymentModalShow}
                    setModalShow={setDeletePaymentModalShow}
                    paymentEntry={displayDeletePayment}
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
