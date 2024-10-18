const mongoose = require('mongoose');
const User = require('./User');

const electronicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 10,
    },
    type: {
        type: String,
        required: true,
        minLength: 2,
    },
    damages: {
        type: String,
        required: true,
        minLength: 10,
    },
    imageUrl: {
        type: String,
        required: true,
        validate: /^https?:\/\//,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 200,
    },
    production: {
        type: Number,
        required: true,
        min: 1900,
        max: 2023,
    },
    exploitation: {
        type: Number,
        required: true,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    buyingList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

const Electronic = mongoose.model('Electronic', electronicSchema);

module.exports = Electronic;