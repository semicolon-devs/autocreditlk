import React from "react";

const buttonClasses = "rounded-lg px-4 py-1 outline-none border-none";

const buttonTextClasses = "text-white capitalize font-bold";

export const ModalPrimaryButton = ({
  primaryButtonText,
  primaryButtonClick,
}) => {
  return (
    <button
      onClick={primaryButtonClick}
      className={`bg-maroon ${buttonClasses}`}
    >
      <p className={buttonTextClasses}>{primaryButtonText}</p>
    </button>
  );
};

export const ModalCancelButton = ({ setModalShow }) => {
  return (
    <button
      onClick={() => setModalShow(false)}
      className={`bg-darkGrey ms-3 ${buttonClasses}`}
    >
      <p className={buttonTextClasses}>cancel</p>
    </button>
  );
};
