import { useState, Fragment ,useEffect} from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import {
  TextInputWithLabel as TextInput,
  TextAreaWithLabel as TextArea,
  SelectWithLabel as Select,
} from "../components/FormikElements";

import Cookies from "universal-cookie";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const ChangeCustomerDetailsModal = ({ modalShow, setModalShow, customer }) => {
  const [loading, setLoading] = useState(false);
  const [collectorArr, setCollectorArr] = useState([]);
  const [collectorIdArr, setCollectorIdArr] = useState([]);

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
          const IdArr = res.data.collectors.map((collector) => collector._id);
          setCollectorIdArr(IdArr);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchCollectors();
  }, []);
  const changeCustomerDetails = async (values) => {
    const {
      name,
      NIC,
      email,
      mobileNo,
      mobileNoTwo,
      address,
      description,
      guarantorName,
      guarantorMobileNo,
      guarantorMobileNoTwo,
      guarantorNIC,
      collectorId,
    } = values;

    setLoading(true);

    const data = {
      name: name,
      NIC: NIC,
      email: email,
      phone: mobileNo,
      phoneTwo: mobileNoTwo,
      address: address,
      description: description,
      guarantor: guarantorName,
      guarantorMobile: guarantorMobileNo,
      guarantorMobileTwo: guarantorMobileNoTwo,
      guarantorNIC: guarantorNIC,
      collectorId: collectorId,
    };
    // const formData = new FormData();
    // formData.append("name", name);
    // formData.append("NIC", NIC);
    // formData.append("email", email);
    // formData.append("phone", mobileNo);
    // formData.append("phoneTwo", mobileNoTwo);
    // formData.append("address", address);
    // formData.append("description", description);
    // formData.append("guarantor", guarantorName);
    // formData.append("guarantorMobile", guarantorMobileNo);
    // formData.append("guarantorMobileTwo", guarantorMobileNoTwo);
    // formData.append("guarantorNIC", guarantorNIC);

    try {
      const response = await axios.put(
        `${BASE_URL}customers/${customer.customerID}`,
        // formData,
        data,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string(),
    NIC: Yup.string().matches(
      /^(?:\d{9}V|\d{12})$/,
      "Must be a valid NIC number"
    ),
    email: Yup.string().email("Invalid email address"),
    mobileNo: Yup.string().matches(
      /^[0-9]{10}$/,
      "Must be a valid mobile number"
    ),
    mobileNoTwo: Yup.string().matches(
      /^[0-9]{10}$/,
      "Must be a valid mobile number"
    ),
    address: Yup.string().max(50, "Must be 50 characters or less"),
    description: Yup.string().max(100, "Must be 100 characters or less"),
    guarantorName: Yup.string(),
    guarantorMobileNo: Yup.string().matches(
      /^[0-9]{10}$/,
      "Must be a valid mobile number"
    ),
    guarantorMobileNoTwo: Yup.string().matches(
      /^[0-9]{10}$/,
      "Must be a valid mobile number"
    ),
    guarantorNIC: Yup.string().matches(
      /^(?:\d{9}V|\d{12})$/,
      "Must be a valid NIC number"
    ),
  });

  return (
    <Transition show={modalShow} as={Fragment}>
      <Dialog
        open={modalShow}
        onClose={() => setModalShow(false)}
        className="relative z-50"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white p-3">
                  <Dialog.Title className="text-2xl font-semibold mb-3">
                    Change Customer Details
                  </Dialog.Title>
                  <Dialog.Description>
                    Only enter feilds of the customer,{" "}
                    <span className="font-semibold italic ">
                      {customer.name}
                    </span>{" "}
                    you wish to update
                  </Dialog.Description>
                  <Formik
                    initialValues={{
                      name: customer.name,
                      NIC: customer.NIC,
                      email: customer.email,
                      mobileNo: customer.phone,
                      mobileNoTwo: customer.phoneTwo,
                      address: customer.address,
                      description: customer.description,
                      guarantorName: customer.guarantor,
                      guarantorMobileNo: customer.guarantorMobile,
                      guarantorMobileNoTwo: customer.guarantorMobileTwo,
                      guarantorNIC: customer.guarantorNIC,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      changeCustomerDetails(values);
                      setSubmitting(false);
                      resetForm({});
                    }}
                  >
                    <div className="mt-3">
                      <Form>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          <div>
                            <TextInput
                              name="name"
                              type="text"
                              label="Name :"
                              placeholder={customer.name}
                            />

                            <TextInput
                              name="NIC"
                              type="text"
                              label="NIC :"
                              placeholder={customer.NIC}
                            />

                            <TextInput
                              name="email"
                              type="text"
                              label="Email :"
                              placeholder={customer.email}
                            />

                            <TextInput
                              name="mobileNo"
                              type="text"
                              label="Mobile No. :"
                              placeholder={customer.phone}
                            />

                            <TextInput
                              name="mobileNoTwo"
                              type="text"
                              label="Mobile No. 2 :"
                              placeholder={customer.phoneTwo}
                            />
                            <TextInput
                              name="address"
                              type="text"
                              label="Address :"
                              placeholder={customer.address}
                            />

                            <TextArea
                              name="description"
                              type="text"
                              label="Description :"
                              placeholder={customer.description}
                            />
                          </div>
                          <div>
                            <TextInput
                              name="guarantorName"
                              type="text"
                              label="Guarantor Name :"
                              placeholder={customer.guarantor}
                            />

                            <TextInput
                              name="guarantorNIC"
                              type="text"
                              label="Guarantor NIC :"
                              placeholder={customer.guarantorNIC}
                            />

                            <TextInput
                              name="guarantorMobileNo"
                              type="text"
                              label="Guarantor Mobile No. :"
                              placeholder={customer.guarantorMobile}
                            />

                            <TextInput
                              name="guarantorMobileNoTwo"
                              type="text"
                              label="Guarantor Mobile No. 2 :"
                              placeholder={customer.guarantorMobileTwo}
                            />
                            <Select label="Collector Name" name="collectorId">
                              <option value="">Select Collector</option>
                              {collectorArr &&
                                collectorArr.map((collector) => (
                                  <option
                                    value={collector._id}
                                    key={collector._id}
                                  >
                                    {collector.name}
                                  </option>
                                ))}
                            </Select>
                          </div>
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
                            <p className="text-white uppercase font-bold">
                              change details
                            </p>
                          )}
                        </button>
                      </Form>
                    </div>
                  </Formik>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ChangeCustomerDetailsModal;
