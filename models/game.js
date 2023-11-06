const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// 1. schema
// 2. model
// 3. export
// use -> model

const gameSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: true
    },
    studioName: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['in stock', 'out of stock'],
        default: 'out of stock'
    },
    description: String,
    cost: {
        type: Number,
        required: true
    },
    customers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    questions: [
        {
            title:String,
            answer: String
        }
    ]
});

gameSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('game', gameSchema);