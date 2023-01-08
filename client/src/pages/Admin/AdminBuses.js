import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/PageTitle'
import BusForm from '../../components/BusForm'
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import { message, Table } from 'antd';
import { axiosInstance } from '../../components/helpers/axiosInstance';


function AdminBuses() {
  // Pop-up forma za dodavanje autobusa
  const [showBusForm, setShowBusForm] = useState(false);
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
// Dodaj autobus
  const getBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-all-buses", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
// Izbrisi autobus
  const deleteBus = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/delete-bus", {
        _id: id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBuses();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }

  // Tabela sa autobuskim kartama
  const columns = [
    {
      title: "Ime autobusa",
      dataIndex: "name",
    },
    {
      title: "Broj autobusa",
      dataIndex: "number",
    },
    {
      title: "Od",
      dataIndex: "from",
    },
    {
      title: "Do",
      dataIndex: "to",
    },
    {
      title: "Datum putovanja",
      dataIndex: "journeyDate",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Akcija",
      dataIndex: "actions",
      render: (action, record) => (
        <div className='d-flex gap-3'>
          <i className="ri-edit-line" onClick={() => {
            setSelectedBus(record);
            setShowBusForm(true);
          }}></i>
          <i className="ri-delete-bin-line" onClick={() => {
            deleteBus(record._id);
          }} ></i>
        </div>
      )
    }
  ]

  useEffect(() => {
    getBuses();
  }, []);
  return (
    <div>
      <div className='d-flex justify-content-between'>
        <PageTitle title='Autobusi' />
        <button className='dugme m-2' onClick={() => setShowBusForm(true)}> Dodaj autobus </button>
      </div>

      {/* Tabela sa autobusima */}
      {/* Instalirana biblioteka moment za datum i vreme */}
      <Table columns={columns} dataSource={buses} />

      {/* Prikazivanje forme za dodavanje autobusa */}
      {showBusForm && <BusForm showBusForm={showBusForm} setShowBusForm={setShowBusForm} type={selectedBus ? "edit" : "add"} selectedBus={selectedBus} setSelectedBus={setSelectedBus} getData={getBuses} />}
    </div>
  );
}

export default AdminBuses