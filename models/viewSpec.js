const {Schema, model} = require('mongoose')

const viewSpec = new Schema({
    userId: String,
    img: {
        type: Array,
    },
    specId: {
        type: Schema.Types.ObjectId,
        ref: 'Specialist',
        required: [true, "Заполните Specialist"]
    },
    title: {
        type: String,
        required: [true, "Заполните title"]
    },
    subtitle: {
        type: String,
        required: [true, "Заполните subtitle"]
    },
    subtexts: {
        type: String,
        required: [true, "Заполните title"]
    },
    educations: [
        {
            title:String,
            direction:String,
            year:Number,
        },
    ],
    work: [
        {
            title:String,
            position:String,
            startDate:Date,
            endDate:Date
        }
    ],
    certificate: Array,
    createdTime: Date,
    updateTime: Date,
    status: {
        type: Number,
        default: 1
    }
})


module.exports = model('ViewSpec', viewSpec)