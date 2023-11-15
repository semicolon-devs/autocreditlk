import React from "react";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";

const DailyUnpaid = ({ notPaid, userData }) => {
  if (!notPaid || notPaid.length === 0) {
    return (
      <p className="flex gap-1 lg:col-span-2 capitalize font-semibold lg:font-normal">
        No customers to Pay today
      </p>
    );
  }

  const filteredUsers = notPaid.filter(
    (customer) => customer.collectorName === userData.name
  );

  return (
    <>
      {filteredUsers &&
        filteredUsers.map((customer) => (
          <div
            className="bg-yellow p-3 rounded-lg mb-3 lg:bg-transparent lg:p-0 lg:rounded-none lg:mb-0 w-full grid grid-cols-2 lg:grid-cols-7"
            key={customer._id}
          >
            <p className="flex gap-1 lg:col-span-2 capitalize font-semibold lg:font-normal">
              {customer.name}
            </p>
            <p className="flex gap-1 font-semibold lg:font-normal">
              <span className=" flex lg:hidden"> -</span>
              {customer.customerID}
            </p>
            <p className="flex gap-1 col-span-2 lg:col-span-1">
              <span className="flex lg:hidden">Collector Name :</span>
              <span className="capitalize">{customer.collectorName}</span>
            </p>
            <p className="flex gap-1 ">{customer.phone}</p>
            {/* <p className="flex gap-1 ">{customer.billingCycle}</p> */}
            <p className="gap-1 flex lg:justify-start col-span-2 lg:col-span-1">
              <span className="flex lg:hidden">Amount :</span>
              {customer.installmentAmount &&
                CurrencyFormatter(customer.installmentAmount)}{" "}
              LKR
            </p>
          </div>
        ))}
    </>
  );
};

export default DailyUnpaid;
