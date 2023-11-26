const {Schema, model} = require("mongoose");

const serviceQuestion = new Schema({
    serviceItemId: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceItem',
        required: [true, "Заполните ServiceItem"]
    },
    question:String,
    answer:String,
    createdAt: Date,
    updateAt:Date,
    status: {
        type: Number,
        default: 1
    }
})

module.exports = model("ServiceQuestion", serviceQuestion)