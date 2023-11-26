const bcrypt = require('bcrypt');
const Procedure = require("../models/procedure");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    const _id = req.params.id
    let procedure = await Procedure.find({serviceItemId: _id}).populate('serviceItemId').lean()
    if (!procedure) {
        res.status(403).send({message: "Procedure не найдено"})
    }

    res.status(200).json(procedure);
}





const allActive = async (req, res) => {
    try {
        let userFunction = decoded(req,res)
        let procedure = await Procedure.find({ status:1 }).populate('serviceItemId').lean()
        res.status(200).json(procedure);
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
            let procedure = await Procedure.findOne({_id}).lean()
            if (!procedure) {
                res.status(403).send({message: "Procedure не найдено"})
            }
            if(req.query.status) {
                procedure.status = parseInt(status)
            } else {
                procedure.status = procedure.status == 0 ? 1 : 0
            }
            let upstatus = await Procedure.findByIdAndUpdate(_id,procedure)
            let saveProcedure = await Procedure.findOne({_id:_id}).populate('serviceItemId').lean()
            res.status(200).send(saveProcedure)
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

        let { serviceItemId, indication, contraindication } = req.body;
        let findprocedure = await Procedure.findOne({serviceItemId:serviceItemId}).lean()
        if (findprocedure) {
            res.status(403).send({message: "Bunday Procedure oldin kiritilgan."})
        } else {
            let userFunction = decoded(req,res)
            const procedure = await new Procedure({ userId:userFunction.id, serviceItemId, indication, contraindication, createdTime:Date.now() });
            await procedure.save();
            let newProcedure = await Procedure.findOne({_id:procedure._id}).populate('serviceItemId').lean()
            return res.status(201).json(newProcedure);
        }

    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        if (req.body._id) {
            let _id = req.body._id;
            let findProcedure = await Procedure.findOne({_id:_id}).lean()
            if (!findProcedure) {
                res.status(403).send({message: "Procedure не найдено"})
            }
            let { serviceItemId, indication, contraindication } = req.body;
            let procedure = await Procedure.findOneAndUpdate({_id:_id},{ serviceItemId, indication, contraindication, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveProcedure = await Procedure.findOne({_id:procedure._id}).populate('serviceItemId').lean();
            res.status(200).json(saveProcedure);
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
        let procedure = await Procedure.findOne({_id}).populate('serviceItemId').lean();
        if (!procedure) {
            res.status(403).send({message: "Process не найдено"})
        }
        res.status(200).json(procedure);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let findProcedure = await Procedure.findOne({_id}).lean()
        if (!findProcedure) {
            res.status(403).send({message: "Procedure не найдено"})
        }
        await Procedure.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all, allActive, changeStatus, create, update, findOne, del }