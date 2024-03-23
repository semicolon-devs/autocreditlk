import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [otherDates, setOtherDates] = useState([]);

  const highlightImportantDates = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return otherDates.includes(formattedDate);
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    if (!otherDates.includes(formattedDate)) {
      setOtherDates([...otherDates, formattedDate]);
    } else {
      setOtherDates(otherDates.filter((d) => d !== formattedDate));
    }
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      dateFormat="MM/dd/yyyy"
      highlightDates={otherDates.map((dateString) => new Date(dateString))}
      inline // Set inline to true to keep the calendar open
      onSelect={handleDateChange} // This event triggers when a date is selected
    />
  );
};

export default CustomDatePicker;
