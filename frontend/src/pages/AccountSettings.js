import React, { useState } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import Cookies from "universal-cookie";

import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";
import EditAccountModal from "../modals/EditAccountModal";

import { TextInputWithLabel as TextInput } from "../components/FormikElements";
import { AccountIcon } from "../Icons/Icon";
import { buttonClasses, buttonTextClasses } from "../data/Classes";
import ResetPasswordConfirm from "../modals/ResetPasswordConfirm";

const cookies = new Cookies();

const AccountSettings = () => {
  const [editDetailsModalShow, setEditDetailsModalShow] = useState(null);
  const [resetPasswordModalShow, setResetPasswordModalShow] = useState(null);

  const cookie = cookies.get("autoCreditCookie");

  // change password axio here

  return (
    <div className="w-full">
      <SectionTitle title="account settings" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <SectionSubtitle title="account details" classes="text-center" />
          <div className="w-full max-w-max rounded-lg mx-auto text-center">
            <AccountIcon
              className="text-maroon opacity-75"
              sx={{ fontSize: 120 }}
            />
            <div className="flex flex-col mt-3">
              <div className="flex justify-between gap-x-4">
                <p className="font-semibold">Name</p>
                <p className="">Saman Kumara</p>
              </div>
              <div className="flex justify-between gap-x-4">
                <p className="font-semibold">Email</p>
                <p className="">samankumara@gmail.com</p>
              </div>
              <div className="flex justify-between gap-x-4">
                <p className="font-semibold">Phone</p>
                <p className="">076 125 4783</p>
              </div>
              <div className="flex justify-between gap-x-4">
                <p className="font-semibold">Address</p>
                <p className="">Penideniya, Peradeniya, Kandy</p>
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
            onSubmit={(values, { setSubmitting }) => {
              //   call change password axio here ==> changePassword(values.oldPassword, values.newPassword)
              setSubmitting(false);
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

              <button type="submit" className={`mt-3 ${buttonClasses}`}>
                <p className={`${buttonTextClasses}`}>reset password</p>
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
