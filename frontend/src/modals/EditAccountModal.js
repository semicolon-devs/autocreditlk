import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import Cookies from "universal-cookie";

import {
  primaryButtonClasses,
  secondaryButtonClasses,
  buttonTextClasses,
} from "../data/Classes";
import { TextInputWithLabel as TextInput } from "../components/FormikElements";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const EditAccountModal = ({ modalShow, setModalShow, user }) => {
  const [loading, setLoading] = useState(false);

  const token = cookies.get("autoCreditCookie");

  const editAccountDetails = (name, email, mobileNo) => {
    setLoading(true);
    const axiosConfig = {
      method: "POST",
      url: `${BASE_URL}collector/update-profile/${user.userID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: name,
        email: email,
        phone: mobileNo,
      },
    };

    axios(axiosConfig)
      .then((res) => {
        // alert(result.data.message);
        // console.log(res);
        const config = {
          method: "get",
          url: `${BASE_URL}auth/userData`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios(config)
          .then((res) => {
            localStorage.setItem("userData", JSON.stringify(res.data.userData));
            window.location.reload(false);
          })
          .catch((res) => {
            console.log(res);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-3">
              <Dialog.Title className="text-2xl font-semibold mb-3 capitalize">
                edit account details
              </Dialog.Title>
              <Dialog.Description className="mb-3">
                Only enter the feilds you wish to update
              </Dialog.Description>
              <Formik
                initialValues={{
                  name: user.name,
                  email: user.email,
                  mobileNo: user.phone,
                }}
                validationSchema={Yup.object({
                  name: Yup.string().max(30, "Must be 30 characters or less"),
                  // .required("Required"),
                  email: Yup.string().email("Invalid email address"),
                  // .required("Required"),
                  mobileNo: Yup.string().matches(
                    /^[0-9]{10}$/,
                    "Must be a valid mobile number"
                  ),
                  // .required("Required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  editAccountDetails(
                    values.name,
                    values.email,
                    values.mobileNo
                  );
                  setSubmitting(false);
                  resetForm({});
                }}
              >
                <Form className="">
                  {user.role !== "admin" && (
                    <TextInput
                      name="name"
                      type="text"
                      label="Enter new name :"
                      placeholder="Enter new user name"
                    />
                  )}

                  <TextInput
                    name="email"
                    type="email"
                    label="Enter new email :"
                    placeholder="Enter new user email"
                  />

                  <TextInput
                    name="mobileNo"
                    type="text"
                    label="Enter new mobile number :"
                    placeholder="Enter new user mobile number"
                  />

                  <button
                    className={`w-full flex justify-center items-center ${primaryButtonClasses}`}
                    type="submit"
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
                      <p className={buttonTextClasses}>confirm changes</p>
                    )}
                  </button>
                </Form>
              </Formik>
              <button
                className={`w-full mt-3 ${secondaryButtonClasses}`}
                onClick={() => setModalShow(false)}
              >
                <p className={buttonTextClasses}>cancel</p>
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditAccountModal;
