import React, { useState, useEffect } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import Cookies from "universal-cookie";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";
import EditAccountModal from "../modals/EditAccountModal";

import { TextInputWithLabel as TextInput } from "../components/FormikElements";
import { AccountIcon } from "../Icons/Icon";
import { buttonClasses, buttonTextClasses } from "../data/Classes";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const AccountSettings = () => {
  const [editDetailsModalShow, setEditDetailsModalShow] = useState(null);
  const [resetPasswordModalShow, setResetPasswordModalShow] = useState(null);
  const [userdata, setUserdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const token = cookies.get("autoCreditCookie");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data) {
      setUserdata(data);
    }
  }, []);

  const changePassword = async (currentPassword, password) => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${BASE_URL}auth/account-password-reset`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        email: userdata.email,
        password: currentPassword,
        newPassword: password,
      },
    };

    await axios(config)
      .then((res) => {
        cookies.remove("autoCreditCookie", { path: "/" });
        localStorage.removeItem("userRole");
        localStorage.removeItem("userData");
        window.location.href = "/";
      })
      .catch((res) => {
        // console.log(res);
        if (res.response.data == "Unauthorized") {
          setMessage("current password is incorrect");
        } else {
          setMessage(res.response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full">
      <SectionTitle title="account settings" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <SectionSubtitle title="account details" classes="text-center" />
          <div className="w-full max-w-max rounded-lg mx-auto text-center">
            <AccountIcon
              className="text-maroon opacity-75"
              sx={{ fontSize: 120 }}
            />
            <div className="flex flex-col mt-3">
              <div className="flex justify-between gap-x-6">
                <p className="font-semibold">Name</p>
                <p className="">{userdata.name}</p>
              </div>
              <div className="flex justify-between gap-x-6">
                <p className="font-semibold">Email</p>
                <p className="">{userdata.email}</p>
              </div>
              <div className="flex justify-between gap-x-6">
                <p className="font-semibold">Phone</p>
                <p className="">{userdata.phone}</p>
              </div>
            </div>
            <button
              className={`mt-3 ${buttonClasses}`}
              onClick={() => setEditDetailsModalShow(true)}
            >
              <p className={`${buttonTextClasses}`}>edit details</p>
            </button>
          </div>
        </div>
        {editDetailsModalShow && (
          <EditAccountModal
            modalShow={editDetailsModalShow}
            setModalShow={setEditDetailsModalShow}
            user={userdata}
          />
        )}
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <SectionSubtitle title="change password" />
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              currentPassword: Yup.string().required("Required"),
              newPassword: Yup.string()
                .required("Required")
                .min(8, "Your password is too short.")
                .matches(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                  "Password must contain at least one uppercase letter, one lowercase letter, one numeral, and one symbol."
                ),
              confirmPassword: Yup.string()
                .required("Required")
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              changePassword(values.currentPassword, values.newPassword);
              setSubmitting(false);
              resetForm({});
            }}
          >
            <Form className="w-full max-w-sm">
              <TextInput
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
              />

              <TextInput
                name="newPassword"
                type="password"
                placeholder="Enter new password"
              />

              <TextInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />

              {message && (
                <div className="border border-red rounded-lg p-3">
                  <p className="text-red">{message}</p>
                </div>
              )}

              <button
                type="submit"
                className={`mt-3 ${buttonClasses} flex items-center justify-center`}
              >
                {loading ? (
                  <ThreeDots
                    height="40"
                    width="40"
                    radius="9"
                    color="white"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                ) : (
                  <p className={`${buttonTextClasses}`}>change password</p>
                )}
              </button>
            </Form>
          </Formik>
        </div>
        {/* {resetPasswordModalShow && (
          <ResetPasswordConfirm
            modalShow={resetPasswordModalShow}
            setModalShow={setResetPasswordModalShow}
          />
        )} */}
      </div>
    </div>
  );
};

export default AccountSettings;
