import { Route, Routes } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";

import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import DebtorDetails from "./pages/DebtorDetails";
import AddCustomer from "./pages/AddCustomer";
import AccountSettings from "./pages/AccountSettings";
// import AdminDashboard from "./pages/AdminDashboard";
import PageNotFound from "./pages/PageNotFound";
// import AccessDeniedPage from "./pages/AccessDeniedPage";

// import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const App = () => {
  // const cookie = cookies.get("meetingRoomCookie");
  // const isAdmin = () => {
  //   if (cookie && cookie.userData.role === "admin") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            // <ProtectedRoute>
            <Home />
            // </ProtectedRoute>
          }
        />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/debtor-details" element={<DebtorDetails />} />
        {/* <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              {isAdmin() ? <AdminDashboard /> : <AccessDeniedPage />}
            </ProtectedRoute>
          }
        /> */}
        {/* <Route path="/edit-account" element={<EditAccount />} /> */}
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
