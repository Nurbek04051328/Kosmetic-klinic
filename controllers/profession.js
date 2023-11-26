const bcrypt = require('bcrypt');
const Profession = require("../models/profession");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    let userFunction = decoded(req,res)
    let quantity = req.query.quantity || 20;
    let next = req.query.next || 1;
    next = (next-1)*quantity;
    let title = req.query.title || null;
    let professions = [];
    let fil = {};
    let othername = kirilLotin.kirlot(title)
    if (title) {
        fil = {
            ...fil, $or: [
                {'title': {$regex: new RegExp(title.toLowerCase(), 'i')}},
                {'title': {$regex: new RegExp(othername.toLowerCase(), 'i')}},
            ]
        }
    }
    professions = await Profession.find({...fil, userId:userFunction.id })
        .sort({_id:-1})
        .limit(quantity)
        .skip(next).lean();
    const count = await Profession.find({...fil, userId:userFunction.id }).count()
    res.status(200).json({ professions, count });
}




const allActive = async (req, res) => {
    try {
        let userFunction = decoded(req,res)
        let professions = await Profession.find({ status:1 }).lean()
        res.status(200).json(professions);
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
            let profession = await Profession.findOne({_id}).lean()
            if (!profession) {
                res.status(403).send({message: "Profession не найдено"})
            }
            if(req.query.status) {
                profession.status = parseInt(status)
            } else {
                profession.status = profession.status == 0 ? 1 : 0
            }
            let upstatus = await Profession.findByIdAndUpdate(_id,profession)
            let saveProfession = await Profession.findOne({_id:_id}).lean()
            saveProfession.createdTime = saveProfession.createdTime.toLocaleString("en-GB")
            res.status(200).send(saveProfession)
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
        let { title } = req.body;
        let userFunction = decoded(req,res)
        const profession = await new Profession({ userId:userFunction.id, title, createdTime:Date.now() });
        await profession.save();
        let newProfession = await Profession.findOne({_id:profession._id}).lean()
        return res.status(201).json(newProfession);
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
            let findProfession = await Profession.findOne({_id:_id}).lean()
            if (!findProfession) {
                res.status(403).send({message: "Profession не найдено"})
            }
            let { title } = req.body;
            let profession = await Profession.findOneAndUpdate({_id:_id},{ title, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveProfession = await Profession.findOne({_id:profession._id}).lean();
            res.status(200).json(saveProfession);
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
        let profession = await Profession.findOne({_id}).lean();
        if (!profession) {
            res.status(403).send({message: "Profession не найдено"})
        }
        res.status(200).json(profession);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let findProfession = await Profession.findOne({_id}).lean()
        if (!findProfession) {
            res.status(403).send({message: "Profession не найдено"})
        }
       await Profession.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all, allActive, changeStatus, create, update, findOne, del }