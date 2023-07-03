import { useState } from "react";
import axios from "axios";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import Cookies from "universal-cookie";
import { ThreeDots } from "react-loader-spinner";

const cookies = new Cookies();

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <input
          className="text-input w-full rounded-xl px-4 py-2 mb-4 outline-none text-purple-950"
          {...field}
          {...props}
          style={{
            border: meta.touched && meta.error ? "1px solid #b91c1c" : "",
          }}
        />
        {meta.touched && meta.error ? (
          <div className={`error -mt-3 mb-3 ms-4 text-red-700 font-bold`}>{meta.error}</div>
        ) : null}
      </>
    );
  };

  return (
    <div className=" bg-gradient-to-b from-purple-600 to-purple-700 flex justify-center items-center w-screen h-screen">
      <div className="bg-purple-100 p-5 rounded-xl border-b-purple-950 border-b-4 w-11/12 max-w-sm">
        <p className="text-purple-950 uppercase text-center text-4xl font-bold mb-1">sign in</p>
        <p className="text-purple-950 uppercase text-center text-lg font-bold mb-6">debtor management system</p>
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

            <button type="submit" className="bg-purple-950 hover:bg-purple-900 rounded-xl px-4 py-2">
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
