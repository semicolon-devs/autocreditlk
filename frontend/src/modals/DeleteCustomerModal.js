import React from "react";
import axios from "axios";

import DeleteAlertModal from "./DeleteAlertModal";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const DeleteCustomerModal = ({ modalShow, setModalShow, customer }) => {
  const token = cookies.get("autoCreditCookie");

  const deleteCustomer = () => {
    console.log(customer.customerID);
    const axiosConfig = {
      method: "DELETE",
      url: `${BASE_URL}customers/${customer.customerID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(axiosConfig)
      .then((res) => {
        // console.log(res);
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeButtonClick = () => {
    deleteCustomer();
    setModalShow(false);
  };

  return (
    <DeleteAlertModal
      modalShow={modalShow}
      setModalShow={setModalShow}
      primaryButtonText="remove"
      primaryButtonClick={removeButtonClick}
    />
  );
};

export default DeleteCustomerModal;
