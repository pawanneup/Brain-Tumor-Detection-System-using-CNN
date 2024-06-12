import React, { useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
function Home() {
  const getData = async () => {
    try {
      const response = await axios.post(
        "/api/user/get-user-info-by-id",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
       <div class="home-div">
        <div class="overlay"></div>
          <div class="content">
              <h1>Brain Tumour Detection & Doctor Appointment System
              <p>Using advanced image processing and CNN model</p>
              </h1>
              
          </div>
    </div>
    </Layout>
  );
}

export default Home;
