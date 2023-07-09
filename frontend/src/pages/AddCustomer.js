import { useState } from "react";
import axios from "axios";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import SectionTitle from "../components/SectionTitle";

const AddCustomer = () => {
  const [loading, setLoading] = useState(false);

  const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <label className="font-semibold mb-2" htmlFor={props.id || props.name}>
          {label}
        </label>
        <input
          className="text-input w-full rounded-lg px-3 py-2 mb-4 outline-none"
          {...field}
          {...props}
          style={{
            border: meta.touched && meta.error ? "1px solid #b91c1c" : "",
          }}
        />
        {meta.touched && meta.error ? (
          <div className="error -mt-3 mb-2 ms-2 text-red-700 font-bold">
            {meta.error}
          </div>
        ) : null}
      </>
    );
  };

  const Select = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div>
        <label className="font-semibold" htmlFor={props.id || props.name}>
          {label}
        </label>
        <select
          className="text-input w-full rounded-lg px-2 py-2 mt-2 mb-4 outline-none"
          {...field}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="error -mt-3 mb-2 ms-2 text-red-700 font-bold">
            {meta.error}
          </div>
        ) : null}
      </div>
    );
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be a valid mobile number")
      .required("Required"),
    address: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    loanAmount: Yup.number()
      .typeError("Must be a number")
      .positive("Must be a positive number")
      .required("Required"),
    duration: Yup.number()
      .typeError("Must be a number")
      .positive("Must be a positive number")
      .required("Required"),
    startDate: Yup.date().required("Required"),
    billingCycle: Yup.string()
      .oneOf(["Daily", "Weekly", "Monthly"], "Invalid selection")
      .required("Required"),
    guarantorName: Yup.string().required("Required"),
    guarantorMobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be a valid mobile number")
      .required("Required"),
  });

  return (
    <div className="">
      <SectionTitle title="add new customer" />
      <Formik
        initialValues={{
          name: "",
          mobileNo: "",
          address: "",
          loanAmount: "",
          duration: "",
          startDate: "",
          billingCycle: "",
          guarantorName: "",
          guarantorMobileNo: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setSubmitting(false);
        }}
      >
        <Form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="w-full lg:max-w-md">
            <TextInput
              name="name"
              type="text"
              label="Name :"
              placeholder="Saman Kumara"
            />

            <TextInput
              name="mobileNo"
              type="text"
              label="Mobile No. :"
              placeholder="07x xxx xxxx"
            />

            <TextInput
              name="address"
              type="text"
              label="Address :"
              placeholder="55, Daulagala Road, Penideniya, Peradeniya"
            />

            <TextInput
              name="loanAmount"
              type="number"
              label="Loan amount :"
              placeholder="50,000"
            />

            <TextInput
              name="duration"
              type="number"
              label="Loan Duration (months) :"
              placeholder="6"
            />

            <TextInput
              name="startDate"
              type="date"
              label="Start Date :"
              placeholder="01/08/2023"
            />

            <Select label="Billing Cycle" name="billingCycle">
              <option value="">Select billing cycle</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </Select>
          </div>
          <div className="w-full lg:max-w-md">
            <TextInput
              name="guarantorName"
              type="text"
              label="Guarantor Name :"
              placeholder="Sunil Shantha"
            />

            <TextInput
              name="guarantorMobileNo"
              type="text"
              label="Guarantor Mobile No. :"
              placeholder="07x xxx xxxx"
            />

            <button
              type="submit"
              className="bg-purple-900 hover:bg-purple-950 rounded-lg px-4 py-2 mt-2 border-none outline-none"
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
                <p className="text-purple-50 uppercase font-bold">
                  add customer
                </p>
              )}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default AddCustomer;
