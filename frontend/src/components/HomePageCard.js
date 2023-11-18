import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddPaymentModal from "../modals/AddPaymentModal";
import { CallNow } from "../Icons/Icon";
import BASE_URL from "../config/ApiConfig";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const HomePageCard = ({ customer }) => {
  const [addPaymentModalShow, setAddPaymentModalShow] = useState(false);
  const [displayCustomer, setDisplayCustomer] = useState(null);
  const [showArrears, setShowArrears] = useState();
  const [arrears, setArrears] = useState(0);
  const token = cookies.get("autoCreditCookie");
  const {
    customerID,
    name,
    NIC,
    loanAmount,
    paidAmount,
    phone,
    phoneTwo,
    billingCycle,
    installmentAmount,
  } = customer;

  const handleAddPaymentClick = (customer) => {
    setDisplayCustomer(customer);
    setAddPaymentModalShow(true);
  };

  const handleArrears = (customer) => {
    const fetchArrears = async (customerID) => {
      console.log(customerID);
      const axiosConfig = {
        method: "get",
        url: `${BASE_URL}customers/arrears/${customerID}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios(axiosConfig)
        .then((response) => {
          setArrears(response.data.arrears);
          setShowArrears(true);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    };
    fetchArrears(customer.customerID);
  };

  const isAdmin = () => {
    if (JSON.parse(localStorage.getItem("userRole")) === "admin") {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div className="bg-white w-full drop-shadow-lg p-3 rounded-lg flex flex-col justify-between">
      <div className="">
        <p className="font-bold mb-2 text-purple-950">{customerID}</p>
        <p className="font-bold text-xl">{name}</p>
        <p className="font-semibold">{NIC}</p>
        <p className="">
          Total - {loanAmount && CurrencyFormatter(loanAmount)} LKR
        </p>
        <p className="">
          Total Paid - {paidAmount && CurrencyFormatter(paidAmount)} LKR
        </p>
        <p className="">
          Mobile No. 1 - <CallNow /> <a href={"tel:" + phone}>{phone}</a>
        </p>
        <p className="">
          Mobile No. 2 - <CallNow /> <a href={"tel:" + phoneTwo}>{phoneTwo}</a>
        </p>
        <p className="">Billing Cycle - {billingCycle}</p>
        <p className="">
          Installment amount -{" "}
          {installmentAmount && CurrencyFormatter(installmentAmount)} LKR
        </p>
        {showArrears && (
          <p className="">
            Arrears - {arrears && CurrencyFormatter(arrears)} LKR
          </p>
        )}
        <button
          className="bg-maroon hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg"
          onClick={() => handleArrears(customer)}
        >
          <p className="text-white uppercase font-semibold">show arrears </p>
        </button>
      </div>
      <div className="flex gap-3">
        <button
          className="bg-orange hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg"
          onClick={() => handleAddPaymentClick(customer)}
        >
          <p className="text-white uppercase font-semibold">add installment</p>
        </button>
        {isAdmin() ? (
          <Link to={`customer-details/${customerID.toString()}`}>
            <button className="bg-maroon hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg">
              <p className="text-white uppercase font-semibold">view details</p>
            </button>
          </Link>
        ) : null}
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
