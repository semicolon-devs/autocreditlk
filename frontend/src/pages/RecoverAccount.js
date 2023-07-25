import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import Cookies from "universal-cookie";
import { ThreeDots } from "react-loader-spinner";

import { TextInput } from "../components/FormikElements";
import SectionTitle from "../components/SectionTitle";

const RecoverAccount = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mobileNumberAreaShow, setMobileNumberAreaShow] = useState(false);

  const handleResetRequest = () => {
    // axios here
  };

  return (
    <div className="bg-light w-screen h-screen p-5 flex flex-col">
      <SectionTitle title="recover account" />
      <div className="bg-white p-3 rounded-xl drop-shadow-lg grow">
        <p className="">
          If you have forgotten your password, please enter the email linked
          with your account
        </p>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // handleResetRequest(values.email);
            setSubmitting(false);
            resetForm({});
          }}
        >
          <Form className="mt-3 w-full max-w-md">
            <TextInput
              name="email"
              type="email"
              placeholder="Enter your email"
            />

            <button
              type="submit"
              className="bg-maroon rounded-lg py-2 px-3 flex items-center justify-center"
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
                <p className="text-white font-semibold capitalize">
                  reset password
                </p>
              )}
            </button>

            {message && (
              <div className="">
                <p className="">{message}</p>
              </div>
            )}
          </Form>
        </Formik>
        {/* {mobileNumberAreaShow && ( */}
        <div className="mt-3">
          <p className="">
            An OTP will be sent to your mobile number{" "}
            <span className="">*******739</span>. Please enter the received OTP
          </p>
          <input
            type="number"
            className="w-full max-w-sm border-darkGrey border rounded-lg text-center mt-3 p-2"
          />
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default RecoverAccount;
