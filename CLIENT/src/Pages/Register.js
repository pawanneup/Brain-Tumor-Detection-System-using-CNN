import {Form, Input, Button} from 'antd';
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from "../redux/alertsSlice"; 

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async(values) =>{
    try{
      dispatch(showLoading())
      const response = await axios.post('/api/user/register',values);
      dispatch(hideLoading())
 

      if(response.data.success)
        {
            toast.success(response.data.message);
            toast("Redirecting to login page");
            navigate("/login");
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
          <h1 className='card-title'>Nice To Meet You</h1> 
            <Form layout='vertical' onFinish={onFinish}>
              <Form.Item label ='Name' name='name' required>
                <Input placeholder='Name' autoComplete='name' required />
              </Form.Item>
              <Form.Item label ='Email' name='email' required>
                <Input placeholder='Email' type='email' autoComplete="email" />
              </Form.Item>
              <Form.Item label ='Password' name='password'  rules={[
  { required: true, message: 'Please input your password!' },
  { min: 6, message: 'Password must be at least 6 characters long!' },
  { max: 14, message: 'Password must be at most 14 characters long!' }
]}>
                <Input placeholder='Password' type='password'  id='password' autoComplete="current-password" required/>
                
              </Form.Item>
              <Button className='primary-button my-3' htmlType='submit'>
                Register
              </Button>
              <br/>
              <Link className='anchor mt-2'  to='/login'>Click Here To Login</Link>
            </Form>
        </div>
    </div>
  )
}

export default Register
