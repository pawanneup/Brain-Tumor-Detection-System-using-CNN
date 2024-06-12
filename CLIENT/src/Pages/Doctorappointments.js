import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import moment from "moment";

function Doctorappointment() {
  const [doctorappointment, setDoctorappointment] = useState([]);
  const dispatch = useDispatch();

  const getDoctorappointmentData = async () => {
    try {
      dispatch(showLoading()); // Show loading indicator before making the request
      const response = await axios.get(
        "/api/doctor/get-appointments-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: { userId: localStorage.getItem("userId") },
        }
      );
      dispatch(hideLoading()); // Hide loading indicator after the request completes
      if (response.data.success) {
        setDoctorappointment(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator in case of error
      console.error("Error fetching user data:", error); // Log the error for debugging
      toast.error("Error fetching appointments");
    }
  };
  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading()); // Show loading indicator before making the request
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        { appointmentId: record._is, status:status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading()); // Hide loading indicator after the request completes
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorappointmentData()
      }
    } catch (error) {
      toast.error("Error Changing Doctor account Status");
      dispatch(hideLoading()); // Hide loading indicator in case of error
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => (
        <h1 className="card-text"> {record.userInfo.name} </h1>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <h1 className="card-text"> {record.doctorInfo.phoneNumber} </h1>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <h1 className="card-text">
          {" "}
          {moment(record.date).format("DD-MM-YY")}{" "}
          {moment(record.time).format("HH-mm")}
        </h1>
      ),
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
           <div className="d-flex"> 
            <h1
              className="anchor px-2"
              onClick={() => changeAppointmentStatus(record, "approved")}
            >
              Approve
            </h1>

            <h1
              className="anchor"
              onClick={() => changeAppointmentStatus(record, "rejected")}
            >
              Reject
            </h1>
          </div>
          )}

          {/* {record.status === "approved" && <h1 className="anchor" onClick={()=>changeAppointmentStatus(record,'rejected')}>Reject</h1>}
          {record.status === "blocked" && <h1 className="anchor" onClick={()=>changeAppointmentStatus(record,'unblocked')}>Unblock</h1>}
          {record.status === "unblocked" && <h1 className="anchor"onClick={()=>changeAppointmentStatus(record,'blocked')} >Block</h1>} */}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getDoctorappointmentData();
  }, []);

  return (
    <Layout>
      <div className="body-padding">
        <h1 className="page-header">Appointments</h1>
        <Table columns={columns} dataSource={doctorappointment} />
      </div>
    </Layout>
  );
}

export default Doctorappointment;
