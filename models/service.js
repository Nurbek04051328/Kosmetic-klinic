const {Schema, model} = require('mongoose')

const service = new Schema({
    userId: String,
    img: {
        type: Array,
    },
    title: {
        type: String,
        required: [true, "Заполните name"]
    },
    text: {
        type: String,
        required: [true, "Заполните lname"]
    },
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('Service',service)