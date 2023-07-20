import React, { useState } from "react";

import AddPaymentModal from "../modals/AddPaymentModal";

const HomePageCard = ({ customer, handleCardClick }) => {
  const [addPaymentModalShow, setAddPaymentModalShow] = useState(false);
  const [displayCustomer, setDisplayCustomer] = useState(null);

  const { loanId, name, total, arrears, description } = customer;

  const handleAddPaymentClick = (customer) => {
    setDisplayCustomer(customer);
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
          onClick={() => handleAddPaymentClick(customer)}
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
      {displayCustomer && (
        <AddPaymentModal
          modalShow={addPaymentModalShow}
          setModalShow={setAddPaymentModalShow}
          customer={displayCustomer}
        />
      )}
    </div>
  );
};

export default HomePageCard;
