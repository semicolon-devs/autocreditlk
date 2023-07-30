import { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";

import {
  TextInputWithLabel as TextInput,
  SelectWithLabel as Select,
  TextAreaWithLabel as TextArea,
} from "../components/FormikElements";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const AddCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [NICCopyOne, setNICCopyOne] = useState();
  const [NICCopyTwo, setNICCopyTwo] = useState();
  const [customerPhoto, setCustomerPhoto] = useState();

  const token = cookies.get("autoCreditCookie");

  const addNewCustomer = (values) => {
    const {
      name,
      NIC,
      email,
      mobileNo,
      address,
      loanAmount,
      duration,
      startDate,
      billingCycle,
      description,
      guarantorName,
      guarantorMobileNo,
      guarantorNIC,
    } = values;

    setLoading(true);
    const axiosConfig = {
      method: "post",
      url: `${BASE_URL}customers`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: name,
        NIC: NIC,
        email: email,
        phone: mobileNo,
        address: address,
        loanAmount: loanAmount,
        duration: duration,
        startDate: startDate,
        billingCycle: billingCycle,
        description: description,
        guarantor: guarantorName,
        guarantorMobile: guarantorMobileNo,
        guarantorNIC: guarantorNIC,
      },
    };
    axios(axiosConfig)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    NIC: Yup.string()
      .matches(/^(?:\d{9}V|\d{12})$/, "Must be a valid NIC number")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
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
    guarantorNIC: Yup.string()
      .matches(/^(?:\d{9}V|\d{12})$/, "Must be a valid NIC number")
      .required("Required"),
  });

  return (
    <div className="w-full">
      <SectionTitle title="add new customer" />
      <Formik
        initialValues={{
          name: "",
          NIC: "",
          email: "",
          mobileNo: "",
          address: "",
          loanAmount: "",
          duration: "",
          startDate: "",
          billingCycle: "",
          description: "",
          guarantorName: "",
          guarantorMobileNo: "",
          guarantorNIC: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          addNewCustomer(values);
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
                name="email"
                type="text"
                label="Email :"
                placeholder="samankumara@gmail.com"
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
              <div className="">
                <label className="font-semibold mb-2">NIC copy 1 upload</label>
                <input
                  type="file"
                  onChange={(e) => setNICCopyOne(e.target.files[0])}
                  className="w-full rounded-lg p-2 mb-3 outline-none border border-grey"
                />
              </div>

              <div className="">
                <label className="font-semibold mb-2">NIC copy 2 upload</label>
                <input
                  type="file"
                  onChange={(e) => setNICCopyTwo(e.target.files[0])}
                  className="w-full rounded-lg p-2 mb-3 outline-none border border-grey"
                />
              </div>

              <div className="">
                <label className="font-semibold mb-2">
                  Customer photo upload
                </label>
                <input
                  type="file"
                  onChange={(e) => setCustomerPhoto(e.target.files[0])}
                  className="w-full rounded-lg p-2 mb-8 outline-none border border-grey"
                />
              </div>

              <SectionSubtitle title="guarantor details" />

              <TextInput
                name="guarantorName"
                type="text"
                label="Guarantor Name :"
                placeholder="Sunil Shantha"
              />

              <TextInput
                name="guarantorNIC"
                type="text"
                label="Guarantor NIC :"
                placeholder="871301450V / 198713001450"
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
