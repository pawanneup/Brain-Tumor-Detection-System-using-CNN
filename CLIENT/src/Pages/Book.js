import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";

function Book() {
  const [doctors, setDoctors] = useState([]);
  const dispatch= useDispatch()
  const getData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get(
        "/api/user/get-all-approved-doctors",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading())
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading())
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
      <div className="body-padding">
        <h1 className="page-title">Book an Appointment </h1>
        <hr />
      <Row gutter={20}>
        {doctors.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
      
      </div>
    </Layout>
  );
}

export default Book;
