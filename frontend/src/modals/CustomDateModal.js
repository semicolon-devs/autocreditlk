import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ThreeDots } from "react-loader-spinner";

const CustomDatePicker = ({ modalShow, setModalShow }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [otherDates, setOtherDates] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <Transition show={modalShow} as={Fragment} height={100}>
      <Dialog
        open={modalShow}
        onClose={() => setModalShow(false)}
        className="relative z-50"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel className="max-w-3xl rounded-lg bg-white p-3">
                  <Dialog.Title className="text-2xl font-semibold mb-3">
                    Pick Dates
                  </Dialog.Title>

                  {loading ? (
                    <div className="w-full flex items-center justify-center">
                      <ThreeDots
                        height="40"
                        width="40"
                        radius="9"
                        color="#808080"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                      />
                    </div>
                  ) : (
                    <div className="">
                      {" "}
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="MM/dd/yyyy"
                        highlightDates={otherDates.map(
                          (dateString) => new Date(dateString)
                        )}
                        inline
                        onSelect={handleDateChange}
                      />
                    </div>
                  )}
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
    // <DatePicker
    //   selected={startDate}
    //   onChange={(date) => setStartDate(date)}
    //   dateFormat="MM/dd/yyyy"
    //   highlightDates={otherDates.map((dateString) => new Date(dateString))}
    //   inline // Set inline to true to keep the calendar open
    //   onSelect={handleDateChange} // This event triggers when a date is selected
    // />
  );
};

export default CustomDatePicker;
