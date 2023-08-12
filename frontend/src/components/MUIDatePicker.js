import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const MUIDatePicker = ({ setDate }) => {
  const dateNow = new Date();
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
        //   label="Pick a Date"
          onChange={(newValue) => {
            const date = new Date(newValue);
            setDate(date);
          }}
          defaultValue={dayjs(dateNow)}
          format="LL"
          slotProps={{
            actionBar: {
              actions: ["today"],
            },
          }}
        />
        {/* <DatePicker defaultValue={dayjs("2022-04-17")} /> */}
      </LocalizationProvider>
    </div>
  );
};

export default MUIDatePicker;
