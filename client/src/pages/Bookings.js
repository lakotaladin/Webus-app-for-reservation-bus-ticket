import { Button, Input, message, Modal, Table } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import JsBarcode from 'jsbarcode'
import PageTitle from "../components/PageTitle";
import logo from "../resources/webuslogo.png";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useReactToPrint } from "react-to-print";

function Bookings() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  //   Logika za dohvatanje autobusa
  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-bookings-by-user-id",
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  // Tabela i prikaz svih rezervisanih autobuskih karti
  const columns = [
    {
      title: "Ime agencije",
      dataIndex: "name",
      key: "bus",
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
              <Button className="searchbuttontable" onClick={() => { clearFilters() }} type="danger">Resetuj</Button>
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
      key: "bus",
      // Logika iz ant design-a za pretrazivanje itema po tabeli po broju busa
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
          <>
            <div className='d-flex flex-column'>
              <Input autoFocus placeholder="Pretražite po broju autobusa"
                type="number"
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
              <Button className="searchbuttontable" onClick={() => { clearFilters() }} type="danger">Resetuj</Button>
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
      title: "Datum polaska",
      dataIndex: "journeyDate",
      // Logika iz ant design-a za pretrazivanje itema po tabeli po broju busa
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
          <>
            <div className='d-flex flex-column'>
              <Input autoFocus placeholder="Pretražite po datumu"
                type="date"
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
              <Button className="searchbuttontable" onClick={() => { clearFilters() }} type="danger">Resetuj</Button>
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
      title: "Vreme dolaska",
      dataIndex: "departure",
    },
    {
      title: "Sedište/a",
      dataIndex: "seats",
      render: (seats) => {
        return seats.join(", ");
      },
    },
    {
      title: "Akcija",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <p
            className="text-md underline"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}
          >
            Odštampaj kartu
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, [dispatch]);

  useEffect(() => {
    if (!selectedBooking?._id) return
    JsBarcode('#bus-' + selectedBooking._id, selectedBooking._id)
  }, [selectedBooking])

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      {/* Tabela sa rezervisanim kartama */}
      <PageTitle title="Rezervisane karte" />
      <div className="mt-2">
        <Table dataSource={bookings} columns={columns} />
      </div>

      {showPrintModal && (
        <Modal
          title="Štampanje karte"
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedBooking(null);
          }}
          open={showPrintModal}
          okText="Odštampaj"
          onOk={handlePrint}
          footer={[
            <Button key="back" id="stampajzatvori">
              Zatvori
            </Button>,
            <Button key="submit" id="stampajdugme">
              Štampaj
            </Button>
          ]}
        >
          <div key={getBookings} className="d-flex flex-column p-1" ref={componentRef}>
            <div>
              <img style={{ width: 200, padding: 30 }} src={logo} alt="Webus logo" />
            </div>
            <p><b>Agencija: <br />{selectedBooking.name}</b></p>
            <p>
              <b>{selectedBooking.from} - {selectedBooking.to}</b>
            </p>
            <hr style={{ border: "1px dashed black", marginLeft: "10%", marginRight: "10%" }} />
            <p>
              <span>Datum polaska:</span>{" "}
              {moment(selectedBooking.journeyDate).format("DD-MM-YYYY")}
            </p>
            <p>
              <span>Vreme dolaska:</span> {selectedBooking.departure}h
            </p>

            <p>
              <span>Odabrano sedište/a:</span> <br />
              {selectedBooking.seats}
            </p>

            <p>Šifra rezervacije: <br /><img style={{ width: "60%" }} id={'bus-' + selectedBooking._id} alt="Bar kod karte"></img></p>

            <p style={{ border: "1px dotted black", width: "280px", margin: "auto", padding: "5px", marginBottom: "4%" }} >
              <span><b>Iznos uplate:</b></span>{" "}
              <b>{selectedBooking.price * selectedBooking.seats.length} &euro; </b>
            </p>
            <p>
              *** HVALA ŠTO KORISTITE NAŠE USLUGE ***<br />
              Webus Team
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Bookings;
