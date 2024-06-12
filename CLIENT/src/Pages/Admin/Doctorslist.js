import {Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import Layout from "../../components/Layout";
import {toast} from 'react-hot-toast'
import moment from "moment";

function Doctorslist() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading()); // Show loading indicator before making the request
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading()); // Hide loading indicator after the request completes
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator in case of error
      console.error("Error fetching user data:", error); // Log the error for debugging
    }
  };
  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading()); // Show loading indicator before making the request
      const response = await axios.post("/api/admin/change-doctor-account-status", {doctorId: record._id, userId:record.userId, status: status}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading()); // Hide loading indicator after the request completes
      if (response.data.success) {
        toast.success(response.data.message)
        getDoctorsData()
      }
    } catch (error) {
      toast.error('Error Changing Doctor account Status')
      dispatch(hideLoading()); // Hide loading indicator in case of error
     
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []); // Empty dependency array to run the effect only once

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => <h1 className="card-text"> {record.firstName} {record.lastName}</h1>,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY"),
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
          {record.status === "pending" && <h1 className="anchor" onClick={()=>changeDoctorStatus(record,'approved')}>Approve</h1>}
          {record.status === "approved" && <h1 className="anchor" onClick={()=>changeDoctorStatus(record,'blocked')}>Block</h1>}
          {record.status === "blocked" && <h1 className="anchor" onClick={()=>changeDoctorStatus(record,'unblocked')}>Unblock</h1>}
          {record.status === "unblocked" && <h1 className="anchor"onClick={()=>changeDoctorStatus(record,'blocked')} >Block</h1>}

        </div>
      ),
    },
  ];



  return (
    <Layout>
      <div className="body-padding">
        <h1 className="page-header">Doctors List</h1>
        <Table columns={columns} dataSource={doctors} />
      </div>
    </Layout>
  )
}

export default Doctorslist;
