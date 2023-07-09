import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HomePageCard from "../components/HomePageCard";
// import AddPaymentModal from "../components/AddPaymentModal";

const Home = () => {
  const [addPaymentModalShow, setAddPaymentModalShow] = useState(false);

  const debtorArr = [
    {
      loanId: "#0548",
      name: "Saman Bandara",
      total: "200,000 LKR",
      arrears: "80,000 LKR",
      description:
        "Lorem ipsum dolor sit amet, consector adipiscing elit, sed do eiusmod tempor incididun...",
    },
    {
      loanId: "#0600",
      name: "Sunil Shantha",
      total: "400,000 LKR",
      arrears: "80,000 LKR",
      description:
        "Lorem ipsum dolor sit amet, consector adipiscing elit, sed do eiusmod tempor incididun...",
    },
    {
      loanId: "#0700",
      name: "Lalith Kumara",
      total: "50,000 LKR",
      arrears: "10,000 LKR",
      description:
        "Lorem ipsum dolor sit amet, consector adipiscing elit, sed do eiusmod tempor incididun...",
    },
    {
      loanId: "#0547",
      name: "Saman Bandara",
      total: "200,000 LKR",
      arrears: "80,000 LKR",
      description:
        "Lorem ipsum dolor sit amet, consector adipiscing elit, sed do eiusmod tempor incididun...",
    },
    {
      loanId: "#0601",
      name: "Saman Bandara",
      total: "200,000 LKR",
      arrears: "80,000 LKR",
      description:
        "Lorem ipsum dolor sit amet, consector adipiscing elit, sed do eiusmod tempor incididun...",
    },
    {
      loanId: "#0701",
      name: "Saman Bandara",
      total: "200,000 LKR",
      arrears: "80,000 LKR",
      description:
        "Lorem ipsum dolor sit amet, consector adipiscing elit, sed do eiusmod tempor incididun...",
    },
  ];
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/debtor-details");
  };

  return (
    <div className="bg-purple-200 min-w-screen">
      <div className="p-3">
        <div className="flex justify-between">
          <div className="flex">
            <div className="w-60 bg-purple-50 rounded-md px-3 py-1 font-semibold">
              Search
            </div>
            <div className="bg-purple-800 rounded-md py-1 px-2 ml-2 flex justify-center items-center">
              <span className="material-symbols-outlined text-purple-50">
                search
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {debtorArr &&
            debtorArr.map((debtor) => (
              <HomePageCard
                key={debtor.loanId}
                loanId={debtor.loanId}
                name={debtor.name}
                total={debtor.total}
                arrears={debtor.arrears}
                description={debtor.description}
                handleCardClick={handleCardClick}
                setAddPaymentModalShow={setAddPaymentModalShow}
              />
            ))}
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
