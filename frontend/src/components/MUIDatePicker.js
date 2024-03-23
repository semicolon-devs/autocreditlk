// import React from "react";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from "dayjs";

// const MUIDatePicker = ({ setDate }) => {
//   const dateNow = new Date();
//   return (
//     <div>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DatePicker
//         //   label="Pick a Date"
//           onChange={(newValue) => {
//             const date = new Date(newValue);
//             setDate(date);
//           }}
//           defaultValue={dayjs(dateNow)}
//           format="LL"
//           slotProps={{
//             actionBar: {
//               actions: ["today"],
//             },
//           }}
//         />
//         {/* <DatePicker defaultValue={dayjs("2022-04-17")} /> */}
//       </LocalizationProvider>
//     </div>
//   );
// };

// export default MUIDatePicker;

import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const MUIDatePicker = ({ setDate }) => {
  const [selectedDates, setSelectedDates] = useState([]); // Array to store selected dates

  const handleDateChange = (newValue) => {
    const date = dayjs(newValue);
    setDate(date.toDate()); // Update the single date state

    // Update selectedDates array for highlighting
    const newSelectedDates = [...selectedDates]; // Create a copy to avoid mutation
    if (newSelectedDates.some((d) => d.isSame(date, "day"))) {
      // Remove if date already exists
      newSelectedDates.splice(newSelectedDates.indexOf(date), 1);
    } else {
      // Add new date
      newSelectedDates.push(date);
    }
    setSelectedDates(newSelectedDates);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          onChange={handleDateChange}
          defaultValue={dayjs()}
          format="LL" // Adjust format as needed
          renderDay={(date, valueFormat) => {
            const formattedValue = dayjs(date).format(valueFormat);
            const isHighlighted = selectedDates.some((selectedDate) =>
              selectedDate.isSame(date, "day")
            );

            // Customize highlighting style based on your preference
            const highlightStyle = isHighlighted
              ? { backgroundColor: "lightblue" } // Example style
              : {};

            return (
              <button type="button" style={highlightStyle} key={formattedValue}>
                {formattedValue}
              </button>
            );
          }}
          slotProps={{
            actionBar: {
              actions: ["today"],
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default MUIDatePicker;
