const {Schema, model} = require('mongoose')

const serviceItemProblem = new Schema({
    serviceItemId: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceItem',
        required: [true, "Заполните ServiceItem"]
    },
    image: {
        type: Array,
    },
    btnText: {
        type: String,
        required: [true, "Заполните btnText"]
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


module.exports = model('ServiceItemProblem', serviceItemProblem)