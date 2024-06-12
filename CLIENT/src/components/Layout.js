import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge} from "antd";
function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    // You can return a loading spinner or some fallback UI here
    return <div>Loading...</div>;
  }

  // const handleLogout = () => {
  //   localStorage.clear();
  //   navigate("/login");
  // };
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Book a Doctor",
      path: "/book",
      icon: "ri-home-line",
    },
    {
      name: "Check Tumor",
      path: "/checktumor",
      icon: "ri-hospital-line",
    },
    {
      name: "Appointments",
      path: "/user/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Apply Doctor",
      path: "/applydoctor",
      icon: "ri-hospital-line",
    },
    // {
    //   name: "Profile",
    //   path: "/profile",
    //   icon: "ri-user-line",
    // },
  ];
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Check Tumor",
      path: "/checktumor",
      icon: "ri-hospital-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    // {
    //   name: "Doctors",
    //   path: "/book",
    //   icon: "ri-home-line",
    // },
    {
      name: "Doctor Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line",
    },
  
    {
      name: "Doctors",
      path: "/admin/doctors",
      icon: "ri-user-line",
    },
    {
      name: "Appointment",
      path: "/book",
      icon: "ri-home-line",
    },

    // {
    //   name: "Profile",
    //   path: "/profile",
    //   icon: "ri-user-line",
    // },
  ];
  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor? doctorMenu: userMenu;
  const role = user?.isAdmin? "Admin" : user?.isDoctor ? "Doctor" : "User" ;
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  
    console.log("Search query:", searchQuery);
 
  };
  return (
    <div className="main">
      <div className="d-flex  layout">
        <div className={`${collapsed ? "collapsed-sidebar" : "sidebar"}`}>
          <div className="sidebar-header">
            <h1>PN</h1>
            <h2 className="role-text">{role}</h2>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={menu.path}
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div className="d-flex menu-item" onClick={handleLogout}>
              <i className="ri-logout-circle-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-2-fill header-icon "
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-icon "
                onClick={() => setCollapsed(true)}
              ></i>
            )}
            {/* <input className="queries"></input> */}
            {/* <form className="search-form" onSubmit={handleSearchSubmit}>
  <input
    type="text"
    placeholder="Any Queries...."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="search-input"
  />
  <button type="submit" className="search-button">Search</button>
</form> */}
            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotifications.length}
                onClick={() => navigate("/notifications")}
              >
                <i className="ri-notification-line header-icon px-3"></i>
              </Badge>

              <Link className="anchor mx-3" to="/yourprofile">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body" >{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
