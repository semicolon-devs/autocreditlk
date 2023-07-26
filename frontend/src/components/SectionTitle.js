import React from "react";

const SectionTitle = ({ title }) => {
  return (
    <div className="bg-white w-full rounded-lg drop-shadow-lg p-3 mb-5">
      <h3 className="text-xl sm:text-2xl font-semibold capitalize">{title}</h3>
    </div>
  );
};

export default SectionTitle;
