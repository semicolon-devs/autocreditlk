import { Route, Routes } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";

import SignIn from "./pages/SignIn";
import RecoverAccount from "./pages/RecoverAccount";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import DebtorDetails from "./pages/DebtorDetails";
import AddCustomer from "./pages/AddCustomer";
import ManageUsers from "./pages/ManageUsers";
import AccountSettings from "./pages/AccountSettings";
import PageNotFound from "./pages/PageNotFound";
// import AccessDeniedPage from "./pages/AccessDeniedPage";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const App = () => {
  // const [toggled, setToggled] = useState(false);

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
      <Route path="/recover-account" element={<RecoverAccount />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/debtor-details" element={<DebtorDetails />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        {/* <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
            {isAdmin() ? <AdminDashboard /> : <AccessDeniedPage />}
            </ProtectedRoute>
          }
        /> */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
