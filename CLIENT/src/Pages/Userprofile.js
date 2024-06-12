

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Card, Avatar, Button, Spin, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import { TwitterOutlined, FacebookOutlined, InstagramOutlined } from '@ant-design/icons';


const { Title, Text } = Typography;

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  

  const fetchUserProfile = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Spin size="large" />
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Card style={{ maxWidth: 500, margin: 'auto', marginTop: '2rem' }} className='card profile'>
        <div className="profile-header">
          <Avatar size={200} src="https://via.placeholder.com/150" />
          <div className="profile-details">
            <Title className='profile-name' size='large' level={1}>{user.name}</Title>
            <Button type="primary" size='large'>Change Photo</Button>
            <div className="follow-button">
              <Button type="primary" size="large">Edit Profile</Button>
            </div>
          </div>
        </div>
        <div className='text'>
          <Text strong>User ID: </Text>
          <Text>{user._id}</Text>
        </div>
        <div className='text'>
          <Text strong>Email: </Text>
          <Text>{user.email}</Text>
        </div>
        <div className='text'>
          <Text strong>Created At: </Text>
          <Text>{user.createdAt}</Text>
        </div>
        <div className="social-icons">
          <Button type="primary" shape="circle" icon={<TwitterOutlined />} size="large" style={{ marginRight: '10px' }} />
          <Button type="primary" shape="circle" icon={<FacebookOutlined />} size="large" style={{ marginRight: '10px' }} />
          <Button type="primary" shape="circle" icon={<InstagramOutlined />} size="large" />
        </div>
        <div className="follower-count">
          Followers: 32
        </div>
      </Card>
      <style jsx>{`
        .profile-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        .profile-details {
          margin-left: 1rem;
        }
        @media (max-width: 768px) {
          .card.profile {
            height: 100vh;
            margin: 0; /* Remove margin to utilize full viewport height */
            padding: 1rem; /* Add padding for some spacing */
          }
          .profile-header {
            flex-direction: column;
            align-items: center;
          }
          .profile-details {
            margin-left: 0;
            text-align: center;
          }
        }
      `}</style>
    </Layout>
  );
}

export default UserProfile;
