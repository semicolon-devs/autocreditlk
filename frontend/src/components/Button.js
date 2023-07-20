import React from "react";

export const ModalCancelButton = ({ setModalShow }) => {
  return (
    <button
      onClick={() => setModalShow(false)}
      className={`rounded-lg px-4 py-2 bg-darkGrey ms-3`}
    >
      <p className="text-white capitalize font-bold">cancel</p>
    </button>
  );
};

export const ModalPrimaryButton = ({ setModalShow }) => {
  return (
    <button
      onClick={() => setModalShow(false)}
      className={`rounded-lg px-4 py-2 bg-darkGrey ms-3`}
    >
      <p className="text-white capitalize font-bold">cancel</p>
    </button>
  );
};


