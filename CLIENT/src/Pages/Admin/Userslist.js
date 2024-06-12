import {Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import Layout from "../../components/Layout";
import moment from "moment";

function Userslist() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading()); // Show loading indicator before making the request
      const response = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading()); // Hide loading indicator after the request completes
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator in case of error
      console.error("Error fetching user data:", error); // Log the error for debugging
    }
  };

  useEffect(() => {
    getUsersData();
  }, []); // Empty dependency array to run the effect only once

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY"),
        
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="body-padding">
      <h1 className="page-header">Users List</h1>
      <Table columns={columns} dataSource={users} />
      </div>
    </Layout>
  );
}

export default Userslist;

