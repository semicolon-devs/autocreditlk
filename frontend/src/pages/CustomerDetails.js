import React, { useState } from "react";
import { useParams } from "react-router-dom";

import MarkAsCompleteModal from "../modals/MarkAsCompleteModal";
import AddPaymentModal from "../modals/AddPaymentModal";
import EditPaymentModal from "../modals/EditPaymentModal";

import { customerArr, paymentsArr } from "../data/SampleData";
import { EditIcon } from "../Icons/Icon";
import {
  buttonClasses,
  buttonTextClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from "../data/Classes";
import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";

const CustomerDetails = () => {
  const { id } = useParams();

  const customer = customerArr.find((item) => item.loanId === id);

  const [MarkAsCompleteModalShow, setMarkAsCompleteModalShow] = useState(false);
  const [addPaymentModalShow, setAddPaymentModalShow] = useState(false);
  const [editPaymentModalShow, setEditPaymentModalShow] = useState(false);
  const [displayEditPayment, setDisplayEditPayment] = useState(null);

  const editPaymentButtonClick = (payment) => {
    setDisplayEditPayment(payment);
    setEditPaymentModalShow(true);
  };

  return (
    <div className="w-full">
      <SectionTitle title="customer details" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white drop-shadow-lg rounded-lg p-3">
          <p className="">
            <span className="font-semibold capitalize">name : </span>
            {customer.name}
          </p>
          <p className="">
            <span className="font-semibold capitalize">loan ID : </span>#
            {customer.loanId}
          </p>
          <p className="">
            <span className="font-semibold capitalize">mobile no : </span>
            {customer.mobileNo}
          </p>
          <p className="">
            <span className="font-semibold capitalize">address : </span>
            {customer.address}
          </p>
          <p className="">
            <span className="font-semibold capitalize">start date : </span>
            {customer.startDate}
          </p>
          <p className="">
            <span className="font-semibold capitalize">loan amount : </span>
            {customer.total}
          </p>
          <p className="">
            <span className="font-semibold capitalize">arrears : </span>
            {customer.arrears}
          </p>
          <p className="">
            <span className="font-semibold capitalize">description : </span>
            {customer.description}
          </p>
          <p className="">
            <span className="font-semibold capitalize">documents : </span>
          </p>
          <div className="bg-pink w-max px-4 py-1 rounded-md cursor-pointer">
            <p className="capitalize text-white">view application pdf</p>
          </div>
          <div className="bg-pink w-max px-4 py-1 rounded-md mt-2 cursor-pointer">
            <p className="capitalize text-white">view document 01</p>
          </div>
          <div className="bg-pink w-max px-4 py-1 rounded-md mt-2 cursor-pointer">
            <p className="capitalize text-white">view document 02</p>
          </div>
          <div className=" flex mt-4">
            <button className={buttonClasses}>
              <p className={buttonTextClasses}>change details</p>
            </button>
          </div>
          {MarkAsCompleteModalShow && (
            <MarkAsCompleteModal
              modalShow={MarkAsCompleteModalShow}
              setModalShow={setMarkAsCompleteModalShow}
              user={customer}
            />
          )}
        </div>
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
              onClick={() => setMarkAsCompleteModalShow(true)}
            >
              <p className={buttonTextClasses}>mark as complete</p>
            </button>
          </div>
          {addPaymentModalShow && (
            <AddPaymentModal
              modalShow={addPaymentModalShow}
              setModalShow={setAddPaymentModalShow}
              customer={customer}
            />
          )}
          <div className="bg-white drop-shadow-lg rounded-lg p-3">
            <SectionSubtitle title="payment history" />
            <div className=" overflow-y-auto max-h-96">
              {paymentsArr &&
                paymentsArr.map((payment) => (
                  <div
                    key={payment.paymentId}
                    className="flex bg-yellow px-4 py-2 rounded-lg mb-3 w-full justify-between"
                  >
                    <div className="">
                      <p className="font-semibold capitalize">
                        payment Id : {payment.paymentId}
                      </p>
                      <p className="">Amount : {payment.amount}</p>
                      <p className="">Collected by : {payment.collector}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <p className="">Date : {payment.paymentDate}</p>
                      <button
                        className="bg-maroon flex rounded-lg px-3 py-1"
                        onClick={() => editPaymentButtonClick(payment)}
                      >
                        <EditIcon className="text-white" fontSize="small" />
                        <p className="text-white uppercase font-semibold ms-2 text-sm">
                          edit
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
          </div>
        </div>
      </div>
      <div className=" mt-5"></div>
    </div>
  );
};

export default CustomerDetails;
