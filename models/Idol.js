const mongoose  = require('mongoose');

const IdolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Idol', IdolSchema);