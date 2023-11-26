const {Schema, model} = require("mongoose");

const process = new Schema({
    serviceItemId: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceItem',
        required: [true, "Заполните ServiceItem"]
    },
    title:String,
    text:String,
    createdAt: Date,
    updateAt:Date,
    status: {
        type: Number,
        default: 1
    }
})

module.exports = model("Process", process)