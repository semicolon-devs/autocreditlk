import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";
import MUIDatePicker from "../components/MUIDatePicker";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const Insights = () => {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

  //console.log(today);

  const [date, setDate] = useState(today);
  const [installments, setInstallments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [dailyInstallments, setDailyInstallments] = useState(0);

  const token = cookies.get("autoCreditCookie");

  const getInstallments = () => {
    setLoading(true);

    var modifiedDate = new Date(date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Colombo",
    });

    const axiosConfig = {
      method: "GET",
      url: `${BASE_URL}installment/${modifiedDate}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(axiosConfig)
      .then((response) => {
        setInstallments(response.data.installments);
        setDailyTotal(
          response.data.installments.reduce((total, installment) => {
            return total + installment.amount;
          }, 0)
        );
        setDailyInstallments(
          response.data.installments.reduce((count, installment) => {
            return count + 1;
          }, 0)
        );
      })
      .catch((err) => {
        // setMessage(err.data.message);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInstallments();
  }, [date]);

  return (
    <>
      <SectionTitle title="Insights" />
      <div className="bg-white drop-shadow-lg rounded-lg p-3 mb-5 flex justify-end sm:justify-between items-center">
        <p className="text-xl hidden sm:block">Pick date</p>
        <div className="flex justify-end">
          <MUIDatePicker setDate={setDate} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white drop-shadow-lg rounded-lg p-3 flex flex-col justify-between">
          <SectionSubtitle title="Daily total collection" />
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
            <p className="text-3xl font-semibold">
              {dailyTotal && CurrencyFormatter(dailyTotal)} LKR
            </p>
          )}
        </div>
        <div className="bg-white drop-shadow-lg rounded-lg p-3 flex flex-col justify-between">
          <SectionSubtitle title="Daily count" />
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
            <p className="text-3xl font-semibold">
              {dailyInstallments} Installments
            </p>
          )}
        </div>
      </div>
      <div className="bg-white drop-shadow-lg rounded-lg p-3 mb-5">
        <SectionSubtitle title="Daily installments" />
        <div className="hidden lg:grid lg:grid-cols-7 lg:border-y lg:border-grey lg:py-3 lg:my-3">
          <p className="font-semibold col-span-2">Customer name</p>
          <p className="font-semibold">Customer ID</p>
          <p className="font-semibold">Collected by</p>
          <p className="font-semibold col-span-2">Installment date</p>
          <p className="font-semibold text-end">Installment amount</p>
        </div>
        <div className="overflow-y-auto max-h-96">
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
            installments &&
            installments.map((installment) => {
              const paidDate = new Date(installment.paidDate);
              return (
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
                    <span className="capitalize">
                      {installment.collectedBy}
                    </span>
                  </p>
                  <p className="flex gap-1 col-span-2">
                    {new Date(installment.paidDate).toLocaleDateString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        timeZone: "Asia/Colombo",
                      }
                    )}{" "}
                    {new Date(installment.paidDate).toLocaleTimeString(
                      "en-US",
                      {
                        timeZone: "Asia/Colombo",
                      }
                    )}
                  </p>
                  <p className="gap-1 flex lg:justify-end col-span-2 lg:col-span-1">
                    <span className="flex lg:hidden">Amount :</span>
                    {installment.amount &&
                      CurrencyFormatter(installment.amount)}{" "}
                    LKR
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Insights;
