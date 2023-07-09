import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

import SectionTitle from "../components/SectionTitle";
import SectionSubtitle from "../components/SectionSubtitle";

const AccountSettings = () => {
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

  return (
    <div className="">
      <SectionTitle title="account settings" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <SectionSubtitle title="account details" />
          <div className="bg-purple-50 w-full max-w-md p-5 rounded-lg">
            <p className="">Name : Saman Kumara</p>
            <p className="">Email : samankumara@gmail.com</p>
            <p className="">Phone No. : 076 125 4783</p>
            <p className="">Address : Penideniya, Peradeniya, Kandy</p>
          </div>
        </div>
        <div>
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
              //   resetPassword(
              //     values.oldPassword,
              //     values.newPassword,
              //     values.confirmPassword
              //   );
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
                className="bg-purple-900 hover:bg-purple-950 rounded-lg px-4 py-2 mt-2 border-none outline-none"
              >
                <p className="text-purple-50 uppercase font-bold">reset password</p>
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
