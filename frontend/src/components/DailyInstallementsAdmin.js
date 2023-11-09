import React from "react";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
const DailyInstallmentAdmin = ({ installments }) => {
  return (
    <>
      {installments &&
        installments.map((installment) => (
          <div
            className="bg-yellow p-3 rounded-lg mb-3 lg:bg-transparent lg:p-0 lg:rounded-none lg:mb-0 w-full grid grid-cols-2 lg:grid-cols-7"
            key={installment._id}
          >
            <p className="flex gap-1 lg:col-span-2 capitalize font-semibold lg:font-normal">
              {installment.customerName}
            </p>
            <p className="flex gap-1 font-semibold lg:font-normal">
              <span className=" flex lg:hidden"> -</span>
              {installment.customerID}
            </p>
            <p className="flex gap-1 col-span-2 lg:col-span-1">
              <span className="flex lg:hidden">Collected by :</span>
              <span className="capitalize">{installment.collectedBy}</span>
            </p>
            <p className="flex gap-1 col-span-2">
              {new Date(installment.paidDate).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: "Asia/Colombo",
              })}{" "}
              {new Date(installment.paidDate).toLocaleTimeString("en-US", {
                timeZone: "Asia/Colombo",
              })}
            </p>
            <p className="gap-1 flex lg:justify-end col-span-2 lg:col-span-1">
              <span className="flex lg:hidden">Amount :</span>
              {installment.amount && CurrencyFormatter(installment.amount)} LKR
            </p>
          </div>
        ))}
    </>
  );
};

export default DailyInstallmentAdmin;
