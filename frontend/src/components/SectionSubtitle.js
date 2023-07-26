import React from "react";

const SectionSubtitle = ({ title, classes }) => {
  return (
    <h4
      className={`text-lg sm:text-2xl font-semibold capitalize mb-3 ${classes}`}
    >
      {title}
    </h4>
  );
};

export default SectionSubtitle;
