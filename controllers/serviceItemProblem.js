const bcrypt = require('bcrypt');
const ServiceItem = require("../models/serviceItem");
const ServiceItemProblem = require("../models/serviceItemProblem");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    const _id = req.params.id
    let serviceItemProblem = await ServiceItemProblem.find({serviceItemId: _id}).populate('serviceItemId').lean()
    if (!serviceItemProblem) {
        res.status(403).send({message: "serviceItemProblem не найдено"})
    }

    res.status(200).json(serviceItemProblem);
}



const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let serviceItemProblem = await ServiceItemProblem.findOne({_id}).lean()
            if (!serviceItemProblem) {
                res.status(403).send({message: "ServiceItemProblem не найдено"})
            }
            if(req.query.status) {
                serviceItemProblem.status = parseInt(status)
            } else {
                serviceItemProblem.status = serviceItemProblem.status == 0 ? 1 : 0
            }
            let upstatus = await ServiceItemProblem.findByIdAndUpdate(_id,serviceItemProblem)
            let saveServiceItemProblem = await ServiceItemProblem.findOne({_id:_id}).lean()
            res.status(200).send(saveServiceItemProblem)
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
        let { serviceItemId, image, title, btnText, text } = req.body;
        console.log(req.body)
        let userFunction = decoded(req,res)
        const serviceItemProblem = await new ServiceItemProblem({ userId:userFunction.id,   serviceItemId, image, title, btnText, text, createdTime:Date.now() });
        await serviceItemProblem.save();
        let newServiceItemProblem = await ServiceItemProblem.findOne({_id:serviceItemProblem._id}).lean()
        return res.status(201).json(newServiceItemProblem);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        if (req.body._id) {
            let _id = req.body._id;
            let findServiceItemProblem = await ServiceItemProblem.findOne({_id:_id}).lean()
            if (!findServiceItemProblem) {
                res.status(403).send({message: "ServiceItem не найдено"})
            }
            let { serviceItemId, image, title, btnText, text } = req.body;
            let serviceItemProblem = await ServiceItemProblem.findOneAndUpdate({_id:_id},{ serviceItemId, image, title, btnText, text, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveServiceItemProblem = await ServiceItemProblem.findOne({_id:serviceItemProblem._id}).lean();
            res.status(200).json(saveServiceItemProblem);
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
        let serviceItemProblemn = await ServiceItemProblem.findOne({_id}).lean();
        if (!serviceItemProblemn) {
            res.status(403).send({message: "ServiceItemProblem не найдено"})
        }
        res.status(200).json(serviceItemProblemn);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let findService = await ServiceItemProblem.findOne({_id}).lean()
        if (!findService) {
            res.status(403).send({message: "ServiceItemProblem не найдено"})
        }
        await ServiceItemProblem.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all,  changeStatus, create, update, findOne, del }