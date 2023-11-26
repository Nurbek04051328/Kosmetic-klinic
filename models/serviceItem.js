const {Schema, model} = require('mongoose')

const serviceItem = new Schema({
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, "Заполните Service"]
    },
    image: {
        type: Array,
    },
    title: {
        type: String,
        required: [true, "Заполните name"]
    },
    subtitle: {
        type: String,
        required: [true, "Заполните name"]
    },
    text: {
        type: String,
        required: [true, "Заполните lname"]
    },
    seans: Number,
    procedure: Number,
    result: Number,
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('ServiceItem',serviceItem)