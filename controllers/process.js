const bcrypt = require('bcrypt');
const Process = require("../models/process");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    const _id = req.params.id
    let process = await Process.find({serviceItemId: _id}).populate('serviceItemId').lean()
    if (!process) {
        res.status(403).send({message: "Process не найдено"})
    }

    res.status(200).json(process);
}





const allActive = async (req, res) => {
    try {
        let userFunction = decoded(req,res)
        let processs = await Process.find({ status:1 }).populate('serviceItemId').lean()
        res.status(200).json(processs);
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
            let processs = await Process.findOne({_id}).lean()
            if (!processs) {
                res.status(403).send({message: "Process не найдено"})
            }
            if(req.query.status) {
                processs.status = parseInt(status)
            } else {
                processs.status = processs.status == 0 ? 1 : 0
            }
            let upstatus = await Process.findByIdAndUpdate(_id,processs)
            let saveProcess = await Process.findOne({_id:_id}).populate('serviceItemId').lean()
            res.status(200).send(saveProcess)
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
        let { serviceItemId, title, text } = req.body;
        let userFunction = decoded(req,res)
        const processs = await new Process({ userId:userFunction.id, serviceItemId, title, text, createdTime:Date.now() });
        await processs.save();
        let newProcess = await Process.findOne({_id:processs._id}).populate('serviceItemId').lean()
        return res.status(201).json(newProcess);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        if (req.body._id) {
            let _id = req.body._id;
            let findProcess = await Process.findOne({_id:_id}).lean()
            if (!findProcess) {
                res.status(403).send({message: "Process не найдено"})
            }
            let { serviceItemId, title, text } = req.body;
            let processs = await Process.findOneAndUpdate({_id:_id},{ serviceItemId, title, text, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveProcess = await Process.findOne({_id:processs._id}).populate('serviceItemId').lean();
            res.status(200).json(saveProcess);
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
        let process = await Process.findOne({_id}).populate('serviceItemId').lean();
        if (!process) {
            res.status(403).send({message: "Process не найдено"})
        }
        res.status(200).json(process);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let findProcess = await Process.findOne({_id}).lean()
        if (!findProcess) {
            res.status(403).send({message: "Process не найдено"})
        }
        await Process.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all, allActive, changeStatus, create, update, findOne, del }