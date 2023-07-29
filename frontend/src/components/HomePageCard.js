import React, { useState } from "react";
import { Link } from "react-router-dom";

import AddPaymentModal from "../modals/AddPaymentModal";

const HomePageCard = ({ customer }) => {
  const [addPaymentModalShow, setAddPaymentModalShow] = useState(false);
  const [displayCustomer, setDisplayCustomer] = useState(null);

  const { loanId, name, NIC, total, arrears, totalPaid } = customer;

  const handleAddPaymentClick = (customer) => {
    setDisplayCustomer(customer);
    setAddPaymentModalShow(true);
  };

  return (
    <div className="bg-white w-full drop-shadow-lg p-3 rounded-lg flex flex-col justify-between">
      <div className="">
        <p className="font-bold mb-2 text-purple-950">#{loanId}</p>
        <p className="font-bold text-xl">{name}</p>
        <p className="font-semibold">{NIC}</p>
        <p className="">Total - {total}</p>
        <p className="">Total Paid - {totalPaid}</p>
        <p className="">Arrears - {arrears}</p>
        {/* <p className="text-sm">{description}</p> */}
      </div>
      <div className="flex ">
        <button
          className="bg-orange hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg mr-3"
          onClick={() => handleAddPaymentClick(customer)}
        >
          <p className="text-white uppercase font-semibold">add payment</p>
        </button>
        <Link to={`customer-details/${loanId.toString()}`}>
          <button className="bg-maroon hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg">
            <p className="text-white uppercase font-semibold">view details</p>
          </button>
        </Link>
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
