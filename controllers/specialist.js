const bcrypt = require('bcrypt');
const Profession = require("../models/profession");
const Specialist = require("../models/specialist");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    let userFunction = decoded(req,res)
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    next = (next-1)*quantity;
    let name = req.query.name || null;
    let specialists = [];
    let fil = {};
    let othername = kirilLotin.kirlot(name)
    if (name) {
        fil = {
            ...fil, $or: [
                {'name': {$regex: new RegExp(name.toLowerCase(), 'i')}},
                {'name': {$regex: new RegExp(othername.toLowerCase(), 'i')}},
            ]
        }
    }
    specialists = await Specialist.find({...fil, userId:userFunction.id })
        .populate('profession')
        .sort({_id:-1})
        .limit(quantity)
        .skip(next).lean();
    const count = await Specialist.find({...fil, userId:userFunction.id }).count()
    res.status(200).json({ specialists, count });
}




const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let specialist = await Specialist.findOne({_id}).lean()
            if (!specialist) {
                res.status(403).send({message: "Specialist не найдено"})
            }
            if(req.query.status) {
                specialist.status = parseInt(status)
            } else {
                specialist.status = specialist.status == 0 ? 1 : 0
            }
            let upstatus = await Specialist.findByIdAndUpdate(_id,specialist)
            let saveProfession = await Specialist.findOne({_id:_id}).populate('profession').lean()
            res.status(200).send(saveProfession)
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
        let specialists= await Specialist.find({ userId:userFunction.id, status:1 }).populate('profession').lean()
        res.status(200).json(specialists);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const create = async (req, res) => {
    try {
        let { name, lname, sname, profession, avatar } = req.body;


        let userFunction = decoded(req,res)
        const specialist = await new Specialist({ userId:userFunction.id, name, lname, sname, profession, avatar, createdTime:Date.now() });
        await specialist.save();
        let newSpecialist = await Specialist.findOne({_id:specialist._id}).populate('profession').lean()
        return res.status(201).json(newSpecialist);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        console.log("bodyUpdat", req.body)
        if (req.body._id) {
            let _id = req.body._id;
            let findSpecialist = await Specialist.findOne({_id:_id}).lean()
            if (!findSpecialist) {
                res.status(403).send({message: "Specialist не найдено"})
            }
            let { name, lname, sname, profession, avatar } = req.body;
            let specialist = await Specialist.findOneAndUpdate({_id:_id},{ name, lname, sname, profession, avatar, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveSpecialist = await Specialist.findOne({_id:specialist._id}).populate('profession').lean();
            res.status(200).json(saveSpecialist);
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
        let specialist = await Specialist.findOne({_id}).populate('profession').lean();
        if (!specialist) {
            res.status(403).send({message: "Specialist не найдено"})
        }
        res.status(200).json(specialist);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let findSpecialist = await Specialist.findOne({_id}).lean()
        if (!findSpecialist) {
            res.status(403).send({message: "Specialist не найдено"})
        }
        await Specialist.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}



// FOR FRONT
const front = async (req, res) => {

    let specialists = await Specialist.find({status:1})
        .populate('profession')
        .sort({_id:-1}).lean();
    res.status(200).json( specialists);
}



module.exports = { front, all,  changeStatus, create, update, allActive, findOne, del }