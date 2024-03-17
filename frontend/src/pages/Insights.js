import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";
import MUIDatePicker from "../components/MUIDatePicker";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
import CollectorDetails from "../components/CollectorDetails";
import DailyInstallmentAdmin from "../components/DailyInstallementsAdmin";
import DailyInstallments from "../components/DailyInstallemnts";
import DailyUnpaid from "../components/DailyUnpaid";
import DailyUnpaidAdmin from "../components/DailyUnpaidAdmin";
import Cookies from "universal-cookie";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const Insights = () => {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

  //console.log(today);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [date, setDate] = useState(today);
  const [installments, setInstallments] = useState(null);
  const [notPaid, setNotPaid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [dailyInstallments, setDailyInstallments] = useState(0);
  const [totalUnPaid, setTotalUnpaid] = useState(0);
  const [collectors, setCollector] = useState(null);

  const [billingCycle, setBillingCycle] = useState("all");
  const token = cookies.get("autoCreditCookie");
  const handleBillingFilter = (event) => {
    setBillingCycle(event.target.value);
  };

  const getTotalUnpaid = () => {
    setLoading(true);
    const axiosConfig = {
      method: "GET",
      url: `${BASE_URL}customers/total-unpaid`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(axiosConfig)
      .then((response) => {
        setTotalUnpaid(response.data.totalUnpaid);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  };

  const getCollectors = () => {
    setLoading(true);

    var modifiedDate = new Date(date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Colombo",
    });
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
        console.log(response.data.collectors);
        const collectorsData = response.data.collectors;
        const matchingCollector = collectorsData.find(
          (collector) => collector.name === userData.name
        );
        if (matchingCollector) {
          setDailyTotal(matchingCollector.totalCollected);
          setDailyInstallments(matchingCollector.installmentCount);
        }
      })
      .catch((err) => {
        // setMessage(err.data.message);
        console.log(err);
      })
      .finally(() => {});
  };

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
        console.log(response.data.installments);
        if (userData.role === "admin") {
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
        }
        setNotPaid(response.data.nonPaidCustomers);
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
    getCollectors();
    getTotalUnpaid();
  }, [date]);

  let filteredInstallments = installments;
  let filteredNotPaid = notPaid;

  if (billingCycle !== "all") {
    filteredInstallments = installments.filter(
      (installment) => installment.billingCycle === billingCycle
    );
    filteredNotPaid = notPaid.filter(
      (customer) => customer.billingCycle === billingCycle
    );
  }
  return (
    <>
      <SectionTitle title="Insights" />
      <div className="bg-white drop-shadow-lg rounded-lg p-3 mb-5 flex justify-end sm:justify-between items-center">
        <p className="text-xl hidden sm:block">Pick date</p>
        <div className="flex justify-end">
          <MUIDatePicker setDate={setDate} />
        </div>
      </div>{" "}
      <div className="grid grid-cols-2 gap-5 ">
        <div className="grid grid-rows-3 gap-5 mb-10">
          {userData.role === "admin" && (
            <div className="bg-white drop-shadow-lg rounded-lg p-3 flex flex-col justify-between ">
              <SectionSubtitle title="Total Money to be collected" />
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
                  {totalUnPaid && CurrencyFormatter(totalUnPaid)} LKR
                </p>
              )}
            </div>
          )}

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
        <div className="w-full">
          {userData.role === "admin" && (
            <CollectorDetails collectors={collectors} />
          )}
        </div>
      </div>
      <div className="bg-white drop-shadow-lg rounded-lg p-3 mb-5">
        <SectionSubtitle title="Daily installments" />
        <div className="flex items-center">
          <Box sx={{ minWidth: 220 }}>
            <FormControl fullWidth>
              <InputLabel id="billingcycle-input-label">
                Billing Cycle
              </InputLabel>
              <Select
                labelId="billingcycle-label"
                id="billingcycle"
                value={billingCycle}
                label="Billing Cycle"
                onChange={handleBillingFilter}
              >
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="all"> All</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
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
          ) : userData.role === "admin" ? (
            <DailyInstallmentAdmin installments={filteredInstallments} />
          ) : (
            <DailyInstallments
              installments={filteredInstallments}
              userData={userData}
            />
          )}
        </div>
      </div>
      <div className="bg-yellow drop-shadow-lg rounded-lg p-3 mb-5">
        <SectionSubtitle title="Unpaid Customers" />
        <div className="hidden lg:grid lg:grid-cols-8 lg:border-y lg:border-grey lg:py-3 lg:my-3">
          <p className="font-semibold col-span-2">Customer Name</p>
          <p className="font-semibold">Customer ID</p>
          <p className="font-semibold">Collector Name</p>
          <p className="font-semibold"> Phone Number</p>
          <p className="font-semibold"> Billing Cycle</p>
          <p className="font-semibold col-span-2">Installment amount</p>
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
          ) : userData.role === "admin" ? (
            <DailyUnpaidAdmin notPaid={filteredNotPaid} />
          ) : (
            <DailyUnpaid notPaid={filteredNotPaid} userData={userData} />
          )}
        </div>
      </div>
    </>
  );
};

export default Insights;
