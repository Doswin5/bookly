import { Route, Routes } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Slots from "./pages/Slots";
import MyBookings from "./pages/MyBookings";
import AdminSlots from "./pages/AdminSlots";
import AdminBookings from "./pages/AdminBookings";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/slots"
        element={
          <ProtectedRoute>
            <Slots />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/slots"
        element={
          <AdminRoute>
            <AdminSlots />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <AdminBookings />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;