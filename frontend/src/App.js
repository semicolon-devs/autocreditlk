import { Route, Routes } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";

import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Home from "./pages/Home";
// import EditAccount from "./pages/EditAccount";
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
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            // <ProtectedRoute>
            <Home />
            // </ProtectedRoute>
          }
        />
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
