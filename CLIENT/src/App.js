import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
// import Home from "./Pages/Home";
import ProtectedRoute from './components/protectedRoute';
import PublicRoute from './components/publicRoute';
// import {Button} from "antd"
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import ApplyDoctor from "./Pages/ApplyDoctor";
import Notifications from "./Pages/Notifications";
import Appointment from "./Pages/Appointment"
import Checktumor from "./Pages/Checktumour";
import Profile from "./Pages/Doctor/profile";
import Doctorslist from "./Pages/Admin/Doctorslist";
import Userslist from "./Pages/Admin/Userslist";
import Book from "./Pages/Book";
import BookAppointment from "./Pages/BookAppointment";
import Homepage from "./Pages/Homepage";  
// import Userappointments from "./components/Userappointments";
import Userprofile from "./Pages/Userprofile";
import Doctorappointments from "./Pages/Doctorappointments";
// import Users from 
// import Doctors from "./Pages/Doctors";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/homepage"
          element={
            <PublicRoute>
              <Homepage/>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
         <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <Book />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applydoctor"
          element={
            <ProtectedRoute>
              <ApplyDoctor />
            </ProtectedRoute>
          }
        />
         <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
     
        <Route
          path="/checktumor"
          element={
            <ProtectedRoute>
              <Checktumor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/appointments"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <Doctorappointments/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/yourprofile"
          element={
            <ProtectedRoute>
              <Userprofile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/book-appointsment/:doctorId"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
{/* 
<Route
          path="/book-appointsment/:userId"
          element={
            <ProtectedRoute>
              <Appointsments />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Userslist/>
            </ProtectedRoute>
          }
        />
          <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute>
              <Doctorslist/>
            </ProtectedRoute> 
          }
        />
        <Route
          path="/doctor/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute> 
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
// import Userslist from "./Pages/Admin/Userslist";
// import Doctorslist from "./Pages/Admin/Doctorslist";

export default App;
