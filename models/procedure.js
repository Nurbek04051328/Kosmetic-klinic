const {Schema, model} = require("mongoose");

const procedure = new Schema({
    serviceItemId: {
        type: Schema.Types.ObjectId,
        ref: 'ServiceItem',
        required: [true, "Заполните ServiceItem"]
    },
    indication: [
        {
            title: String
        }
    ],
    contraindication: [
        {
            title: String
        }
    ],
    createdAt: Date,
    updateAt:Date,
    status: {
        type: Number,
        default: 1
    }
})

module.exports = model("Procedure", procedure)