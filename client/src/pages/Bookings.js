import { message, Modal, Table } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "../components/PageTitle";
import { axiosInstance } from "../components/helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useReactToPrint } from "react-to-print";

function Bookings() {
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const dispatch = useDispatch();
    // Prikazi sve rezervacije
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
      }

    const columns = [
        {
            title: "Ima autobusa",
            dataIndex: "name",
            key: "bus",
        },
        {
            title: "Broj autobusa",
            dataIndex: "number",
            key: "bus",
        },
        {
            title: "Datum polaska",
            dataIndex: "journeyDate",
        },
        {
            title: "Vreme polaska",
            dataIndex: "departure",
        },
        {
            title: "Sedišta",
            dataIndex: "seats",
            render: (seats) => {
                return seats.join(", ");
            }
        },
        {
            title: "Akcija",
            dataIndex: "action",
            render: (text, record) => {
                <div>
                    <p className='text-md underline'
                        onClick={() => {
                            setSelectedBooking(record);
                            setShowPrintModal(true);
                        }}
                    >
                        Odštampaj kartu
                    </p>
                </div>
            }
        },
    ];

    useEffect(() => {
        getBookings();
    }, []);
// Logika za kopiranje autobuske karte, preuzeto sa stranice npm reacttoprint
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
    return (
        <div>
            <PageTitle title="Rezervacije" />
            <div className='mt-2'>
            <Table dataSource={bookings} columns={columns} />
            </div>
        {  showPrintModal &&  ( <Modal title="Odštampaj kartu"
                onCancel={
                    () => {
                        setShowPrintModal(false);
                        setSelectedBooking(null);

                    }
                }
                open={showPrintModal}
                okText="Odštampaj"
                onOk={handlePrint}
            >
                <div className='d-flex flex-column p-5' ref={componentRef}>
                    <p>Autobus: {selectedBooking.name}</p>
                    <p>{selectedBooking.from} - {selectedBooking.to}</p>
                    <hr />
                    <p>
                        <span>Datum polaska:</span>{" "}
                        {moment(selectedBooking.journeyDate).format("DD-MM-YYYY")}
                    </p>
                    <p>
                    <span>Vreme polaska:</span>{" "}
                        {selectedBooking.departure}
                    </p>
                    <hr />
                    <p>
                    <span>Brojevi sedišta:</span>{" "} <br />
                        {selectedBooking.seats}
                    </p>
                    <hr />
                    <p>
                    <span>Ukupan iznos:</span>{" "}
                        {selectedBooking.price * selectedBooking.seats.length}
                    </p>
                </div>

            </Modal> 
            
         )}
        </div>
    )
}

export default Bookings