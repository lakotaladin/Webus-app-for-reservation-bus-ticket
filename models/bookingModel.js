const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
    bus: {
        type: mongoose.Schema.ObjectId,
        ref: 'buses',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        require: true,
    },
    seats: {
        type: Array,
        require: true,
    },
    transactionID : {
        type: String,
        require: true,
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model('bookings', bookingSchema);