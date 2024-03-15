import React, { useEffect, useState } from "react";
import axios from "axios";

import HomePageCard from "../components/HomePageCard";
// import AddPaymentModal from "../components/AddPaymentModal";

import { SearchIcon } from "../Icons/Icon";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const cookies = new Cookies();

const Home = () => {
  const [searchField, setSearchField] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = cookies.get("autoCreditCookie");

  const [billingCycle, setBillingCycle] = React.useState("");
  const [collector, setCollector] = React.useState([]);

  const handleBillingFilter = (event) => {
    setBillingCycle(event.target.value);
  };

  const handleCollectorFilter = (event) => {
    setCollector(event.target.value);
  };

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
          console.log(response.data.customers);
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

  useEffect(() => {
    const fetchCollectors = async () => {
      const axiosConfig = {
        method: "get",
        url: `${BASE_URL}collector/collectors`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios(axiosConfig)
        .then((res) => {
          setCollector(res.data.collectors);
          // const IdArr = res.data.collectors.map((collector) => collector._id);
          // setCollectorIdArr(IdArr);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchCollectors();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.customerID.includes(searchField) ||
      customer.name.toLowerCase().includes(searchField.toLowerCase()) ||
      customer.NIC.toLowerCase().includes(searchField.toLowerCase())
    );
  });

  const filtered = filteredCustomers.map((customer) => (
    // <HomePageCard key={customer._id} customer={customer} />
    <HomePageCard key={customer._id} customer={customer} />
  ));

  return (
    <div className="bg-light">
      <div className="">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex sm:max-w-xs lg:max-w-auto">
            <input
              type="string"
              className="bg-white drop-shadow-lg rounded-md p-3 font-semibold outline-none border-none w-full"
              placeholder="Search"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            />
            <div className="bg-maroon drop-shadow-lg rounded-md p-3 ml-2 justify-center items-center">
              <SearchIcon className="text-white" />
            </div>
          </div>

          <div className="flex justify-center items-center">
            <Box sx={{ minWidth: 220 }}>
              <FormControl fullWidth>
                <InputLabel id="billingcycle-input-label">
                  Billing Cycle
                </InputLabel>
                <Select
                  labelId="billingcycle-label"
                  id="billingcycle"
                  value={billingCycle}
                  label="Billing Cycle"
                  onChange={handleBillingFilter}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          <div className="flex justify-start items-center">
            <Box sx={{ minWidth: 220 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Collector</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={collector}
                  label="Collector"
                  onChange={handleCollectorFilter}
                >
                  {collector &&
                    collector.map((collector) => (
                      <MenuItem value={collector._id} key={collector._id}>
                        {collector.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
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
