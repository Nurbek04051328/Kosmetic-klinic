const {Schema, model} = require('mongoose')

const specialist = new Schema({
    userId: String,
    avatar: {
        type: Array,
    },
    name: {
        type: String,
        required: [true, "Заполните name"]
    },
    lname: {
        type: String,
        required: [true, "Заполните lname"]
    },
    sname: {
        type: String,
        required: [true, "Заполните sname"]
    },
    profession: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Profession',
            required: [true, "Заполните profession"]
        },
    ],
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('Specialist',specialist)