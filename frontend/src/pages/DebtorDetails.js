import React from "react";

const DebtorDetails = () => {
  const paymentsArr = [
    {
      paymentId: "4525",
      paymentDate: "15/01/2023",
      amount: "1000 LKR",
      collector: "Ruwan Kumara",
    },
    {
      paymentId: "4625",
      paymentDate: "15/01/2023",
      amount: "1000 LKR",
      collector: "Ruwan Kumara",
    },
    {
      paymentId: "4725",
      paymentDate: "15/01/2023",
      amount: "1000 LKR",
      collector: "Ruwan Kumara",
    },
    {
      paymentId: "4825",
      paymentDate: "15/01/2023",
      amount: "1000 LKR",
      collector: "Ruwan Kumara",
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
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
          <div className="bg-purple-500 hover:bg-purple-600 w-max px-4 py-1 rounded-md mt-3 cursor-pointer">
            <p className="capitalize text-purple-50">view application pdf</p>
          </div>
          <div className="bg-purple-500 hover:bg-purple-600 w-max px-4 py-1 rounded-md mt-2 cursor-pointer">
            <p className="capitalize text-purple-50">view document 01</p>
          </div>
          <div className="bg-purple-500 hover:bg-purple-600 w-max px-4 py-1 rounded-md mt-2 cursor-pointer">
            <p className="capitalize text-purple-50">view document 02</p>
          </div>
        </div>
        <div className="">
          <div className="bg-purple-200 rounded-lg p-5">
            <p className="">
              <span className="font-semibold capitalize">start date : </span>
              01/01/2023
            </p>
            <p className="">
              <span className="font-semibold capitalize">loan amount : </span>
              200,000 LKR
            </p>
            <p className="text-red-600">
              <span className="font-semibold capitalize">arrears : </span>
              50,000 LKR
            </p>
            <div className=" flex mt-4">
              <div className="bg-gray-500 px-4 py-1 rounded-lg">
                <p className="text-purple-50 capitalize font-semibold">
                  change details
                </p>
              </div>
              <div className="bg-green-500 px-4 py-1 rounded-lg ms-4">
                <p className="text-purple-50 capitalize font-semibold">
                  mark as complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <p className="capitalize mb-4">payment history</p>
        {paymentsArr &&
          paymentsArr.map((payment) => (
            <div className="flex bg-purple-400 px-4 py-2 rounded-lg mb-3 max-w-xl justify-between">
              <div className="">
                <p className="font-semibold capitalize text-purple-50">
                  payment received
                </p>
                <p className="">{payment.paymentDate}</p>
              </div>
              <div className="flex items-center justify-center">
                <div>
                  <p className="">{payment.amount}</p>
                  <p className="">{payment.collector}</p>
                </div>
                <span className="material-symbols-outlined ms-2">more_vert</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DebtorDetails;
