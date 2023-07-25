import React from "react";

import { paymentsArr } from "../data/SampleData";

const DebtorDetails = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white p-3 drop-shadow-lg rounded-lg">
        <div>
          <p className="text-2xl font-bold capitalize">saman bandara</p>
          <p className="mt-3">
            <span className="font-semibold capitalize">telephone no : </span>
            0775145769{" "}
            <span className="material-symbols-outlined text-sm cursor-pointer">
              edit
            </span>
          </p>
          <p className="">
            <span className="font-semibold capitalize">address : </span>
            55, Daulagala Road, Penideniya, Peradeniya
          </p>
          <div className="bg-pink w-max px-4 py-1 rounded-md mt-3 cursor-pointer">
            <p className="capitalize text-white">view application pdf</p>
          </div>
          <div className="bg-pink w-max px-4 py-1 rounded-md mt-2 cursor-pointer">
            <p className="capitalize text-white">view document 01</p>
          </div>
          <div className="bg-pink w-max px-4 py-1 rounded-md mt-2 cursor-pointer">
            <p className="capitalize text-white">view document 02</p>
          </div>
        </div>
        <div className="">
          <div className="rounded-lg p-5">
            <p className="">
              <span className="font-semibold capitalize">start date : </span>
              01/01/2023
            </p>
            <p className="">
              <span className="font-semibold capitalize">loan amount : </span>
              200,000 LKR
            </p>
            <p className="">
              <span className="font-semibold capitalize">arrears : </span>
              50,000 LKR
            </p>
            <div className=" flex mt-4">
              <button className="bg-maroon px-4 py-1 rounded-lg">
                <p className="text-white capitalize font-semibold">
                  change details
                </p>
              </button>
              <button className="bg-orange px-4 py-1 rounded-lg ms-4">
                <p className="text-white capitalize font-semibold">
                  mark as complete
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white drop-shadow-lg rounded-lg p-3 mt-5">
        <p className="capitalize mb-4 text-lg font-bold">payment history</p>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            {paymentsArr &&
              paymentsArr.map((payment) => (
                <div
                  key={payment.paymentId}
                  className="flex bg-yellow px-4 py-2 rounded-lg mb-3 max-w-xl justify-between"
                >
                  <div className="">
                    <p className="font-semibold capitalize text-maroon">
                      payment received
                    </p>
                    <p className="">{payment.paymentDate}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div>
                      <p className="">{payment.amount}</p>
                      <p className="">{payment.collector}</p>
                    </div>
                    <span className="material-symbols-outlined ms-2">
                      more_vert
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtorDetails;
