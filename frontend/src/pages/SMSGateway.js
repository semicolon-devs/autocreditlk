import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";

import notifylkLogo from "../assets/notifylkLogo.png";
import { RefreshIcon, DotIcon } from "../Icons/Icon";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const SMSGateway = () => {
  const [isActive, setIsActive] = useState();
  const [accBalance, setAccBalance] = useState();
  const [loading, setLoading] = useState(false);

  const token = cookies.get("autoCreditCookie");

  const SMSGatewayRefresh = async () => {
    setLoading(true);
    const config = {
      method: "get",
      url: `${BASE_URL}sms/status`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios(config)
      .then((res) => {
        console.log(res);
        setIsActive(res.data.status.data.active);
        setAccBalance(res.data.status.data.acc_balance);
      })
      .catch((res) => {
        console.log(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    SMSGatewayRefresh();
  }, []);

  const goToNotifylk = () => {
    window.open("https://app.notify.lk/", "_blank");
  };

  return (
    <>
      <SectionTitle title="SMS Gateway" />
      <div className="bg-white p-5 rounded-xl drop-shadow-lg w-full">
        <div className="flex justify-between items-center gap-3">
          <div className="">
            <img
              src={notifylkLogo}
              alt="notify logo"
              className="cursor-pointer"
              onClick={goToNotifylk}
            />
          </div>
          <button
            className="bg-[#149ca4] px-3 py-2 rounded-lg outline-none border-none hidden sm:block"
            onClick={goToNotifylk}
          >
            <p className="text-white uppercase font-semibold">
              go to notify.lk dashboard
            </p>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-5">
          <div className="w-full">
            <div className="flex justify-between items-center w-full">
              <SectionSubtitle title="acocunt status" />
              <button
                className="bg-[#3c3c3c] border-none outline-none text-white px-3 py-1 rounded-lg flex justify-between items-center gap-3"
                onClick={SMSGatewayRefresh}
              >
                <RefreshIcon />
                <p className="uppercase font-semibold">refresh</p>
              </button>
            </div>
            {loading ? (
              <div className="w-full flex justify-center items-center">
                <ThreeDots
                  height="40"
                  width="40"
                  radius="9"
                  color="#3c3c3c"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            ) : (
              <>
                <div className="flex items-center mt-3 mb-2">
                  {isActive ? (
                    <>
                      <DotIcon className="text-[#149c6c]" />
                      <p className="text-[#149c6c] font-semibold ms-3">
                        Active
                      </p>
                    </>
                  ) : (
                    <>
                      <DotIcon className="text-[#a41442]" />
                      <p className="text-[#a41442] font-semibold ms-3">
                        Disconnected
                      </p>
                    </>
                  )}
                </div>
                <p className="font-semibold">Balance : {accBalance} SMS</p>
              </>
            )}
          </div>
          <div className=""></div>
        </div>
      </div>
    </>
  );
};

export default SMSGateway;
