const {Schema, model} = require('mongoose')

const addconsul = new Schema({
    phone: String,
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 0
    }
})


module.exports = model('Addconsul', addconsul)