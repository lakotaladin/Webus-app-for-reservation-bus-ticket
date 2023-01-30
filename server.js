// Serverski deo
const cors = require("cors");
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

// sa .env sajta iskopirano
require('dotenv').config();
const dbConfig = require("./config/dbConfig");

// kreiran je port
const port = process.env.PORT || 5000;

// Ulazna tačka - kreiranje korisnika - ruta 
const korisniciRute = require('./routes/korisniciRuta');
const busesRoute = require('./routes/busesRoute');
const bookingsRoute = require('./routes/bookingsRoute');
// Api
app.use('/api/users', korisniciRute);
app.use('/api/buses', busesRoute);
app.use('/api/bookings', bookingsRoute);

// Config for Heroku only
// const path = require("path");
// if(process.env.NODE_ENV === "production")
// {
//     app.use(express.static("client/build"));
  
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
//     });
// }
// poruka u konzoli 
app.listen(port, () => console.log(`Povezivanje node servera na port ${port}!`));
