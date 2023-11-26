const {Schema, model} = require("mongoose");

const servicePrice = new Schema({
    serviceItemId: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceItem',
        required: [true, "Заполните ServiceItem"]
    },
    title:String,
    price: Number,
    createdAt: Date,
    updateAt:Date,
    status: {
        type: Number,
        default: 1
    }
})

module.exports = model("ServicePrice", servicePrice)