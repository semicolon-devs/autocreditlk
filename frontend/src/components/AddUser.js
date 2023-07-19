import React, { useState } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import { TextInput } from "../components/FormikElements";
import SectionSubtitle from "../components/SectionSubtitle";

const AddUser = () => {
  const [loading, setLoading] = useState(false);
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
            .max(20, "Must be 20 characters or less")
            .required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          mobileNo: Yup.string()
            .matches(/^[0-9]{10}$/, "Must be a valid mobile number")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
