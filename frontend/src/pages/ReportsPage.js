import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import SectionTitle from "../components/SectionTitle";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState(null);

  const token = cookies.get("autoCreditCookie");

  const getReports = () => {
    setLoading(true);

    const axiosConfig = {
      method: "GET",
      url: `${BASE_URL}report`,
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${token}`,
      },
    };
    axios(axiosConfig)
      .then((response) => {
        setReports(response.data.reports);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <>
      <SectionTitle title="Reports" />
      <div className="bg-white p-5 rounded-xl drop-shadow-lg w-full max-h-[26rem] overflow-y-auto">
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
          reports &&
          reports.map((report) => {
            var date = new Date(report.date).toLocaleDateString("en-CA", {
              timeZone: "Asia/Colombo",
            });
            return (
              <div
                className="flex items-center justify-between pb-3 mb-3 border-grey border-b "
                key={report._id}
              >
                <p className="">Report of {date}</p>
                <button
                  onClick={() => window.open(report.downloadURL, "_blank")}
                  className="bg-yellow px-3 py-2 rounded-lg "
                >
                  <p className="">View Report</p>
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default ReportsPage;
