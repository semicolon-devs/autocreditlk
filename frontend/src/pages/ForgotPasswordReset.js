import { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import { TextInput } from "../components/FormikElements";

import logo from "../assets/AutoCreditLogo.png";

import BASE_URL from "../config/ApiConfig";

const ForgotPasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const email = localStorage.getItem("forgotPasswordEmail");

  const resetPassword = async (tempPassword, password) => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${BASE_URL}auth/forget-password-reset`,
      data: {
        email: email,
        tempPassword: tempPassword,
        newPassword: password,
      },
    };

    await axios(config)
      .then((res) => {
        console.log(res);
        localStorage.clear();
        window.location.href = "/sign-in";
      })
      .catch((res) => {
        // setMessage(res.response.data);
        console.log(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const checkForEmail = () => {
    // if (localStorage.getItem("resetPasswordEmail"))
  };

  return (
    <div className=" bg-light flex justify-center items-center w-screen h-screen p-5">
      <div className="bg-white p-5 rounded-xl drop-shadow-lg w-full max-w-sm">
        {/* <h2 className="text-dark uppercase text-center text-4xl font-bold mb-1">
          reset password
        </h2> */}
        <div className="w-full flex items-center justify-center mb-3">
          <img src={logo} className="w-1/2" alt="Auto Credit LK logo" />
        </div>
        <p className="text-dark uppercase text-center font-semibold mb-3">
          enter new password
        </p>
        <Formik
          initialValues={{
            tempPassword: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            tempPassword: Yup.string().required("Required"),
            password: Yup.string()
              .required("Required")
              .min(8, "Your password is too short.")
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one numeral, and one symbol."
              ),
            confirmPassword: Yup.string()
              .required("Required")
              .oneOf([Yup.ref("password")], "Passwords must match"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // handlePasswordReset(values.password);
            resetPassword(values.tempPassword, values.password);
            setSubmitting(false);
            resetForm({});
          }}
        >
          <Form>
            <TextInput
              name="tempPassword"
              type="password"
              placeholder="Enter auto-generated password"
            />

            <TextInput
              name="password"
              type="password"
              placeholder="Enter new password"
            />

            <TextInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
            />

            <button
              type="submit"
              className="bg-maroon w-full rounded-lg px-4 py-2 flex items-center justify-center"
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
                <p className="text-white uppercase font-bold">
                  change password
                </p>
              )}
            </button>

            {message && (
              <div className="w-full border border-orange rounded-lg mt-3 p-3">
                <p className="text-orange">{message}</p>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPasswordReset;
