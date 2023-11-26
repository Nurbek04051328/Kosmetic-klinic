const bcrypt = require('bcrypt');
const Service = require("../models/service");
const ServiceItem = require("../models/serviceItem");
const ServiceItemProblem = require("../models/serviceItemProblem");
const Procedure = require("../models/procedure");
const ServiceQuestion = require("../models/serviceQuestion");
const Process = require("../models/process");
const ServicePrice = require("../models/servicePrice");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


// FOR FRONT
const viewServiceItem = async (req, res) => {
    const _id = req.params.id
    let serviceItem = await ServiceItem.findOne({_id: _id}).lean()
    if (!serviceItem) {
        res.status(403).send({message: "serviceItem не найдено"})
    }
    let serviceItemProblem = await ServiceItemProblem.find({serviceItemId:_id}).lean();
    serviceItemProblem = await Promise.all(serviceItemProblem.map(async item => {
        let obj  = {
            btnText: item.btnText,
            datas: {
                title: item.title,
                text: item.text
            }
        }

        return obj
    }))

    let serviceProcess = await Process.find({serviceItemId: _id}).lean();
    let procedure = await Procedure.find({serviceItemId: _id}).lean();
    let serviceQuestion = await ServiceQuestion.find({serviceItemId: _id}).lean();
    let servicePrice = await ServicePrice.find({serviceItemId: _id}).lean()
    res.status(200).json({serviceItem, serviceItemProblem, serviceProcess, procedure, serviceQuestion, servicePrice});
}






const all = async (req, res) => {
    const _id = req.params.id
    let serviceItem = await ServiceItem.find({serviceId: _id}).populate('serviceId').lean()
    if (!serviceItem) {
        res.status(403).send({message: "serviceItem не найдено"})
    }

    res.status(200).json(serviceItem);
}



const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let serviceItem = await ServiceItem.findOne({_id}).lean()
            if (!serviceItem) {
                res.status(403).send({message: "ServiceItem не найдено"})
            }
            if(req.query.status) {
                serviceItem.status = parseInt(status)
            } else {
                serviceItem.status = serviceItem.status == 0 ? 1 : 0
            }
            let upstatus = await ServiceItem.findByIdAndUpdate(_id,serviceItem)
            let saveServiceItem = await ServiceItem.findOne({_id:_id}).lean()
            res.status(200).send(saveServiceItem)
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
        let { serviceId, image, title, subtitle, text, seans, procedure, result } = req.body;
        console.log(req.body)
        let userFunction = decoded(req,res)
        const serviceItem = await new ServiceItem({ userId:userFunction.id,  serviceId, image, title, subtitle, text, seans, procedure, result, createdTime:Date.now() });
        await serviceItem.save();
        let newServiceItem = await ServiceItem.findOne({_id:serviceItem._id}).lean()
        return res.status(201).json(newServiceItem);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        if (req.body._id) {
            let _id = req.body._id;
            let findServiceItem = await ServiceItem.findOne({_id:_id}).lean()
            if (!findServiceItem) {
                res.status(403).send({message: "ServiceItem не найдено"})
            }
            let {serviceId, image, title, subtitle, text, seans, procedure, result } = req.body;
            let serviceItem = await ServiceItem.findOneAndUpdate({_id:_id},{ serviceId, image, title, subtitle, text, seans, procedure, result, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveServiceItem = await ServiceItem.findOne({_id:serviceItem._id}).lean();
            res.status(200).json(saveServiceItem);
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
        console.log(req.params)
        let serviceItem = await ServiceItem.findOne({_id}).lean();
        if (!serviceItem) {
            res.status(403).send({message: "serviceItem не найдено"})
        }
        res.status(200).json(serviceItem);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let findService = await ServiceItem.findOne({_id}).lean()
        if (!findService) {
            res.status(403).send({message: "ServiceItem не найдено"})
        }
        await ServiceItem.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all,  changeStatus, create, update, findOne, del, viewServiceItem }