import { useEffect, useState } from "react";
import axios from "axios";

import HomePageCard from "../components/HomePageCard";
// import AddPaymentModal from "../components/AddPaymentModal";

import { SearchIcon } from "../Icons/Icon";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const Home = () => {
  const [searchField, setSearchField] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = cookies.get("autoCreditCookie");

  // console.log(customers);
  // console.log(searchField);

  useEffect(() => {
    const getCustomers = () => {
      setLoading(true);
      const axiosConfig = {
        method: "get",
        url: `${BASE_URL}customers/all`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios(axiosConfig)
        .then((response) => {
          // console.log(response);
          setCustomers(response.data.customers);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.customerID.includes(searchField) ||
      customer.name.toLowerCase().includes(searchField.toLowerCase()) ||
      customer.NIC.toLowerCase().includes(searchField.toLowerCase())
    );
  });

  const filtered = filteredCustomers.map((customer) => (
    <HomePageCard key={customer._id} customer={customer} />
  ));

  return (
    <div className="bg-light">
      <div className="">
        <div className="grid sm:grid-cols-2 gird-cols-1 gap-3">
          <div className="flex sm:max-w-xs w-full">
            <input
              type="string"
              className="bg-white drop-shadow-lg rounded-md p-3 font-semibold outline-none border-none w-full"
              placeholder="Search"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
            <div className="bg-maroon drop-shadow-lg rounded-md p-3 ml-2 flex justify-center items-center">
              <SearchIcon className="text-white" />
            </div>
          </div>
          <div className="flex justify-end items-center">
            <div className="bg-white drop-shadow-lg rounded-md p-3 font-semibold sm:w-max w-full">
              <p className="">{customers.length} Customers</p>
            </div>
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {filtered}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
