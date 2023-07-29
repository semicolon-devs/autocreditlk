import { useEffect, useState } from "react";

import HomePageCard from "../components/HomePageCard";
// import AddPaymentModal from "../components/AddPaymentModal";

import { customerArr } from "../data/SampleData";
import { SearchIcon } from "../Icons/Icon";

const Home = () => {
  const [searchField, setSearchField] = useState("");

  const filteredCustomerArr = customerArr.filter((customer) => {
    return (
      customer.loanId.includes(searchField) ||
      customer.name.toLowerCase().includes(searchField.toLowerCase()) ||
      customer.NIC.toLowerCase().includes(searchField.toLowerCase())
    );
  });

  const filtered = filteredCustomerArr.map((customer) => (
    <HomePageCard key={customer.loanId} customer={customer} />
  ));

  return (
    <div className="bg-light">
      <div className="">
        <div className="flex">
          <input
            type="string"
            className="bg-white drop-shadow-lg w-80 rounded-md p-3 font-semibold outline-none border-none"
            placeholder="Search by loandID or name"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          />
          <div className="bg-maroon drop-shadow-lg rounded-md p-3 ml-2 flex justify-center items-center">
            <SearchIcon className="text-white" />
          </div>
        </div>
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {filtered}
          </div>
        </div>
        {/* <AddPaymentModal
        addPaymentModalShow={addPaymentModalShow}
        setAddPaymentModalShow={setAddPaymentModalShow}
      /> */}
      </div>
    </div>
  );
};

export default Home;
