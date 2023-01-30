import React, { useState } from 'react';
import '../resources/layout.css';
import { Route, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../resources/webuslogo.png'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false); // collapse bar
  const { user } = useSelector(state => state.users);

  // Korisnik - navigacija
  const userMenu = [
    {
      name: 'Početna',
      path: '/',
      icon: 'ri-home-2-line',
    },
    {
      name: 'Rezervacije',
      icon: 'ri-file-list-line',
      path: '/bookings',
    },
    {
      name: 'Profil',
      path: `/profile/${user?._id}`,
      icon: 'ri-profile-line',
    },
    {
      name: 'Kontakt',
      icon: 'ri-information-line',
      path: '/contact',
    },
    {
      name: 'Odjava',
      icon: 'ri-logout-box-line',
      path: '/logout',
    }
  ];

  // Moderator - navigacija
  const adminMenu = [
    {
      name: 'Početna',
      path: '/',
      icon: 'ri-home-2-line',
    },
    {
      name: 'Autobusi',
      path: '/admin/buses',
      icon: 'ri-bus-fill',
    },
    {
      name: 'Rezervacije',
      path: '/bookings',
      icon: 'ri-file-list-line',
    },
    {
      name: 'Kontakt',
      icon: 'ri-information-line',
      path: '/contact',
    },
    {
      name: 'Profil',
      path: `/profile/${user?._id}`,
      icon: 'ri-profile-line',
    },
    {
      name: 'Odjavi se',
      path: '/logout',
      icon: 'ri-logout-box-line',
    }
  ];

  // Administrator - navigacija
  const administratorMenu = [
    {
      name: 'Početna',
      path: '/',
      icon: 'ri-home-2-line',
    },
    {
      name: 'Autobusi',
      path: '/admin/buses',
      icon: 'ri-bus-fill',
    },
    {
      name: 'Rezervacije',
      path: '/bookings',
      icon: 'ri-file-list-line',
    },
    {
      name: 'Profil',
      path: `/profile/${user?._id}`,
      icon: 'ri-profile-line',
    },
    {
      name: 'Panel',
      path: '/admin/users',
      icon: 'ri-user-settings-line',
    },
    {
      name: 'Odjavi se',
      path: '/logout',
      icon: 'ri-logout-box-line',
    }
  ];

  const menuToBeRendered = user?.isAdministrator ? administratorMenu : user?.isAdmin ? adminMenu : userMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes('book-now')) {
    activeRoute = "/";
  }
  else { }
  return (

    // glavni div
    <div className='layout-parent'>


      <Layout>
        <Sider
          className='sider'
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >

          <div className="divicons d-flex flex-column  menu">
          <div className='d-flex flex-column'>
            <p className='role d-flex text-white'>{user?.user}<i title='Uloga na sajtu' className="ri-user-settings-line"></i>{user?.isAdministrator ? 'Administrator' : user?.isAdmin ? 'Admin' : 'Korisnik'}</p>
          </div>
          <div className='global-item-container'>
            {menuToBeRendered.map((item, index) => {
              return (
                <div
                  key={item.path}
                  className={`${activeRoute === item.path && "active-menu-item"
                    } menu-item`}
                >
                  <div className='menu-item'>
                    <i className={item.icon}></i>
                    {!collapsed && (
                      <span
                        onClick={() => {
                          if (item.path === "/logout") {
                            localStorage.removeItem("token");
                            navigate("/login");
                          } else {
                            navigate(item.path);
                          }
                        }}
                      >
                        {item.name}
                      </span>
                    )}
                  </div>
                </div>
              
              );
            })}
          </div>
          </div>
        </Sider>
      </Layout>

  
      <div className='body'>
        <div className="header d-flex flex-row justify-content-center">
          <div className='headerlogo d-flex justify-content-center'>
            <Link title='Webus logo' to='/'><img className='logo m-1 p-0' src={logo} alt='Webus logo' /></Link>
          </div>
        </div>

        {/* Kartice */}
        <div className='content'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout