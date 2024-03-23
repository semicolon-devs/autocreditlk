import React, { useState } from "react";
import SectionSubtitle from "../components/SectionSubtitle";
import axios from "axios";
import { CloseIcon } from "../Icons/Icon";
import DeleteUserModal from "../modals/DeleteUserModal";
import { ThreeDots } from "react-loader-spinner";
import Cookies from "universal-cookie";
import BASE_URL from "../config/ApiConfig";
import DeleteCustomerModal from "../modals/DeleteCustomerModal";
import { CurrencyFormatter } from "../utils/CurrencyFormatter";
import { CallNow } from "../Icons/Icon";
import { Link } from "react-router-dom";

const cookies = new Cookies();
const token = cookies.get("autoCreditCookie");

const PendingCustomerList = ({
  pendingCustomers,
  setPendingCustomers,
  loading,
}) => {
  const [displayUser, setDisplayUser] = useState(null);
  const [DeletePendingUserModalShow, setDeletePendingUserModalShow] =
    useState(false);

  const handleApproveUserClick = (user) => {
    const axiosConfig = {
      method: "put",
      url: `${BASE_URL}customers/approve/${user.customerID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(axiosConfig)
      .then((response) => {
        console.log(response);
        const updatedUserList = pendingCustomers.filter(
          (pendingUser) => pendingUser._id !== user._id
        );
        setPendingCustomers(updatedUserList);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const handleDeletePendingUserClick = (user) => {
    setDisplayUser(user);
    setDeletePendingUserModalShow(true);
  };

  return (
    <div>
      <SectionSubtitle title="pending users" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        <div className="flex items-center justify-center gap-3">
          {!loading ? (
            pendingCustomers &&
            pendingCustomers.map((user) => (
              <div className="bg-white w-full drop-shadow-lg p-3 rounded-lg flex flex-col justify-between">
                <div className="">
                  <p className="font-bold mb-2 text-purple-950">
                    {user.customerID}
                  </p>
                  <p className="font-bold text-xl">{user.name}</p>
                  <p className="font-semibold">{user.NIC}</p>
                  <p className="">
                    Total -{" "}
                    {user.loanAmount && CurrencyFormatter(user.loanAmount)} LKR
                  </p>
                  <p className="">
                    customerID Mobile No. 1 - <CallNow />{" "}
                    <a href={"tel:" + user.phone}>{user.phone}</a>
                  </p>
                  <p className="">Billing Cycle - {user.billingCycle}</p>
                  <p className="">
                    Installment amount -{" "}
                    {user.installmentAmount &&
                      CurrencyFormatter(user.installmentAmount)}{" "}
                    LKR
                  </p>
                  <p className="font-semibold">Added By : {user.addedBy}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="bg-green hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg"
                    onClick={() => handleApproveUserClick(user)}
                  >
                    <p className="text-white uppercase font-semibold">
                      Approve
                    </p>
                  </button>
                  <button
                    className="bg-red hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg"
                    onClick={() => handleDeletePendingUserClick(user)}
                  >
                    <p className="text-white uppercase font-semibold">Delete</p>
                  </button>
                  <a href={`/customer-details/${user.customerID.toString()}`}>
                    <button className="bg-maroon hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg">
                      <p className="text-white uppercase font-semibold">
                        view details
                      </p>
                    </button>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <ThreeDots
              height="40"
              width="40"
              radius="9"
              color="#808080"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          )}
        </div>
        {displayUser && (
          <DeleteCustomerModal
            modalShow={DeletePendingUserModalShow}
            setModalShow={setDeletePendingUserModalShow}
            customer={displayUser}
          />
        )}
      </div>
    </div>
  );
};

export default PendingCustomerList;
