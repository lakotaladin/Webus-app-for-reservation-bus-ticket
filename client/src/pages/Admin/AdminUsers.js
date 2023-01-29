import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/PageTitle'
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import { Button, Input, message, Table,  Popconfirm } from 'antd';
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
      } else if (action === "delete") {
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
      title: "Ime",
      dataIndex: "ime",
      // Logika iz ant design-a za pretrazivanje itema po tabeli po imenu agencije
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
          <>
            <div className='d-flex flex-column'>
              <Input autoFocus placeholder="Pretražite po imenu"
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                  confirm({ closeDropdown: false });
                }}

                onPressEnter={() => {
                  confirm();
                }}

                onBlur={() => {
                  confirm();
                }}
              ></Input>
              <Button className="bg-success text-white mt-1" onClick={() => { confirm() }}>Pretraži</Button>
              <Button onClick={() => { clearFilters() }} type="danger">Resetuj</Button>
            </div>
          </>
        );
      },
      filterIcon: () => {
        return <i className="ri-search-eye-line"></i>
      },
      onFilter: (value, record) => {
        return record.ime.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: "Email",
      dataIndex: "email",
      // Logika iz ant design-a za pretrazivanje itema po tabeli po imenu agencije
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
          <>
            <div className='d-flex flex-column'>
              <Input autoFocus placeholder="Pretražite po imenu"
                value={selectedKeys[0]}
                onChange={(e) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                  confirm({ closeDropdown: false });
                }}

                onPressEnter={() => {
                  confirm();
                }}

                onBlur={() => {
                  confirm();
                }}
              ></Input>
              <Button className="bg-success text-white mt-1" onClick={() => { confirm() }}>Pretraži</Button>
              <Button onClick={() => { clearFilters() }} type="danger">Resetuj</Button>
            </div>
          </>
        );
      },
      filterIcon: () => {
        return <i className="ri-search-eye-line"></i>
      },
      onFilter: (value, record) => {
        return record.email.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: "Stanje",
      dataIndex: "",
      render: (data) => {
        // user?.isAdministrator ? 'Administrator' : user?.isAdmin ? 'Admin' : 'Korisnik'
        return data.isVerifyed === false ? 'Mail nije verifikovan' : data.isVerifyed === true ? 'Aktivan' : data.isBlocked ? "Blokiran" : "Aktivan";
      },
    },
    {
      title: "Uloga",
      dataIndex: "",
      render: (data) => {
        if (data?.isAdministrator) {
          return "Administrator";
        } else if (data?.isAdmin) {
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
          {!record?.isAdmin && !record?.isAdministrator && (
            <p
              className="user-premission-button btn"
              onClick={() => updateUserPermissions(record, "make-admin")}
            >
              Dodeli admina
            </p>
          )}
          {!record?.isAdministrator && (
            <Popconfirm
              title="Da li ste sigurni?"
              onConfirm={() => updateUserPermissions(record, "delete")}
            >
              <button className="dugmeizbrisi btn btn-danger">Izbriši</button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, [dispatch]);
  return (
    <div>
      <div className='d-flex justify-content-between my-1'>
        <PageTitle title='Admin panel' />

      </div>

      {/* Tabela sa korisnicima */}
      <Table rowKey={"_id"} columns={columns} dataSource={users} />


    </div>
  );
}

export default AdminUsers;