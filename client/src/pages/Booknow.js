import React, { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { useDispatch } from 'react-redux';
import { Col, message, Row } from 'antd';
import { axiosInstance } from '../components/helpers/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import SeatSelection from '../components/SeatSelection';


function Booknow() {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [bus, setBus] = useState(null);
    // Dodaj autobus
    const getBus = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
                _id: params.id,
            });
            dispatch(HideLoading());
            if (response.data.success) {
                setBus(response.data.data);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }
    // Rezervisi sad funkcija
    const bookNow = async (transactionId) => {
        try {
            dispatch(ShowLoading());
            const response = await axiosInstance.post("/api/bookings/book-seat", {
                bus: bus._id,
                seats: selectedSeats,
                transactionId,
            });
            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                navigate("/bookings");
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    // Plaćanje 
    const onToken = async (token) => {
        try {
            dispatch(ShowLoading());
            const response = await axiosInstance.post("/api/bookings/make-payment", {
                token,
                amount: selectedSeats.length * bus.price * 100,
            });
            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                bookNow(response.data.data.transactionId);
            }
            else {
                message.error(response.data.message);
            }

        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    useEffect(() => {
        getBus();
    }, [dispatch]);
    return (
        <div className='d-flex flex-column'>

            {bus && (<Row className='mt-3' gutter={[30, 30]}>
                {/* Informacije o autobusu pri rezervaciji karte */}
                <Col className='biranjesedista' lg={12} xs={24} sm={24}>

                    <hr />
                    <div className='agencijaigrad p-3 rounded'>
                        <h1 className='naslovporudzbina text-2xl text-white'>{bus.name}</h1>
                        <br />
                        <h1 className='text-md text-white'><b>{bus.from} - {bus.to}</b></h1>
                    </div>
                    <hr />
                    {/* Osnovne informacije */}
                    <div className='flex flex-col gap-3 p-3'>
                        <h1 className='text-lg'><b>Datum polaska: </b>{bus.journeyDate}</h1>
                        <h1 className='text-lg'><b>Cena: </b>{bus.price} &euro;</h1>
                        <h1 className='text-lg'><b>Vreme polaska: </b> {bus.departure}h</h1>
                        <h1 className='text-lg'><b>Vreme dolaska: </b> {bus.arrival}h</h1>
                        <h1 className='text-lg'><b>Mesta preostalo: </b> {bus.capacity - bus.seatsBooked.length}</h1>
                    </div>
                    <hr />

                    {/* Prikaz selektovanih sedišta */}
                    <div className='cenaisedista flex flex-col gap-2 rounded p-3'>
                        <h1 className='text-2xl text-white'>
                            Odabrano sedište: <br />{selectedSeats.join(" | ")}
                        </h1>
                        {/* Izlistana sedista */}
                        <h1 className='text-2xl text-white mt-2'>Cena: {bus.price * selectedSeats.length} &euro;</h1>
                    </div>
                    <hr />
                    {/* Dugme za plaćanje karticom */}
                    <StripeCheckout
                        billingAddress
                        token={onToken}
                        currency="EUR"
                        amount={bus.price * selectedSeats.length * 100}
                        stripeKey="pk_test_51M7MF2Kd8JHAXBdFEo6ezEsKQFR8hWGUoydNO86zWAwzHCIZSHHPNrIe3M8gYHIIOvWclaAXe9m8xlvWfLLfFIgE00BgzBTNzJ"
                    >
                        {/* Dugme za rezervisanje karte */}

                        <button className={`dugmerezervisi btn ${selectedSeats.length === 0 && "disabled-btn"}`} disabled={selectedSeats.length === 0}>Rezerviši sada</button>
                    </StripeCheckout>
                </Col>
                <div className='d-flex' >
                    {/* Selektovanje sedista */}
                    <Col lg={12} sx={24} sm={24} >
                        <SeatSelection
                            selectedSeats={selectedSeats}
                            setSelectedSeats={setSelectedSeats}
                            bus={bus}
                        />
                    </Col>
                </div>
                <div className="d-flex flex-column align-items-start p-3">
                        <h4><i className="ri-information-line"></i> UPUTSTVO</h4><br/>
                        <p className='m-0'>1. Sedšte obojeno <b className='text-success'> zelenom</b> bojom je sedište koje Vi trenutno želite da rezervišete.</p><br/>
                        <p className='m-0'>2. Sedšte obojeno <b className='text-secondary'> sivom</b> bojom je sedište koje je rezervisano.</p><br/>
                </div>
            </Row>
            )}
        </div>

    )
}

export default Booknow