const mongoose = require('mongoose');

// povezana baza sa .env fajlom
mongoose.connect(process.env.mongo_url);

// proveravam da li je konekcija uspela sa bazom

const db = mongoose.connection;

// proverevam da li je konektovana baza
db.on("connected", () => {
    console.log("Mongo baza je uspešno konektovana.");
});

db.on("error", () => {
    console.log("Mongo baza nije povezana.");
});
