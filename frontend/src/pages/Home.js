import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HomePageCard from "../components/HomePageCard";
// import AddPaymentModal from "../components/AddPaymentModal";

import { customerArr } from "../data/SampleData";

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/debtor-details");
  };

  return (
    <div className="bg-light">
      <div className="">
        <div className="flex">
          <div className="bg-white drop-shadow-lg w-80 rounded-md p-3 font-semibold">
            Search by loanID
          </div>
          <div className="bg-maroon drop-shadow-lg rounded-md p-3 ml-2 flex justify-center items-center">
            <span className="material-symbols-outlined text-white">search</span>
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {customerArr &&
              customerArr.map((customer) => (
                <HomePageCard
                  key={customer.loanId}
                  customer={customer}
                  handleCardClick={handleCardClick}
                />
              ))}
          </div>
        </div>
        {/* <AddPaymentModal
        addPaymentModalShow={addPaymentModalShow}
        setAddPaymentModalShow={setAddPaymentModalShow}
      /> */}
      </div>
    </div>
  );
};

export default Home;
