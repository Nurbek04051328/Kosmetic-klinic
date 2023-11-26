const bcrypt = require('bcrypt');
const Service = require("../models/service");
const ServiceItem = require("../models/serviceItem");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


// FOR FRONT
const frontall = async (req, res) => {

    let services = await Service.find({status:1})
        .sort({_id:-1}).lean();
    services = await Promise.all(services.map(async item => {
        item.serviceItem = await ServiceItem.find({serviceId: item._id, status:1}).select('_id title').lean();
        console.log()
        return item
    }))
    console.log(services.serviceItem)
    res.status(200).json(services);
}



const all = async (req, res) => {
    let userFunction = decoded(req,res)
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    next = (next-1)*quantity;
    let title = req.query.title || null;
    let services = [];
    let fil = {};
    let othertitle = kirilLotin.kirlot(title)
    if (title) {
        fil = {
            ...fil, $or: [
                {'title': {$regex: new RegExp(title.toLowerCase(), 'i')}},
                {'title': {$regex: new RegExp(othertitle.toLowerCase(), 'i')}},
            ]
        }
    }
    services = await Service.find({...fil, userId:userFunction.id })
        .sort({_id:-1})
        .limit(quantity)
        .skip(next).lean();
    const count = await Service.find({...fil, userId:userFunction.id }).count()
    res.status(200).json({ services, count });
}





const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let service = await Service.findOne({_id}).lean()
            if (!service) {
                res.status(403).send({message: "Service не найдено"})
            }
            if(req.query.status) {
                service.status = parseInt(status)
            } else {
                service.status = service.status == 0 ? 1 : 0
            }
            let upstatus = await Service.findByIdAndUpdate(_id,service)
            let saveService = await Service.findOne({_id:_id}).lean()
            res.status(200).send(saveService)
        } else {
            res.ststus(400).send({message: "Id не найдено"})
        }
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const allActive = async (req, res) => {
    try {
        let userFunction = decoded(req,res)
        let service= await Service.find({ userId:userFunction.id, status:1 }).lean()
        res.status(200).json(service);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const create = async (req, res) => {
    try {
        let { title, text, img } = req.body;
        let userFunction = decoded(req,res)
        const service = await new Service({ userId:userFunction.id, title, text, img, createdTime:Date.now() });
        await service.save();
        let newService = await Service.findOne({_id:service._id}).lean()
        return res.status(201).json(newService);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        if (req.body._id) {
            let _id = req.body._id;
            let findService = await Service.findOne({_id:_id}).lean()
            if (!findService) {
                res.status(403).send({message: "Service не найдено"})
            }
            let { title, text, img } = req.body;
            let service = await Service.findOneAndUpdate({_id:_id},{ title, text, img, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveService = await Service.findOne({_id:service._id}).lean();
            res.status(200).json(saveService);
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
        let service = await Service.findOne({_id}).lean();
        if (!service) {
            res.status(403).send({message: "Service не найдено"})
        }
        res.status(200).json(service);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let findService = await Service.findOne({_id}).lean()
        if (!findService) {
            res.status(403).send({message: "Service не найдено"})
        }
        await Service.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all,  changeStatus, create, update, allActive, findOne, del, frontall }