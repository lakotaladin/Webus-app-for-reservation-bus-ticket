const mongoose = require('mongoose'); // !mdbgum

// Declare the Schema of the Mongo model
const busSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    capacity: {
        type: Number,
        require: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    journeyDate: {
        type: String,
        required: true,
    },
    departure: {
        type: String,
        required: true,
    },
    arrival: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // Dodate stvari za bekend
    seatsBooked: {
        type: Array,
        default: [],
    },
    status: {
        type: String,
        default: "Treba da krene",
    }


});

//Export the model
module.exports = mongoose.model('buses', busSchema);