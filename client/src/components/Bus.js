import React from "react";
import { useNavigate } from "react-router-dom";
import tiket from '../resources/tiket.png';

function Bus({ bus }) {
  const navigate = useNavigate();
  return (
    <div className="karticabus d-flex card p-2 m-2">
      <h1 className="text-lg primary-text">{bus.name}</h1>
      <hr />
      <div className="d-flex justify-content-between">
        <div>
          <p className="text-sm">Od:</p>
          <p className="text-sm">{bus.from}</p>
        </div>

        <div>
          <p className="text-sm">Do:</p>
          <p className="text-sm">{bus.to}</p>
        </div>

        <div>
          <p className="text-sm">Cena:</p>
          <p className="text-md"> &euro; {bus.price} /-</p>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <p className="text-sm">Datum polaska:</p>
          <p className="text-sm">{bus.journeyDate}</p>
        </div>
        <div>
          <img  id="kodbar" src={tiket} alt="Bar kod"/>
        </div>
        <h1 className="text-lg underline secondary-text" onClick={()=>{
            navigate(`/book-now/${bus._id}`)
        }}>Rezerviši sada</h1>
      </div>
      
    </div>
  );
}

export default Bus;
