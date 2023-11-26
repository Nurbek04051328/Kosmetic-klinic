const bcrypt = require('bcrypt');
const ServicePrice = require("../models/servicePrice");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    const _id = req.params.id
    let servicePrice = await ServicePrice.find({serviceItemId: _id}).populate('serviceItemId').lean()
    if (!servicePrice) {
        res.status(403).send({message: "ServicePrice не найдено"})
    }

    res.status(200).json(servicePrice);
}





const allActive = async (req, res) => {
    try {
        let userFunction = decoded(req,res)
        let servicePrice = await ServicePrice.find({ status:1 }).populate('serviceItemId').lean()
        res.status(200).json(servicePrice);
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
            let servicePrice = await ServicePrice.findOne({_id}).lean()
            if (!servicePrice) {
                res.status(403).send({message: "ServicePrice не найдено"})
            }
            if(req.query.status) {
                servicePrice.status = parseInt(status)
            } else {
                servicePrice.status = servicePrice.status == 0 ? 1 : 0
            }
            let upstatus = await ServicePrice.findByIdAndUpdate(_id,servicePrice)
            let saveServicePrice = await ServicePrice.findOne({_id:_id}).populate('serviceItemId').lean()
            res.status(200).send(saveServicePrice)
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
        let { serviceItemId, title, price } = req.body;
        let userFunction = decoded(req,res)
        const servicePrice = await new ServicePrice({ userId:userFunction.id, serviceItemId, title, price, createdTime:Date.now() });
        await servicePrice.save();
        let newServicePrice = await ServicePrice.findOne({_id:servicePrice._id}).populate('serviceItemId').lean()
        return res.status(201).json(newServicePrice);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        if (req.body._id) {
            let _id = req.body._id;
            let findServicePrice = await ServicePrice.findOne({_id:_id}).lean()
            if (!findServicePrice) {
                res.status(403).send({message: "ServicePrice не найдено"})
            }
            let { serviceItemId, title, price } = req.body;
            let servicePrice = await ServicePrice.findOneAndUpdate({_id:_id},{ serviceItemId, title, price, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveServicePrice = await ServicePrice.findOne({_id:servicePrice._id}).populate('serviceItemId').lean();
            res.status(200).json(saveServicePrice);
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
        let servicePrice = await ServicePrice.findOne({_id}).populate('serviceItemId').lean();
        if (!servicePrice) {
            res.status(403).send({message: "ServicePrice не найдено"})
        }
        res.status(200).json(servicePrice);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let servicePrice = await ServicePrice.findOne({_id}).lean()
        if (!servicePrice) {
            res.status(403).send({message: "ServicePrice не найдено"})
        }
        await ServicePrice.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all, allActive, changeStatus, create, update, findOne, del }