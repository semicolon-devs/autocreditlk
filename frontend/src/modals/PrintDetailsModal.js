import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form } from "formik";
import { ThreeDots } from "react-loader-spinner";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { CurrencyFormatter } from "../utils/CurrencyFormatter";
import {
  TextInputWithLabel as TextInput,
  TextAreaWithLabel as TextArea,
} from "../components/FormikElements";

import Cookies from "universal-cookie";

const cookies = new Cookies();

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0),
  createData("Ice cream sandwich", 2377, 4.3),
  createData("Eclair", 262, 16.0),
  createData("Cupcake", 305, 3.73),
  createData("Gingerbread", 356, 16.0),
];

const PrintDetailsModal = ({
  modalShow,
  setModalShow,
  customer,
  customerPayments,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Transition show={modalShow} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white p-3">
                  <Dialog.Title className="text-2xl font-semibold mb-3">
                    Print Customer Details
                  </Dialog.Title>
                  <Dialog.Description>
                    Installment history of the customer,{" "}
                    <span className="font-semibold italic ">
                      {customer.name}
                    </span>
                  </Dialog.Description>
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
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Collected by</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {customerPayments.map((payment) => (
                            <TableRow
                              key={payment._id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {new Date(payment.paidDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    timeZone: "Asia/Colombo",
                                  }
                                )}{" "}
                                {new Date(payment.paidDate).toLocaleTimeString(
                                  "en-US",
                                  {
                                    timeZone: "Asia/Colombo",
                                  }
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {payment.amount &&
                                  CurrencyFormatter(payment.amount)}{" "}
                                LKR
                              </TableCell>
                              <TableCell align="right">
                                {payment.collectedBy}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PrintDetailsModal;
