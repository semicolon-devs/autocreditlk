import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Cookies from "universal-cookie";
import { ThreeDots } from "react-loader-spinner";

import { TextInput } from "../components/FormikElements";

import BASE_URL from "../config/ApiConfig";

import logo from "../assets/AutoCreditLogo.png";

const cookies = new Cookies();

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const signIn = async (email, password) => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${BASE_URL}auth/login`,
      data: {
        email: email,
        password: password,
      },
    };

    await axios(config)
      .then((res) => {
        if (res.data.token) {
          cookies.set("autoCreditCookie", res.data.token, {
            path: "/",
          });
          localStorage.setItem("userData", JSON.stringify(res.data.userData));
          window.location.href = "/";
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((res) => {
        setMessage(res.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className=" bg-light flex justify-center items-center w-screen h-screen p-5">
      <div className="bg-white p-5 rounded-xl drop-shadow-lg w-full max-w-sm">
        <div className="w-full flex items-center justify-center mb-3">
          <img src={logo} className="w-1/2" alt="Auto Credit LK logo" />
        </div>
        {/* <h3 className="text-dark uppercase text-center text-4xl font-bold mb-1">
          sign in
        </h3> */}
        <p className="text-dark uppercase text-center font-semibold mb-3">
          sign in to view and manage customers
        </p>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            signIn(values.email, values.password);
            setSubmitting(false);
          }}
        >
          <Form className="flex flex-col w-full ">
            <TextInput
              name="email"
              type="email"
              placeholder="Enter your email"
            />

            <TextInput
              name="password"
              type="password"
              placeholder="Enter password"
            />

            <p className="mb-3 italic">
              Forgot your password ?{" "}
              <Link to="/recover-account">
                <span className="text-orange capitalize underline">
                  click here
                </span>
              </Link>
            </p>

            {message && (
              <div className="w-full border border-orange rounded-lg p-3 mb-3">
                <p className="text-orange">{message}</p>
              </div>
            )}

            <button
              type="submit"
              className="bg-maroon rounded-lg px-4 py-2 flex items-center justify-center"
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
                <p className="text-white uppercase font-bold">sign in</p>
              )}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
