import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/PageTitle'
import BusForm from '../../components/BusForm'
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import { Button, Input, message, Table } from 'antd';
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
      title: "Ime agencije",
      dataIndex: "name",
      // Logika iz ant design-a za pretrazivanje itema po tabeli po imenu agencije
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
        <>
        <div className='d-flex flex-column'>
        <Input autoFocus placeholder="Pretražite po imenu"
        value={selectedKeys[0]}
        onChange={(e) =>{
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
        <Button className="bg-success text-white mt-1" onClick={()=>{confirm()}}>Pretraži</Button>
        <Button className="searchbuttontable mt-1" onClick={()=>{clearFilters()}} type="danger">Resetuj</Button>
        </div>
        </>
        );
      },
      filterIcon: () => {
        return <i className="ri-search-eye-line"></i>
      },
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase())
      }
      
    },
    {
      title: "Broj autobusa",
      dataIndex: "number",
      // Logika iz ant design-a za pretrazivanje itema po tabeli po broju busa
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
        <>
        <div className='d-flex flex-column'>
        <Input autoFocus placeholder="Pretražite po broju autobusa"
        type="number"
        value={selectedKeys[0]}
        onChange={(e) =>{
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
        <Button className="bg-success text-white mt-1" onClick={()=>{confirm()}}>Pretraži</Button>
        <Button className="searchbuttontable" onClick={()=>{clearFilters()}} type="danger">Resetuj</Button>
        </div>
        </>
        );
      },
      filterIcon: () => {
        return <i className="ri-search-eye-line"></i>
      },
      onFilter: (value, record) => {
        return record.number === value;
      }
    },
    {
      title: "Od grada",
      dataIndex: "from",
      // Logika iz ant design-a za pretrazivanje itema po tabeli po imenu agencije
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
        <>
        <div className='d-flex flex-column'>
        <Input autoFocus placeholder="Polazi iz"
        value={selectedKeys[0]}
        onChange={(e) =>{
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
        <Button className="bg-success text-white mt-1" onClick={()=>{confirm()}}>Pretraži</Button>
        <Button className="searchbuttontable" onClick={()=>{clearFilters()}} type="danger">Resetuj</Button>
        </div>
        </>
        );
      },
      filterIcon: () => {
        return <i className="ri-search-eye-line"></i>
      },
      onFilter: (value, record) => {
        return record.from.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: "Do grada",
      dataIndex: "to",
      // Logika iz ant design-a za pretrazivanje itema po tabeli po imenu agencije
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
        <>
        <div className='d-flex flex-column'>
        <Input autoFocus placeholder="Dolazi u"
        value={selectedKeys[0]}
        onChange={(e) =>{
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
        <Button className="bg-success text-white mt-1" onClick={()=>{confirm()}}>Pretraži</Button>
        <Button className="searchbuttontable" onClick={()=>{clearFilters()}} type="danger">Resetuj</Button>
        </div>
        </>
        );
      },
      filterIcon: () => {
        return <i className="ri-search-eye-line"></i>
      },
      onFilter: (value, record) => {
        return record.to.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: "Datum putovanja",
      dataIndex: "journeyDate",
      // Logika iz ant design-a za pretrazivanje itema po tabeli po broju busa
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
        <>
        <div className='d-flex flex-column'>
        <Input autoFocus placeholder="Pretražite po datumu"
        type="date"
        value={selectedKeys[0]}
        onChange={(e) =>{
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
        <Button className="bg-success text-white mt-1" onClick={()=>{confirm()}}>Pretraži</Button>
        <Button className="searchbuttontable" onClick={()=>{clearFilters()}} type="danger">Resetuj</Button>
        </div>
        </>
        );
      },
      filterIcon: () => {
        return <i className="ri-search-eye-line"></i>
      },
      onFilter: (value, record) => {
        return record.journeyDate === value;
      }
    },
    {
      title: "Status autobusa",
      dataIndex: "status",
    },
    {
      title: "Akcija",
      dataIndex: "action",
      render: (action, record) => (
        <div className='d-flex gap-3'>
          <i className="ri-edit-line" onClick={() => {
            console.log(record)
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
    // getNamesandNumbers();
  }, []);
  return (
    <div className='glavniodautobusa'>
      <div className='d-flex justify-content-between my-1'>
        <PageTitle title='Autobuske rute' />
        <button className='dugme m-2' onClick={() => setShowBusForm(true)}> Dodaj autobusku rutu </button>
      </div>

      {/* Tabela sa autobusima */}
      {/* Instalirana biblioteka moment za datum i vreme */}
      <Table rowKey={"_id"} className='tabelaautobusi' columns={columns} dataSource={buses} />

      {/* Prikazivanje forme za dodavanje autobusa */}
      {showBusForm && <BusForm showBusForm={showBusForm} setShowBusForm={setShowBusForm} type={selectedBus ? "edit" : "add"} selectedBus={selectedBus} setSelectedBus={setSelectedBus} getData={getBuses} />}
    </div>
  );
}

export default AdminBuses