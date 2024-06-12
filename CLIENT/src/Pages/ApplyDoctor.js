import Layout from "../components/Layout";
import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";

function ApplyDoctor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/applydoctor", {
        ...values,
        userId: user._id,
        timings: [
          moment(values.timings[0]).format("HH:mm"),
          moment(values.timings[1]).format("HH:mm"),
        ],
      },{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        //   toast("Redirecting to login page");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };
  return (
    <Layout>
      
        <h1 className="page-title">Apply For Doctor Account</h1>
        <hr />
        <DoctorForm onFinish={onFinish}/>
        {/* <Form layout="vertical" onFinish={onFinish}>
          <h2 className="card-title mt-3 mb-2">Personal Information</h2>
          <Row gutter={10}>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="First Name"
                name="firstName"
                rules={[{ required: true }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="Last Name"
                name="lastName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true }]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="Website"
                name="website"
                rules={[{ required: true }]}
              >
                <Input placeholder="Website" />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="Address"
                name="address"
                rules={[{ required: true }]}
              >
                <Input placeholder="Address" />
              </Form.Item>
            </Col>
          </Row>
          <hr />
          <h2 className="card-title mt-3 mb-2">Professional Information</h2>
          <Row gutter={10}>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="Specialization"
                name="specialization"
                rules={[{ required: true }]}
              >
                <Input placeholder="Specialization" />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="Experience"
                name="experience"
                rules={[{ required: true }]}
              >
                <Input placeholder="Experience" type="number" />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="Fee Per Consultation"
                name="feePerConsultation"
                rules={[{ required: true }]}
              >
                <Input placeholder="Fee Per Consultation" type="number" />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} sm={24} lg={8}>
              <Form.Item
                required
                label="Timings"
                name="timings"
                rules={[{ required: true }]}
              >
                <TimePicker.RangePicker />
              </Form.Item>
            </Col>
            {/* <Col span={8} xs={24} sm={24} lg={8}>
                      <Form.Item required label="Website" name='website' rules={[{required:true}]}>
                          <Input placeholder="Website"/>
                      </Form.Item>
                  </Col> 
           </Row>
          <div className="d-flex justify-content-end">
            <Button className="primary-button" htmlType="submit">
              SUBMIT
            </Button>
          </div>
        </Form> */} 
        
    </Layout>
  );
}

export default ApplyDoctor;
