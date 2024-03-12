import React, { useState, useEffect } from "react";
import axios from "axios";

import SectionTitle from "../components/SectionTitle";
import AddUser from "../components/AddUser";
import UserList from "../components/UserList";
import PendingUserList from "../components/PendingUserList";

import BASE_URL from "../config/ApiConfig";

import Cookies from "universal-cookie";
import PendingCustomerList from "../components/PendingCutomerList";

const cookies = new Cookies();

const PendingCustomers = () => {
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = cookies.get("autoCreditCookie");

  useEffect(() => {
    const fetchPendingCustomers = async () => {
      setLoading(true);
      const axiosConfig = {
        method: "get",
        url: `${BASE_URL}customers/pending`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios(axiosConfig)
        .then((response) => {
          setPendingCustomers(response.data.customers);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchPendingCustomers();
  }, []);

  return (
    <div className="w-full">
      <SectionTitle title="pending customers" />
      <div className="lg:grid-cols-1 gap-5">
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <PendingCustomerList
            pendingCustomers={pendingCustomers}
            setPendingCustomers={setPendingCustomers}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default PendingCustomers;
