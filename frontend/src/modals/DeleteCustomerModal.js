import React from "react";
import axios from "axios";

import AlertModal from "./AlertModal";

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
    <AlertModal
      modalShow={modalShow}
      setModalShow={setModalShow}
      message={`Are you sure you want to remove ${customer.name} from the system ?`}
      primaryButtonText="remove"
      primaryButtonClick={removeButtonClick}
    />
  );
};

export default DeleteCustomerModal;
