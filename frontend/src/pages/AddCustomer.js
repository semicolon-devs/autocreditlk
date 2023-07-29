import { useState } from "react";
import axios from "axios";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import SectionTitle from "../components/SectionTitle";

import {
  TextInputWithLabel as TextInput,
  SelectWithLabel as Select,
  TextAreaWithLabel as TextArea,
} from "../components/FormikElements";

const AddCustomer = () => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    NIC: Yup.string()
      .matches(/^(?:\d{9}V|\d{12})$/, "Must be a valid NIC number")
      .required("Required"),
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
    description: Yup.string().max(100, "Must be 100 characters or less"),
    guarantorName: Yup.string().required("Required"),
    guarantorMobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be a valid mobile number")
      .required("Required"),
  });

  return (
    <div className="w-full">
      <SectionTitle title="add new customer" />
      <Formik
        initialValues={{
          name: "",
          NIC: "",
          mobileNo: "",
          address: "",
          loanAmount: "",
          duration: "",
          startDate: "",
          billingCycle: "",
          description: "",
          guarantorName: "",
          guarantorMobileNo: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setSubmitting(false);
        }}
      >
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <Form className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="w-full lg:max-w-md">
              <TextInput
                name="name"
                type="text"
                label="Name :"
                placeholder="Saman Kumara"
              />

              <TextInput
                name="NIC"
                type="text"
                label="NIC :"
                placeholder="871301450V / 198713001450"
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

              <TextArea
                name="description"
                type="text"
                label="Description(optional) :"
                placeholder="Add a descripton"
              />
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
                className="bg-maroon w-full rounded-lg px-4 py-2 mt-2 border-none outline-none"
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
                  <p className="text-white uppercase font-bold">add customer</p>
                )}
              </button>
            </div>
          </Form>
        </div>
      </Formik>
    </div>
  );
};

export default AddCustomer;
