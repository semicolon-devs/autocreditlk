import { useState, useEffect } from "react";
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

const AddExistingCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [collectorArr, setCollectorArr] = useState([]);
  const [collectorIdArr, setCollectorIdArr] = useState([]);
  const [NICFrontCopy, setNICFrontCopy] = useState([]);
  const [NICRearCopy, setNICRearCopy] = useState([]);
  const [guarantorNICFrontCopy, setGuarantorNICFrontCopy] = useState([]);
  const [guarantorNICRearCopy, setGuarantorNICRearCopy] = useState([]);
  const [customerPhoto, setCustomerPhoto] = useState();

  const token = cookies.get("autoCreditCookie");

  useEffect(() => {
    const fetchCollectors = async () => {
      const axiosConfig = {
        method: "get",
        url: `${BASE_URL}collector/collectors`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios(axiosConfig)
        .then((res) => {
          setCollectorArr(res.data.collectors);
          const collectorIdArr = res.data.collectors.map(
            (collector) => collector._id
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchCollectors();
  }, []);

  const addExisitngCustomer = async (values) => {
    const {
      customerId,
      name,
      NIC,
      email,
      mobileNo,
      mobileNoTwo,
      address,
      loanAmount,
      // noOfInstallments,
      installmentAmount,
      paidAmount,
      paidAmountDate,
      startDate,
      billingCycle,
      collectorId,
      description,
      guarantorName,
      guarantorMobileNo,
      guarantorMobileNoTwo,
      guarantorNIC,
    } = values;

    setLoading(true);

    const formData = new FormData();
    formData.append("customerID", customerId);
    formData.append("name", name);
    formData.append("NIC", NIC);
    formData.append("email", email);
    formData.append("phone", mobileNo);
    formData.append("phoneTwo", mobileNoTwo);
    formData.append("address", address);
    formData.append("loanAmount", loanAmount);
    formData.append("installmentAmount", installmentAmount);
    // formData.append("noOfInstallments", noOfInstallments);
    formData.append("startDate", startDate);
    formData.append("paidAmount", paidAmount);
    formData.append("paidAmountDate", paidAmountDate);
    formData.append("billingCycle", billingCycle);
    formData.append("collectorId", collectorId);
    formData.append("description", description);
    formData.append("NICFrontCopy", NICFrontCopy);
    formData.append("NICRearCopy", NICRearCopy);
    formData.append("customerPhoto", customerPhoto);
    formData.append("guarantor", guarantorName);
    formData.append("guarantorMobile", guarantorMobileNo);
    formData.append("guarantorMobileTwo", guarantorMobileNoTwo);
    formData.append("guarantorNIC", guarantorNIC);
    formData.append("guarantorNICFrontCopy", guarantorNICFrontCopy);
    formData.append("guarantorNICRearCopy", guarantorNICRearCopy);

    try {
      const response = await axios.post(
        `${BASE_URL}customers/existing`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNICFrontCopy(null);
      setNICRearCopy(null);
      setCustomerPhoto(null);
      setGuarantorNICFrontCopy(null);
      setGuarantorNICRearCopy(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    customerId: Yup.string()
      .matches(/^(\d{4})$/, "Must be 4 digits")
      .required("Required"),
    name: Yup.string().required("Required"),
    NIC: Yup.string()
      .matches(/^(?:\d{9}V|\d{12})$/, "Must be a valid NIC number")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be a valid mobile number")
      .required("Required"),
    mobileNoTwo: Yup.string().matches(
      /^[0-9]{10}$/,
      "Must be a valid mobile number"
    ),
    address: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    loanAmount: Yup.number()
      .typeError("Must be a number")
      .positive("Must be a positive number")
      .required("Required"),
    installmentAmount: Yup.number()
      .typeError("Must be a number")
      .positive("Must be a positive number")
      .required("Required"),
    // noOfInstallments: Yup.number()
    //   .typeError("Must be a number")
    //   .positive("Must be a positive number")
    //   .required("Required"),
    startDate: Yup.date().required("Required"),
    paidAmount: Yup.number()
      .typeError("Must be a number")
      .positive("Must be a positive number")
      .required("Required"),
    paidAmountDate: Yup.date().required("Required"),
    billingCycle: Yup.string()
      .oneOf(["Daily", "Weekly", "Monthly"], "Invalid selection")
      .required("Required"),
    collectorId: Yup.string()
      .oneOf(collectorIdArr, "Invalid Collector")
      .required("Required"),
    description: Yup.string().max(100, "Must be 100 characters or less"),
    guarantorName: Yup.string().required("Required"),
    guarantorMobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be a valid mobile number")
      .required("Required"),
    guarantorMobileNoTwo: Yup.string().matches(
      /^[0-9]{10}$/,
      "Must be a valid mobile number"
    ),
    guarantorNIC: Yup.string()
      .matches(/^(?:\d{9}V|\d{12})$/, "Must be a valid NIC number")
      .required("Required"),
  });

  return (
    <div className="w-full">
      <SectionTitle title="add existing customer" />
      <Formik
        initialValues={{
          customerId: "",
          name: "",
          NIC: "",
          email: "",
          mobileNo: "",
          mobileNoTwo: "",
          address: "",
          loanAmount: "",
          installmentAmount: "",
          // noOfInstallments: "",
          startDate: "",
          paidAmount: "",
          paidAmountDate: "",
          billingCycle: "",
          collectorId: "",
          description: "",
          guarantorName: "",
          guarantorMobileNo: "",
          guarantorMobileNoTwo: "",
          guarantorNIC: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          addExisitngCustomer(values);
          setSubmitting(false);
          resetForm({});
        }}
      >
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <Form className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="w-full lg:max-w-md">
              <TextInput
                name="customerId"
                type="text"
                label="Customer ID :"
                placeholder="8080"
              />

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
                name="mobileNoTwo"
                type="text"
                label="Mobile No. 2 (optional):"
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
                onWheel={(e) => e.target.blur()}
              />

              <TextInput
                name="installmentAmount"
                type="number"
                label="Installment amount :"
                placeholder="2,000"
                onWheel={(e) => e.target.blur()}
              />

              <TextInput
                name="paidAmount"
                type="number"
                label="Paid amount :"
                placeholder="2,000"
                onWheel={(e) => e.target.blur()}
              />

              {/* <TextInput
                  name="noOfInstallments"
                  type="number"
                  label="No of Installments :"
                  placeholder="12"
                /> */}

              <TextInput
                name="paidAmountDate"
                type="date"
                label="Paid Amount Date :"
                placeholder="01/08/2023"
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

              <Select label="Collector Name" name="collectorId">
                <option value="">Select Collector</option>
                {collectorArr &&
                  collectorArr.map((collector) => (
                    <option value={collector._id} key={collector._id}>
                      {collector.name}
                    </option>
                  ))}
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
                <label className="font-semibold mb-2">NIC front copy </label>
                <input
                  type="file"
                  onChange={(e) => setNICFrontCopy(e.target.files[0])}
                  className="w-full rounded-lg p-2 mb-3 outline-none border border-grey"
                />
              </div>

              <div className="">
                <label className="font-semibold mb-2">NIC rear copy </label>
                <input
                  type="file"
                  onChange={(e) => setNICRearCopy(e.target.files[0])}
                  className="w-full rounded-lg p-2 mb-3 outline-none border border-grey"
                />
              </div>

              <div className="">
                <label className="font-semibold mb-2">Customer photo</label>
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

              <TextInput
                name="guarantorMobileNoTwo"
                type="text"
                label="Guarantor Mobile No. 2 (optional):"
                placeholder="07x xxx xxxx"
              />

              <div className="">
                <label className="font-semibold mb-2">
                  Guarantor NIC front copy{" "}
                </label>
                <input
                  type="file"
                  onChange={(e) => setGuarantorNICFrontCopy(e.target.files[0])}
                  className="w-full rounded-lg p-2 mb-3 outline-none border border-grey"
                />
              </div>

              <div className="">
                <label className="font-semibold mb-2">
                  Guarantor NIC rear copy{" "}
                </label>
                <input
                  type="file"
                  onChange={(e) => setGuarantorNICRearCopy(e.target.files[0])}
                  className="w-full rounded-lg p-2 mb-3 outline-none border border-grey"
                />
              </div>

              <button
                type="submit"
                className="bg-maroon w-full rounded-lg px-4 py-2 mt-2 border-none outline-none flex items-center justify-center"
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

export default AddExistingCustomer;