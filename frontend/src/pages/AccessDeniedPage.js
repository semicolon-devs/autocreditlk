import React from "react";
import { DeniedIcon } from "../Icons/Icon";

const AccessDeniedPage = () => {
  return (
    <div className="bg-white w-full h-full rounded-lg drop-shadow-lg flex flex-col justify-center items-center">
      <DeniedIcon />
      <p className="capitalize text-xl font-semibold">
        Only Admin has access to this page
      </p>
    </div>
  );
};

export default AccessDeniedPage;
