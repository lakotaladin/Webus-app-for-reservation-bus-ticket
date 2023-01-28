const mongoose = require('mongoose'); // !mdbgum

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    ime: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        min: [3, "Ime mora da sadrži najmanje 3 slova."],
        max: [64, "Ime mora da sadži najviše 64 slova."],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    lozinka: {
        type: String,
        required: true,
         min: [8, "Lozinka mora da sadrži najmanje 8 karaktera."],
        max: [64, "Lozinka mora da sadži najviše 64 karaktera."],
    },
    isAdministrator: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerifyed: {
        type: Boolean,
        default: false,
      },
},
    {
        // MongoDB format za datum i vreme
        timestamps: true,
    }

);

//Export the model
module.exports = mongoose.model('users', userSchema);