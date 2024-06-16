import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import moment from "moment";

function Appointment() {
  const [appointment, setAppointment] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentData = async () => {
    try {
      dispatch(showLoading()); // Show loading indicator before making the request
      const response = await axios.get("/api/user/get-appointments-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading()); // Hide loading indicator after the request completes
      if (response.data.success) {
        setAppointment(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator in case of error
      console.error("Error fetching user data:", error); // Log the error for debugging
    }
  };
  const columns = [
    {
      title:"Id",
      dataIndex:"_id",
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => <h1 className="card-text"> {record.doctorInfo.firstName} {record.doctorInfo.lastName}</h1>,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      render: (text, record) => <h1 className="card-text"> {record.doctorInfo.phoneNumber} </h1>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => <h1 className="card-text"> {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH-mm")}</h1>,
    },
    {
      title: "status",
      dataIndex: "status",
    },
   
  ];
  useEffect(() => {
    getAppointmentData();
  }, []);

  return (
    <Layout>
    <div className="body-padding">
      <h1 className="page-header">Appointments</h1>
      <Table columns={columns} dataSource={appointment} />
    </div>
  </Layout>
  );
}

export default Appointment;
