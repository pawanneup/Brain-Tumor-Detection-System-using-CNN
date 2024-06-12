import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import React from "react";
// import Layout from "../../components/Layout";
import { Button, Col, DatePicker, Form, Input, Row, TimePicker } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useNavigate } from "react-router-dom";
// import DoctorForm from "../../components/DoctorForm";
import moment from "moment";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  // const navigate = useNavigate()
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Failed to fetch doctor data");
    }
  };

  const bookNow = async () => {
    if (!date || !time) {
      toast.error("Please select date and time");
      return;
    }
    // setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        // navigate('/appointments');
        // setDate(null);
        // setTime(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };
  const checkAvailability = async () => {
    if (!date || !time) {
      toast.error("Please select date and time");
      return;
    }

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,

          date: date,
          time: time,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
        // setDate(null);
        // setTime(null);
      } else {
        toast.error(response.data.message);
        setIsAvailable(false);
      }
    } catch (error) {
      toast.error("Error checking appointment availability");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, [params.doctorId]);

  return (
    <Layout>
      <div className="body-padding">
        {doctor && (
          <div>
            <h1 className="page-title">Dr. 
              {doctor.firstName} {doctor.lastName}
            </h1>
            <hr />
            <Row gutter={20} className="mt-5">
            <Col>
                <img src="https://img.freepik.com/free-vector/book-your-date-mobile-phone_23-2148552969.jpg?t=st=1718026688~exp=1718030288~hmac=31645f3cb91c4eaa1eb873eda62fc357b6d0bcf5885a91140d6711a1b722011d&w=740" alt="Booking Image" width="100%" height={500}  />
            
              </Col>
              <Col span={8} sm={24} xs={24} lg={8}>
                <h1 className="normal-text">
                  <b>
                    Timings: <br />
                  </b>{" "}
                  {doctor.timings[0]} - {doctor.timings[1]}
                </h1>
                <p className="card-text">
                  {" "}
                  <b> Phone Number: </b>
                  {doctor.phoneNumber}
                </p>
                <p className="card-text">
                  <b>Address: </b>
                  {doctor.address}
                </p>
                <p className="card-text">
                  <b>Fee Per Consultation: </b>
                  {doctor.feePerConsultation}
                </p>

                <div className="d-flex flex-column pt-2">
                  <DatePicker
                    format="DD-MM-YYYY"
                    onChange={(value) => {
                      setIsAvailable(false);
                      setDate(moment(value).format("DD-MM-YYYY"));
                    }}
                  />
                  <TimePicker
                    format="HH:mm"
                    className="mt-3"
                    onChange={(value) => {
                      setIsAvailable(false);
                      setTime(moment(value).format("HH:mm"));
                    }}
                  />
                {!isAvailable &&   <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={checkAvailability}
                  >
                    Check Availability
                  </Button>}
                  {isAvailable && (
                    <Button
                      className="primary-button mt-3 full-width-button"
                      onClick={bookNow}
                    >
                      Book Now
                    </Button>
                  )}
                </div>
              </Col>
            
            </Row>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BookAppointment;
