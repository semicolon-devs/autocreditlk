import { useField } from "formik";

const labelClasses = "font-semibold mb-2";

const inputClasses =
  "text-input w-full rounded-lg p-2 mb-3 outline-none border border-grey";

const conditionalInputClasses = "border-2 border-red";

const errorClasses = "error -mt-2 mb-1 text-red font-bold";

export const TextInputWithLabel = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputModifiedClasses = `${inputClasses} ${
    meta.touched && meta.error ? conditionalInputClasses : ""
  }`;

  return (
    <>
      <label className={labelClasses} htmlFor={props.id || props.name}>
        {label}
      </label>
      <input className={inputModifiedClasses} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={errorClasses}>{meta.error}</div>
      ) : null}
    </>
  );
};

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputModifiedClasses = `${inputClasses} ${
    meta.touched && meta.error ? conditionalInputClasses : ""
  }`;

  return (
    <>
      <input className={inputModifiedClasses} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={errorClasses}>{meta.error}</div>
      ) : null}
    </>
  );
};

export const TextAreaWithLabel = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputModifiedClasses = `${inputClasses} ${
    meta.touched && meta.error ? conditionalInputClasses : ""
  }`;

  return (
    <>
      <label className={labelClasses} htmlFor={props.id || props.name}>
        {label}
      </label>
      <textarea className={inputModifiedClasses} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={errorClasses}>{meta.error}</div>
      ) : null}
    </>
  );
};

export const SelectWithLabel = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputModifiedClasses = `${inputClasses} ${
    meta.touched && meta.error ? conditionalInputClasses : ""
  }`;

  return (
    <div>
      <label className={labelClasses} htmlFor={props.id || props.name}>
        {label}
      </label>
      <select className={inputModifiedClasses} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={errorClasses}>{meta.error}</div>
      ) : null}
    </div>
  );
};

export const Select = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputModifiedClasses = `${inputClasses} ${
    meta.touched && meta.error ? conditionalInputClasses : ""
  }`;

  return (
    <div>
      <select className={inputModifiedClasses} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={errorClasses}>{meta.error}</div>
      ) : null}
    </div>
  );
};
