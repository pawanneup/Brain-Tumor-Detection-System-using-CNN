import Layout from "../components/Layout";
import React from 'react';
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";

function Notifications() {
    const {user} = useSelector((state)=> state.user);
    const navigate=useNavigate();
    const dispatch =useDispatch();
    const markAllAsSeen=async()=>{
        try{
            dispatch(showLoading())
            const response = await axios.post('/api/user/mark-all-notifications-as-seen',{userId: user._id} ,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading())
       
      
            if(response.data.success)
              {
                  toast.success(response.data.message);
                  dispatch(setUser(response.data.data));
                 
              }else{
                toast.error(response.data.message);
              }
            } catch(error){
              dispatch(hideLoading());
              toast.error("something went wrong");
          }
    }
    const deleteAll=async()=>{
        try{
            dispatch(showLoading())
            const response = await axios.post('/api/user/delete-all-notifications',{userId: user._id} ,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading())
       
      
            if(response.data.success)
              {
                  toast.success(response.data.message);
                  dispatch(setUser(response.data.data));
                 
              }else{
                toast.error(response.data.message);
              }
            } catch(error){
              dispatch(hideLoading());
              toast.error("something went wrong");
          }
    }
    if (!user || !user.unseenNotifications) {
        return null; // or render a loading indicator or placeholder
    }
  return (
    <Layout>
        <div className="body-padding">
            <h1 className='page-title'>Notifications</h1>
            <Tabs>
                <Tabs.TabPane tab='unseen' key={0}>
                    <div className="d-flex justify-content-end"> 
                        <h1 className="underline" onClick={()=>markAllAsSeen()}>Mark all as seen</h1>
                    </div>
                    {user?.unseenNotifications.map((notifications)=>(
                        <div className="card p-2 m-2 " onClick={()=>navigate(notifications.onClickPath)}>
                            <div className="card-text">{notifications.message}</div>
                        </div>
                        
                    ))}
                </Tabs.TabPane>
                <Tabs.TabPane tab='seen' key={1}>
                    <div className="d-flex justify-content-end"> 
                        <h1 className="underline" onClick={()=>deleteAll()} >Delete all</h1>
                    </div>
                    {user?.seenNotifications.map((notifications)=>(
                        <div className="card p-2 m-2 " onClick={()=>navigate(notifications.onClickPath)}>
                            <div className="card-text">{notifications.message}</div>
                        </div>
                    ))}
                </Tabs.TabPane>
            </Tabs>
        </div>
    </Layout>
  )
}

export default Notifications;
