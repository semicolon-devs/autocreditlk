import { useState } from "react";
import axios from "axios";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import { TextInput } from "../components/FormikElements";
import SectionTitle from "../components/SectionTitle";

import BASE_URL from "../config/ApiConfig";

const RecoverAccount = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleResetRequest = async (email) => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${BASE_URL}auth/forget-password-request`,
      data: {
        email: email,
      },
    };

    await axios(config)
      .then((res) => {
        localStorage.setItem("forgotPasswordEmail", email);
        window.location.href = "/forgot-password-reset";
      })
      .catch((res) => {
        setMessage(res.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
            handleResetRequest(values.email);
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

            {message && (
              <div className="border border-red p-3 rounded-lg mb-3">
                <p className="text-red">{message}</p>
              </div>
            )}

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
          </Form>
        </Formik>
        <p className="text-grey italic mt-3">
          Click here to reset your password your account. An auto-generated
          password will be sent to your mobile number.
        </p>
      </div>
    </div>
  );
};

export default RecoverAccount;
