import React from "react";
import { ErrorIcon } from "../components/Icon";

const PageNotFound = () => {
  return (
    <div className="bg-white w-full rounded-lg drop-shadow-lg flex flex-col justify-center items-center">
      <ErrorIcon />
      <p className="capitalize text-xl font-semibold">page not found!</p>
    </div>
  );
};

export default PageNotFound;
