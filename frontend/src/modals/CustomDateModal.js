import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import BASE_URL from "../config/ApiConfig";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("autoCreditCookie");

const CustomDatePicker = ({ modalShow, setModalShow, user }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [holiDays, setholiDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const highlightImportantDates = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return holiDays.includes(formattedDate);
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    if (!holiDays.includes(formattedDate)) {
      setholiDays([...holiDays, formattedDate]);
    } else {
      setholiDays(holiDays.filter((d) => d !== formattedDate));
    }
  };

  const handleConfirm = (user) => {
    const axiosConfig = {
      method: "patch",
      url: `${BASE_URL}collector/holidays/${user._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        holidays: holiDays,
      },
    };
    axios(axiosConfig)
      .then((res) => {
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const fetchCollectors = async () => {
      setLoading(true);
      const axiosConfig = {
        method: "get",
        url: `${BASE_URL}collector/holidays/${user._id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios(axiosConfig)
        .then((res) => {
          setholiDays(res.data.holidays);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchCollectors();
  }, []);

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
                        highlightDates={holiDays.map(
                          (dateString) => new Date(dateString)
                        )}
                        inline
                        onSelect={handleDateChange}
                      />
                    </div>
                  )}
                  <button
                    className="bg-blue flex rounded-lg px-3 py-1"
                    onClick={() => handleConfirm(user)}
                  >
                    <p className="text-white uppercase font-semibold ms-2 text-sm">
                      confirm
                    </p>
                  </button>
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
    //   highlightDates={holiDays.map((dateString) => new Date(dateString))}
    //   inline // Set inline to true to keep the calendar open
    //   onSelect={handleDateChange} // This event triggers when a date is selected
    // />
  );
};

export default CustomDatePicker;
