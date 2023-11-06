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

const CollectorDetails = () => {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

  //console.log(today);

  const [date, setDate] = useState(today);
  const [collectors, setCollector] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = cookies.get("autoCreditCookie");
  const getCollectors = () => {
    setLoading(true);

    var modifiedDate = new Date(date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Colombo",
    });
    console.log(modifiedDate + "here");
    const axiosConfig = {
      method: "GET",
      url: `${BASE_URL}collector/collectors/${modifiedDate}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(axiosConfig)
      .then((response) => {
        setCollector(response.data.collectors);
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
    getCollectors();
  }, [date]);

  return (
    <>
      <SectionTitle title="Collector Details" />
      <div className="bg-white drop-shadow-lg rounded-lg p-3 mb-5 flex justify-end sm:justify-between items-center">
        <p className="text-xl hidden sm:block">Pick date</p>
        <div className="flex justify-end">
          <MUIDatePicker setDate={setDate} />
        </div>
      </div>{" "}
      <div className="bg-white drop-shadow-lg rounded-lg p-3 mb-5">
        <SectionSubtitle title="Daily transactions" />
        <div className="hidden lg:grid lg:grid-cols-7 lg:border-y lg:border-grey lg:py-3 lg:my-3">
          <p className="font-semibold col-span-2">Collector name</p>
          <p className="font-semibold">Collector Phone</p>
          <p className="font-semibold">Collected Amount</p>
          <p className="font-semibold ">Status</p>
          <p className="font-semibold text-end">Email</p>
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
            collectors &&
            collectors.map((collector) => {
              // const paidDate = new Date(installment.paidDate);
              return (
                <div
                  className="bg-yellow p-3 rounded-lg mb-3 lg:bg-transparent lg:p-0 lg:rounded-none lg:mb-0 w-full grid grid-cols-2 lg:grid-cols-7"
                  key={collector.id}
                >
                  <p className="flex gap-1 lg:col-span-2 capitalize font-semibold lg:font-normal">
                    {collector.name}
                  </p>
                  <p className="flex gap-1 font-semibold lg:font-normal">
                    <span className=" flex lg:hidden"> -</span>
                    {collector.phone}
                  </p>
                  <p className="flex gap-1 col-span-2 lg:col-span-1">
                    <span className="capitalize">
                      {collector.totalCollected &&
                        CurrencyFormatter(collector.totalCollected)}{" "}
                      LKR
                    </span>
                  </p>

                  {/* <p className="gap-1 flex lg:justify-end col-span-2 lg:col-span-1">
                    <span className="flex lg:hidden">Amount :</span>
                  </p> */}
                 
                  <p className="flex gap-1 col-span-2 lg:col-span-1">
                    <span className="capitalize">
                      {collector.isTodayWorkingDay ? "Working" : "Not Working"}
                    </span>
                  </p>
                  <p className="flex gap-1 font-semibold lg:font-normal">
                    <span className=" flex lg:hidden"> -</span>
                    {collector.email}
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

export default CollectorDetails;
