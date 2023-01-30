import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import "../resources/VremenskaZona.css";

const DisplayTimezone = () => {
  const [vreme, postaviVreme] = useState(moment());

  useEffect(() => {
    setInterval(() => postaviVreme(moment()), 1000);
  }, []);

  return (
    <>
    <br/>
    <br/>
    <hr/>
    <br/>
    <h4>Vremenske zone:</h4><br/>
    <div className="vremenska-zona-kontejner">
      <div className="vremenska-zona">
        <p className="vremenska-zona-naslov">London</p>
        <p className="vremenska-zona-vrednost">
          {moment(vreme).tz("Europe/London").locale("sr-RS").format("LLL, HH:mm:ss")}
        </p>
      </div>
      <div className="vremenska-zona">
        <p className="vremenska-zona-naslov">Njujork</p>
        <p className="vremenska-zona-vrednost">
          {moment(vreme).tz("America/New_York").locale("sr-RS").format("LLL, HH:mm:ss")}
        </p>
      </div>
      <div className="vremenska-zona">
        <p className="vremenska-zona-naslov">Tokio</p>
        <p className="vremenska-zona-vrednost">
          {moment(vreme).tz("Asia/Tokyo").locale("sr-RS").format("LLL, HH:mm:ss")}
        </p>
      </div>
    </div>
    </>
  );
};

export default DisplayTimezone;
