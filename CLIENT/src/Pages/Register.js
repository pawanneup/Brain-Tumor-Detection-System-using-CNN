// import {Form, Input, Button} from 'antd';
// import React from 'react';
// import {Link, useNavigate} from 'react-router-dom';
// import axios from "axios";
// import toast from 'react-hot-toast';
// import { useDispatch } from 'react-redux';
// import { showLoading, hideLoading } from "../redux/alertsSlice"; 

// function Register() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const onFinish = async(values) =>{
//     try{
//       dispatch(showLoading())
//       const response = await axios.post('/api/user/register',values);
//       dispatch(hideLoading())
 

//       if(response.data.success)
//         {
//             toast.success(response.data.message);
//             toast("Redirecting to login page");
//             navigate("/login");
//         }else{
//           toast.error(response.data.message);
//         }
//       } catch(error){
//         dispatch(hideLoading());
//         toast.error("something went wrong");
//     }
//   };
//   return (
//     <div className='authentication'>
//         <div className='authentication-form card p-2'>
//           <h1 className='card-title'>Nice To Meet You</h1> 
//             <Form layout='vertical' onFinish={onFinish}>
//               <Form.Item label ='Name' name='name' required>
//                 <Input placeholder='Name' autoComplete='name' required />
//               </Form.Item>
//               <Form.Item label ='Email' name='email' required>
//                 <Input placeholder='Email' type='email' autoComplete="email" />
//               </Form.Item>
//               <Form.Item label ='Password' name='password'  rules={[
//   { required: true, message: 'Please input your password!' },
//   { min: 6, message: 'Password must be at least 6 characters long!' },
//   { max: 14, message: 'Password must be at most 14 characters long!' }
// ]}>
//                 <Input placeholder='Password' type='password'  id='password' autoComplete="current-password" required/>
                
//               </Form.Item>
//               <Button className='primary-button my-3' htmlType='submit'>
//                 Register
//               </Button>
//               {/* <Button className='primary-button' >
//                 Back To Homepage
//               </Button> */}
//               <Link className='anchor mt-2'  to='/login'>Click Here To Login</Link>
              
//               {/* <Link className='primary-button p-2 new-btn anchor mt-2'  to='/homepage'>Click Here To Login</Link> */}
//             </Form>
//         </div>
//     </div>
//   )
// }

// export default Register
import { Form, Input, Button, Upload, message } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { UploadOutlined } from "@ant-design/icons";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [file, setFile] = useState(null);

  const handleUploadChange = (info) => {
    if (info.file.status === "removed") {
      setFile(null);
    } else if (info.file.status === "done") {
      setFile(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleBeforeUpload = (file) => {
    setFile(file);
    return false; // Prevent automatic upload by antd
  };

  const onFinish = async (values) => {
    dispatch(showLoading());
    const formData = new FormData();
    formData.append("imageUrl", file);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const response = await axios.post("/api/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(hideLoading());
      toast.success(response.data.message);
      toast("Redirecting to login page");
      navigate("/login");
    } catch (error) {
      console.error("Error uploading image:", error);
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };
  return (
    <div className="authentication">
      <div className="authentication-form card p-2">
        <h1 className="card-title">Nice To Meet You</h1>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name" required>
            <Input placeholder="Name" autoComplete="name" required />
          </Form.Item>
          <Form.Item label="Email" name="email" required>
            <Input placeholder="Email" type="email" autoComplete="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
              {
                max: 14,
                message: "Password must be at most 14 characters long!",
              },
            ]}
          >
            <Input
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              required
            />
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              name="imageUrl"
              listType="picture"
              beforeUpload={handleBeforeUpload}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Button className="primary-button my-3" htmlType="submit">
            Register
          </Button>
          <br />
          <Link className="anchor mt-2" to="/login">
            Click Here To Login
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;