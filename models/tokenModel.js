const mongoose = require('mongoose'); // !mdbgum

// Declare the Schema of the Mongo model
const tokenSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
},
    {
        // MongoDB format za datum i vreme
        timestamps: true,
    }

);
const tokenModel = mongoose.model("tokens", tokenSchema);
//Export the model
module.exports = tokenModel;