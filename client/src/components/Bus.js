import React from 'react';
import { useNavigate } from 'react-router-dom';

function Bus({ bus }) {
    const navigate = useNavigate();
    return (
        <div className='card p-2'>
            <h1 className='text-lg primary-text'>{bus.name}</h1>
            <hr />
            <div className='d-flex justify-content-between align-items-end'>
                <div>
                    {/* IZ GRADA */}
                    <p className='text-sm'>Iz:</p>
                    <p className='text-sm'>{bus.from}</p>
                </div>
                {/* DO GRADA */}
                <div>
                    <p className='text-sm'>Do:</p>
                    <p className='text-sm'>{bus.to}</p>
                </div>

                {/* CENA KARTE */}
                <div>
                    <p className='text-sm'>Cena:</p>
                    <p className='text-sm'>&euro {bus.price}</p>
                </div>
            </div>
            <div className='d-flex justify-content-between align-items-end'>
                {/* DATUM PUTOVANJA */}
                <p className='text-sm'>Datum putovanja:</p>
                <p className='text-sm'>{bus.journeyDate}</p>
            </div>
            {/* DUGME ZA REZERVACIJU */}
            <h1 className='text-lg underline' onClick={() => {
                navigate(`/book-now/${bus._id}`);
            }} >Rezervišite</h1>
        </div>
    )
}

export default Bus