const bcrypt = require('bcrypt');
const ServiceQuestion = require("../models/serviceQuestion");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    const _id = req.params.id
    let serviceQuestion = await ServiceQuestion.find({serviceItemId: _id}).populate('serviceItemId').lean()
    if (!serviceQuestion.length>0) {
        res.status(403).send({message: "ServiceQuestion не найдено"})
    }

    res.status(200).json(serviceQuestion);
}





const allActive = async (req, res) => {
    try {
        let userFunction = decoded(req,res)
        let serviceQuestion = await ServiceQuestion.find({ status:1 }).populate('serviceItemId').lean()
        res.status(200).json(serviceQuestion);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}

const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let serviceQuestion = await ServiceQuestion.findOne({_id}).lean()
            if (!serviceQuestion) {
                res.status(403).send({message: "ServiceQuestion не найдено"})
            }
            if(req.query.status) {
                serviceQuestion.status = parseInt(status)
            } else {
                serviceQuestion.status = serviceQuestion.status == 0 ? 1 : 0
            }
            let upstatus = await ServiceQuestion.findByIdAndUpdate(_id,serviceQuestion)
            let saveServiceQuestion = await ServiceQuestion.findOne({_id:_id}).populate('serviceItemId').lean()
            res.status(200).send(saveServiceQuestion)
        } else {
            res.ststus(400).send({message: "Id не найдено"})
        }
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}

const create = async (req, res) => {
    try {
        let { serviceItemId, question, answer } = req.body;
        let userFunction = decoded(req,res)
        const serviceQuestion = await new ServiceQuestion({ userId:userFunction.id, serviceItemId, serviceItemId, question, answer, createdTime:Date.now() });
        await serviceQuestion.save();
        let newServiceQuestion = await ServiceQuestion.findOne({_id:serviceQuestion._id}).populate('serviceItemId').lean()
        return res.status(201).json(newServiceQuestion);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        if (req.body._id) {
            let _id = req.body._id;
            let findServiceQuestion = await ServiceQuestion.findOne({_id:_id}).lean()
            if (!findServiceQuestion) {
                res.status(403).send({message: "ServiceQuestion не найдено"})
            }
            let { serviceItemId, question, answer } = req.body;
            let serviceQuestion = await ServiceQuestion.findOneAndUpdate({_id:_id},{ serviceItemId, question, answer, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveServiceQuestion = await ServiceQuestion.findOne({_id:serviceQuestion._id}).populate('serviceItemId').lean();
            res.status(200).json(saveServiceQuestion);
        } else {
            res.status(500).json({message: "Не найдено id"});
        }
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const findOne = async (req, res) => {
    try {
        const _id = req.params.id;
        let serviceQuestion = await ServiceQuestion.findOne({_id}).populate('serviceItemId').lean();
        if (!serviceQuestion) {
            res.status(403).send({message: "ServiceQuestion не найдено"})
        }
        res.status(200).json(serviceQuestion);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let serviceQuestion = await ServiceQuestion.findOne({_id}).lean()
        if (!serviceQuestion) {
            res.status(403).send({message: "ServiceQuestion не найдено"})
        }
        await ServiceQuestion.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all, allActive, changeStatus, create, update, findOne, del }