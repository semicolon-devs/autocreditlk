import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import SectionTitle from "./SectionTitle";
import SectionSubtitle from "./SectionSubtitle";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";



const CollectorDetails = ({ collectors }) => {

   const [loading, setLoading] = useState(false);
   
  return (
    <>
      <SectionTitle title="Collector Details" />
      <div className="bg-white drop-shadow-lg rounded-lg p-3 mb-5">
        <SectionSubtitle title="Daily transactions" />
        <div className="hidden lg:grid lg:grid-cols-4 lg:border-y lg:border-grey lg:py-3 lg:my-3">
          <p className="font-semibold col-span-2">Collector name</p>
          <p className="font-semibold">Collected Amount</p>
          <p className="font-semibold ">Status</p>
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
              return (
                <div
                  className="bg-yellow p-3 rounded-lg mb-3 lg:bg-transparent lg:p-0 lg:rounded-none lg:mb-0 w-full grid grid-cols-2 lg:grid-cols-4"
                  key={collector.id}
                >
                  <p className="flex gap-1 lg:col-span-2 capitalize font-semibold lg:font-normal">
                    {collector.name}
                  </p>
                  <p className="flex gap-1 col-span-2 lg:col-span-1">
                    <span className="capitalize">
                      {collector.totalCollected &&
                        CurrencyFormatter(collector.totalCollected)}{" "}
                      LKR
                    </span>
                  </p>

                  <p className="flex gap-1 col-span-2 lg:col-span-1">
                    <span className="capitalize">
                      {collector.isTodayWorkingDay ? "Working" : "Not Working"}
                    </span>
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
