import React, { useState, useEffect } from "react";
import axios from "axios";

import SectionTitle from "../components/SectionTitle";
import AddUser from "../components/AddUser";
import UserList from "../components/UserList";
import PendingUserList from "../components/PendingUserList";

import Cookies from "universal-cookie";

const cookies = new Cookies();

const ManageUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(pendingUsers);

  const token = cookies.get("autoCreditCookie");

  useEffect(() => {
    const fetchPendingUsers = async () => {
      setLoading(true);
      const axiosConfig = {
        method: "get",
        url: `http://localhost:8080/api/v1/auth/pending-users`,
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      };

      axios(axiosConfig)
        .then((response) => {
          setPendingUsers(response.data.pendingUsers);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchPendingUsers();
  }, []);

  return (
    <div className="w-full">
      <SectionTitle title="manage users" />
      <div className="bg-white w-full rounded-lg drop-shadow-lg p-3 mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AddUser setPendingUsers={setPendingUsers} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <UserList />
        </div>
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <PendingUserList
            pendingUsers={pendingUsers}
            setPendingUsers={setPendingUsers}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
