import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/PageTitle'
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import { message, Table } from 'antd';
import { axiosInstance } from '../../components/helpers/axiosInstance';


function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  // Dohvati korisnike
  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/users/get-all-users", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }

  const updateUserPermissions = async (user, action) => {
    try {
      let payload = null;
      if (action === "make-admin") {
        payload = {
          ...user,
          isAdmin: true,
        };
      } else if (action === "remove-admin") {
        payload = {
          ...user,
          isAdmin: false,
        };
      } else if (action === "block") {
        payload = {
          ...user,
          isBlocked: true,
        };
      } else if (action === "unblock") {
        payload = {
          ...user,
          isBlocked: false,
        };
      }else if (action === "delete") {
        payload = {
          ...user,
          isDeleted: true,
        };
      }

      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/users/update-user-permissions",
        payload
      );
      dispatch(HideLoading());
      if (response.data.success) {
        getUsers();
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Tabela sa registrovanim korisnicima
  const columns = [
    {
      title: "Name",
      dataIndex: "ime",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Stanje",
      dataIndex: "",
      render: (data) => {
        return data.isBlocked ? "Blokiran" : "Aktivan";
      },
    },
    {
      title: "Uloga",
      dataIndex: "",
      render: (data) => {
        console.log(data);
        if (data?.isAdmin) {
          return "Admin";
        } else {
          return "Korisnik";
        }
      },
    },
    {
      title: "Akcija",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          {record?.isBlocked && (
            <p
              className="user-premission-button btn"
              onClick={() => updateUserPermissions(record, "unblock")}
            >
              Odblokiraj
            </p>
          )}
          {!record?.isBlocked && record?.email !== 'aladin.dunp@gmail.com' && (
            <p
              className="user-premission-button btn"
              onClick={() => updateUserPermissions(record, "block")}
            >
              Blokiraj
            </p>
          )}
          {record?.isAdmin && record?.email !== 'aladin.dunp@gmail.com' && (
            <p
              className="user-premission-button btn"
              onClick={() => updateUserPermissions(record, "remove-admin")}
            >
              Ukloni admina
            </p>
          )}
          {!record?.isAdmin && (
            <p
              className="user-premission-button btn"
              onClick={() => updateUserPermissions(record, "make-admin")}
            >
              Dodeli admina
            </p>
          )}
          {!record?.isAdmin && (
            <p
              className="btn btn-danger"
              onClick={() => updateUserPermissions(record, "delete")}
            >
              Izbriši
            </p>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <div className='d-flex justify-content-between'>
        <PageTitle title='Korisnici' />

      </div>

      {/* Tabela sa korisnicima */}
      <Table columns={columns} dataSource={users} />


    </div>
  );
}

export default AdminUsers;