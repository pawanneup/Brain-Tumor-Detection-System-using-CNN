import {Form, Input, Button} from 'antd'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom'
import axios from "axios";
import toast from 'react-hot-toast';
import { showLoading, hideLoading } from "../redux/alertsSlice"; 


function Login() {
const {loading } = useSelector(state=> state.alerts);
 const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async(values) =>{
 

    try{
      dispatch(showLoading())
      const response = await axios.post('/api/user/login',values);
      dispatch(hideLoading())
   
      if(response.data.success)
        {
            toast.success(response.data.message);
            toast("Redirecting to Homepage");
            localStorage.setItem("token",response.data.data);
            navigate("/");
        }else{
          toast.error(response.data.message);
        }
      } catch(error){
        dispatch(hideLoading());
        toast.error("something went wrong");
    }
  };
  return (
    <div className='authentication'>
        <div className='authentication-form card p-2'>
          <h1 className='card-title'>Welcome Back</h1> 
            <Form layout='vertical' onFinish={onFinish}>
             
              <Form.Item label ='Email' name='email' rules={[
  { required: true, message: 'Please input your Registered Email!' }]}>
                <Input type="email" placeholder='Email' autoComplete="email" required />
              </Form.Item>
              <Form.Item label ='Password' name='password' rules={[
  { required: true, message: 'Please input your password!' },
  { min: 6, message: 'Password must be at least 6 characters long!' },
  { max: 14, message: 'Password must be at most 14 characters long!' }]}>
                <Input placeholder='Password' type='password' required/>
              </Form.Item>
              <Button className='primary-button my-3' htmlType='submit'>
                Login
              </Button>

              {/* <Form.Item label ='Email' name='email'>
                <Input placeholder='Email' type='email' autoComplete="email" />
              </Form.Item>
              <Form.Item label ='Password' name='password' >
                <Input placeholder='Password' type='password' autoComplete="current-password"/>
              </Form.Item>
              <Button className='primary-button my-3' htmlType='submit'>
                Login
              </Button> */}

                <br/>
                <Link className='anchor mt-2'  to='/register'>Click Here To Register</Link>
                
              {/* <Link className='primary-button p-2 new-btn  anchor mt-2'  to='/homepage'>Back To Homepage</Link> */}
            </Form>
        </div>
    </div>
  )
}

export default Login
