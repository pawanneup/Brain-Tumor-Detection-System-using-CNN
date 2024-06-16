import React, { useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import {Link} from "react-router-dom";

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
    <div>
    
       <div class="home-div">
        <div class="overlay"></div>
          <div class="content">
              <h1><h2 className="home-h2"> Welcome On The Landing Page of</h2>Brain Tumour Detection & Doctor Appointment System
              <p>Using Advanced Image Processing and CNN Model</p>
              {/* <Button className="home-btn" to='/login' >Login</Button>
             <br/>
              <Button className="home-btn" to='/register'>Signup</Button> */}
              <Link className='anchor homepage-btn m-2 p-2 primary-button mt-2'  to='/login'>Click Here To Login</Link>
              <br/>
              <Link className='primary-button homepage-btn m-2 anchor p-2 mt-2'  to='/register'>Click Here To Register</Link>
              </h1>
             
          </div>
          <br/>
          
        </div>
       
    </div>
  );
}

export default Home;
