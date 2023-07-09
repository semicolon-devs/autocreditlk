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
    <div
      className="bg-purple-50 p-3 my-4 rounded-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <p className="font-bold mb-2 text-purple-950">{loanId}</p>
      <p className="font-bold text-xl">{name}</p>
      <p className="">Total - {total}</p>
      <p className="">Arrears - {arrears}</p>
      <p className="text-sm">{description}</p>
      <button
        className="bg-purple-700 hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg"
        onClick={handleAddPaymentClick}
      >
        <p className="text-purple-50 uppercase font-semibold">add payment</p>
      </button>
    </div>
  );
};

export default HomePageCard;
