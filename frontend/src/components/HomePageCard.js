import React from "react";

const HomePageCard = ({
  loanId,
  name,
  total,
  arrears,
  description,
  handleCardClick,
  setAddPaymentModalShow,
}) => {
  const handleAddPaymentClick = () => {
    setAddPaymentModalShow(true);
  };

  return (
    <div className="bg-white w-full drop-shadow-lg p-3 rounded-lg flex flex-col justify-between">
      <div className="">
        <p className="font-bold mb-2 text-purple-950">{loanId}</p>
        <p className="font-bold text-xl">{name}</p>
        <p className="">Total - {total}</p>
        <p className="">Arrears - {arrears}</p>
        <p className="text-sm">{description}</p>
      </div>
      <div className="flex ">
        <button
          className="bg-maroon hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg mr-3"
          onClick={handleAddPaymentClick}
        >
          <p className="text-white uppercase font-semibold">add payment</p>
        </button>
        <button
          className="bg-orange hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg"
          onClick={handleCardClick}
        >
          <p className="text-white uppercase font-semibold">view details</p>
        </button>
      </div>
    </div>
  );
};

export default HomePageCard;
