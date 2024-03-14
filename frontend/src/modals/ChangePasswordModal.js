import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ThreeDots } from "react-loader-spinner";

import Cookies from "universal-cookie";

import {
  secondaryButtonClasses,
  buttonTextClasses,
} from "../data/Classes";
import { TextInputWithLabel as TextInput } from "../components/FormikElements";

import BASE_URL from "../config/ApiConfig";

const cookies = new Cookies();

const ChangePasswordModal = ({ modalShow, setModalShow, user }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const token = cookies.get("autoCreditCookie");

  const resetPassword = async (password) => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${BASE_URL}auth//password-change-by-admin/${user._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        newPassword: password,
      },
    };

    axios(config)
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
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            password: Yup.string()
              .required("Required")
              .min(8, "Your password is too short.")
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one numeral, and one symbol."
              ),
            confirmPassword: Yup.string()
              .required("Required")
              .oneOf([Yup.ref("password")], "Passwords must match"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetPassword(values.password);
            setSubmitting(false);
            resetForm({});
          }}
        >
          <Form>
            <TextInput
              name="password"
              type="password"
              placeholder="Enter new password"
            />

            <TextInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
            />

            <button
              type="submit"
              className="bg-maroon w-full rounded-lg px-4 py-2 flex items-center justify-center"
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
                  change password
                </p>
              )}
            </button>

            {message && (
              <div className="w-full border border-orange rounded-lg mt-3 p-3">
                <p className="text-orange">{message}</p>
              </div>
            )}
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

export default ChangePasswordModal;
