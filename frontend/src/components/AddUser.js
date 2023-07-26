import React, { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import { TextInput } from "../components/FormikElements";
import SectionSubtitle from "../components/SectionSubtitle";

import Cookies from "universal-cookie";

const cookies = new Cookies();

const AddUser = ({ setPendingUsers }) => {
  const [loading, setLoading] = useState(false);

  const token = cookies.get("autoCreditCookie");

  const addNewUser = (name, email, mobileNo) => {
    setLoading(true);
    const axiosConfig = {
      method: "post",
      url: `http://localhost:8080/api/v1/auth/add-user`,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
      data: {
        name: name,
        email: email,
        phone: mobileNo,
      },
    };
    axios(axiosConfig)
      .then((response) => {
        console.log(response);
        setPendingUsers((prev) => [...prev, response.data.result]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="">
      <SectionSubtitle title="add user" />
      <Formik
        initialValues={{
          name: "",
          email: "",
          mobileNo: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          mobileNo: Yup.string()
            .matches(/^[0-9]{10}$/, "Must be a valid mobile number")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          addNewUser(values.name, values.email, values.mobileNo);
          setSubmitting(false);
          resetForm({});
        }}
      >
        <Form className="">
          <TextInput name="name" type="text" placeholder="Enter user name" />

          <TextInput name="email" type="email" placeholder="Enter user email" />

          <TextInput
            name="mobileNo"
            type="text"
            placeholder="Enter user mobile number"
          />

          <button
            type="submit"
            className="bg-maroon w-full rounded-lg flex items-center justify-center p-3"
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
              <p className="text-center text-white uppercase font-semibold ">
                create user
              </p>
            )}
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddUser;
