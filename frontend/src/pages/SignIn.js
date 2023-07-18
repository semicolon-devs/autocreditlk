import { useState } from "react";
import axios from "axios";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import Cookies from "universal-cookie";
import { ThreeDots } from "react-loader-spinner";

import { TextInput } from "../components/FormikElements";

const cookies = new Cookies();

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  return (
    <div className=" bg-gradient-to-b from-purple-400 to-purple-500 flex justify-center items-center w-screen h-screen">
      <div className="bg-purple-100 p-5 rounded-xl border-b-purple-900 border-b-4 w-11/12 max-w-sm">
        <p className="text-purple-900 uppercase text-center text-4xl font-bold mb-1">
          sign in
        </p>
        <p className="text-purple-900 uppercase text-center font-semibold mb-6">
          sign in to view and manage clients
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
            // signIn(values.email, values.password);
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

            {message && (
              <div className="">
                <p className="">{message}</p>
              </div>
            )}

            <button
              type="submit"
              className="bg-purple-900 hover:bg-purple-950 rounded-xl px-4 py-2"
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
                <p className="text-purple-50 uppercase font-bold">sign in</p>
              )}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
