const bcrypt = require('bcrypt');
const Addconsul = require("../models/addconsul");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    let userFunction = decoded(req,res)
    let limit = req.query.limit || 20;
    let page = req.query.page || 1;
    let skip = (page-1) * limit;

    let addConsuls = await Addconsul.find()
        .sort({_id:-1})
        .limit(limit)
        .skip(skip).lean();
    const count = await Addconsul.find().count()
    res.status(200).json({ addConsuls, count });
}



const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            console.log("par",req.params)
            console.log("query",req.query)
            const _id = req.params.id
            let status = req.query.status;
            let addconsul = await Addconsul.findOne({_id}).lean()
            if (!addconsul) {
                res.status(403).send({message: "Addconsul не найдено"})
            }
            if(req.query.status) {
                addconsul.status = parseInt(status)
            } else {
                addconsul.status = addconsul.status == 0 ? 1 : 0
            }
            let upstatus = await Addconsul.findByIdAndUpdate(_id,addconsul)
            let saveAddconsul = await Addconsul.findOne({_id:_id}).lean()
            res.status(200).send(saveAddconsul)
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
        let { phone } = req.body;
        const addconsul = await new Addconsul({ phone, createdTime:Date.now() });
        await addconsul.save();
        let newAddconsul = await Addconsul.findOne({_id:addconsul._id}).lean()
        return res.status(201).json(newAddconsul);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        if (req.body._id) {
            let _id = req.body._id;
            let findAddconsul = await Addconsul.findOne({_id:_id}).lean()
            if (!findAddconsul) {
                res.status(403).send({message: "Addconsul не найдено"})
            }
            let { phone } = req.body;
            let addconsul = await Addconsul.findOneAndUpdate({_id:_id},{ phone, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveADdconsul = await Addconsul.findOne({_id:addconsul._id}).lean();
            res.status(200).json(saveADdconsul);
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
        let profession = await Addconsul.findOne({_id}).lean();
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
        let findProfession = await Addconsul.findOne({_id}).lean()
        if (!findProfession) {
            res.status(403).send({message: "Addconsul не найдено"})
        }
        await Addconsul.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all, changeStatus, create, update, findOne, del }