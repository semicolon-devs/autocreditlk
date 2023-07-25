import { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Cookies from "universal-cookie";
import { ThreeDots } from "react-loader-spinner";

import { TextInput } from "../components/FormikElements";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  return (
    <div className=" bg-light flex justify-center items-center w-screen h-screen p-5">
      <div className="bg-white p-5 rounded-xl drop-shadow-lg w-full max-w-sm">
        <h2 className="text-dark uppercase text-center text-4xl font-bold mb-1">
          reset password
        </h2>
        <p className="text-dark uppercase text-center font-semibold mb-6">
          enter new password for your account
        </p>
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
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
            setSubmitting(false);
            resetForm({});
          }}
        >
          <Form>
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
              <div className="">
                <p className="">{message}</p>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;