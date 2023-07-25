import { useField } from "formik";

const labelClasses = "font-semibold mb-2";

const inputClasses =
  "text-input w-full rounded-lg p-2 mb-3 outline-none border border-grey";

const conditionalInputClasses = "border-2 border-maroon";

const errorClasses = "error -mt-2 mb-1 text-maroon font-bold";

export const TextInputWithLabel = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputMofiedClasses = `${inputClasses} ${
    meta.touched && meta.error ? conditionalInputClasses : ""
  }`;

  return (
    <>
      <label className={labelClasses} htmlFor={props.id || props.name}>
        {label}
      </label>
      <input className={inputMofiedClasses} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={errorClasses}>{meta.error}</div>
      ) : null}
    </>
  );
};

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputMofiedClasses = `${inputClasses} ${
    meta.touched && meta.error ? conditionalInputClasses : ""
  }`;

  return (
    <>
      <input className={inputMofiedClasses} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={errorClasses}>{meta.error}</div>
      ) : null}
    </>
  );
};

export const SelectWithLabel = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputMofiedClasses = `${inputClasses} ${
    meta.touched && meta.error ? conditionalInputClasses : ""
  }`;

  return (
    <div>
      <label className={labelClasses} htmlFor={props.id || props.name}>
        {label}
      </label>
      <select className={inputMofiedClasses} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={errorClasses}>{meta.error}</div>
      ) : null}
    </div>
  );
};

export const Select = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputMofiedClasses = `${inputClasses} ${
    meta.touched && meta.error ? conditionalInputClasses : ""
  }`;

  return (
    <div>
      <select className={inputMofiedClasses} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={errorClasses}>{meta.error}</div>
      ) : null}
    </div>
  );
};
