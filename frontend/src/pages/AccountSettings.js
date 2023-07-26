import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import Cookies from "universal-cookie";

import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";

import { TextInputWithLabel as TextInput } from "../components/FormikElements";
import { AccountIcon } from "../Icons/Icon";

const cookies = new Cookies();

const AccountSettings = () => {
  const cookie = cookies.get("autoCreditCookie");

  console.log(cookie);

  // change password axio here

  return (
    <div className="w-full">
      <SectionTitle title="account settings" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <SectionSubtitle title="account details" />
          <div className="w-full max-w-md rounded-lg mx-auto text-center">
            <AccountIcon className="text-maroon opacity-75" sx={{ fontSize: 120 }} />
            <p className="">Name : Saman Kumara</p>
            <p className="">Email : samankumara@gmail.com</p>
            <p className="">Phone No. : 076 125 4783</p>
            <p className="">Address : Penideniya, Peradeniya, Kandy</p>
          </div>
        </div>
        <div className="bg-white w-full rounded-lg drop-shadow-lg p-3">
          <SectionSubtitle title="change password" />
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              oldPassword: Yup.string().required("Required"),
              newPassword: Yup.string()
                .required("Required")
                .min(5, "Your password is too short.")
                .matches(
                  /[a-zA-Z]/,
                  "Password can only contain Latin letters."
                ),
              confirmPassword: Yup.string()
                .required("Required")
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              //   call change password axio here ==> changePassword(values.oldPassword, values.newPassword)
              setSubmitting(false);
            }}
          >
            <Form className="w-full max-w-md">
              <TextInput
                name="oldPassword"
                type="password"
                placeholder="Enter old password"
              />

              <TextInput
                name="newPassword"
                type="password"
                placeholder="Enter new password"
              />

              <TextInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />

              <button
                type="submit"
                className="bg-maroon w-full rounded-lg px-4 py-2 mt-2 border-none outline-none"
              >
                <p className="text-white uppercase font-bold">reset password</p>
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
