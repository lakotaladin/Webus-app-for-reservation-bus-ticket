import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import JsBarcode from 'jsbarcode'
import moment from 'moment';

function Bus({ bus }) {
  const navigate = useNavigate();

  useEffect(() => {
    JsBarcode('#bus-' + bus._id, bus._id)
  }, [bus])

  return (
    <div key={bus._id} className="karticabus d-flex card p-2 m-2">
      <h1 className="text-lg primary-text">{bus.name}</h1>
      <hr />
      <div className="d-flex justify-content-between">
        <div>
          <p className="text-sm">Od grada:</p>
          <p className="text-sm">{bus.from}</p>
        </div>

        <div>
          <p className="text-sm">Do grada:</p>
          <p className="text-sm">{bus.to}</p>
        </div>
        <div>
          <p className="text-sm">Cena:</p>
          <p className="text-md"> &euro; {bus.price} /-</p>
        </div>
      </div>
      <hr />
      <div className="divodrezervisi d-flex justify-content-between align-items-end">
        <div>
          <p className="text-sm">Datum polaska:</p>
          <p className="text-sm">{bus.journeyDate}</p>
        </div>
        <div>
          <img
            title="Šifra rute"
            className="barkod"
            data-testid="bus-barcode"
            id={"bus-" + bus._id}
            alt="Bar kod"
          />
        </div>
        <h1
          title="Rezerviši sada"
          className="rezervisisada secondary-text"
          onClick={() => {
            navigate(`/book-now/${bus._id}`);
          }}
        >
          Rezerviši sada
        </h1>
      </div>
    </div>
  );
}

export default Bus;
