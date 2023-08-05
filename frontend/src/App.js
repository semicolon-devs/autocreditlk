import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./layouts/RootLayout";

import SignIn from "./pages/SignIn";
import RecoverAccount from "./pages/RecoverAccount";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import CustomerDetails from "./pages/CustomerDetails";
import AddCustomer from "./pages/AddCustomer";
import AddExistingCustomer from "./pages/AddExistingCustomer";
import Insights from "./pages/Insights";
import ManageUsers from "./pages/ManageUsers";
import AccountSettings from "./pages/AccountSettings";
import PageNotFound from "./pages/PageNotFound";
import SMSGateway from "./pages/SMSGateway";
import ReportsPage from "./pages/ReportsPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const isAdmin = () => {
  if (JSON.parse(localStorage.getItem("userRole")) === "admin") {
    return true;
  } else {
    return false;
  }
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/recover-account" element={<RecoverAccount />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route
          path="/customer-details/:id"
          element={isAdmin() ? <CustomerDetails /> : <AccessDeniedPage />}
        />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route
          path="/add-customer"
          element={isAdmin() ? <AddCustomer /> : <AccessDeniedPage />}
        />
        <Route
          path="/add-existing-customer"
          element={isAdmin() ? <AddExistingCustomer /> : <AccessDeniedPage />}
        />
        <Route
          path="/insights"
          element={isAdmin() ? <Insights /> : <AccessDeniedPage />}
        />
        <Route
          path="/manage-users"
          element={isAdmin() ? <ManageUsers /> : <AccessDeniedPage />}
        />
        <Route
          path="/sms-gateway"
          element={isAdmin() ? <SMSGateway /> : <AccessDeniedPage />}
        />
        <Route
          path="/reports"
          element={isAdmin() ? <ReportsPage /> : <AccessDeniedPage />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
