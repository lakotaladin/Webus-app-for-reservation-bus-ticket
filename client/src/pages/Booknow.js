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
    }, []);
    return (
        <div>
            {bus && (<Row className='mt-3' gutter={[30,30]}>
                {/* Informacije o autobusu pri rezervaciji karte */}
                <Col lg={12} xs={24} sm={24}>
                    <h1 className='text-2xl text-secondary'>{bus.name}</h1>
                    <h1 className='text-md'>{bus.from} - {bus.to}</h1>
                    <hr />

                    <div className='flex flex-col gap-1'>
                        <h1 className='text-lg'><b>Datum polaska:</b>{bus.journeyDate}</h1>
                        <h1 className='text-lg'><b>Cena:</b>{bus.price} &euro;</h1>
                        <h1 className='text-lg'><b>Vreme polaska:</b> {bus.departure}</h1>
                        <h1 className='text-lg'><b>Vreme dolaska:</b> {bus.arrivalTime}</h1>
                        <h1 className='text-lg'><b>Mesta preostalo:</b> {bus.capacity - bus.seatsBooked.length}</h1>
                    </div>
                    <hr />

                    {/* Prikaz selektovanih sedišta */}
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-2xl'>
                            Odabrana sedišta: {selectedSeats.join(" | ")}
                        </h1>
                        {/* Izlistana sedista */}
                        <h1 className='text-2xl mt-2'>Cena: {bus.price * selectedSeats.length} &euro;</h1>
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

                        <button className={`btn btn-primary ${selectedSeats.length === 0 && "disabled-btn"}`} disabled={selectedSeats.length === 0} >Rezerviši sada</button>
                    </StripeCheckout>

                </Col>
                {/* Selektovanje sedista */}
                <Col lg={12} sx={24} sm={24} >
                    <SeatSelection
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                        bus={bus}
                    />
                </Col>
            </Row>
            )}
        </div>
    )
}

export default Booknow