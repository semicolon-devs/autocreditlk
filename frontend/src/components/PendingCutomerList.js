import React, { useState } from "react";
import SectionSubtitle from "../components/SectionSubtitle";
import axios from "axios";
import { CloseIcon } from "../Icons/Icon";
import DeleteUserModal from "../modals/DeleteUserModal";
import { ThreeDots } from "react-loader-spinner";
import Cookies from "universal-cookie";
import BASE_URL from "../config/ApiConfig";
import DeleteCustomerModal from "../modals/DeleteCustomerModal";

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
      <div className="flex flex-col items-center justify-center">
        {!loading ? (
          pendingCustomers &&
          pendingCustomers.map((user) => (
            <div
              className="bg-yellow w-full rounded-lg p-3 mb-3 flex justify-between items-center"
              key={user._id}
            >
              <div className="">
                <p className="text-maroon capitalize text-lg font-semibold leading-none">
                  {user.name}
                </p>
                <p className="text-maroon ">{user.email}</p>
                <p className="text-maroon leading-none">{user.phone}</p>
                <button className="bg-red hover:bg-purple-800 mt-4 px-5 py-1 rounded-lg">
                  <p
                    className="text-white uppercase font-semibold"
                    onClick={() => handleApproveUserClick(user)}
                  >
                    Approve
                  </p>
                </button>
              </div>
              <div className="">
                <button
                  className="outline-none border-none"
                  onClick={() => handleDeletePendingUserClick(user)}
                >
                  <CloseIcon className="text-maroon" />
                </button>
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
  );
};

export default PendingCustomerList;
