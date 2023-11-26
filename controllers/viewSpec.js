const bcrypt = require('bcrypt');
const ViewSpec = require("../models/viewSpec");
const Specialist = require("../models/specialist");
const Profession = require("../models/profession");
const decoded = require("../service/decoded");
const kirilLotin = require("../service/kirilLotin");


const all = async (req, res) => {
    const _id = req.params.id
    let viewSpec = await ViewSpec.findOne({_id}).populate(['specId', 'specId.profession']).lean()
    console.log("specId",viewSpec)
    if (!viewSpec) {
        res.status(403).send({message: "Specialist не найдено"})
    }

    res.status(200).json(viewSpec);
}


const allfront = async (req, res) => {
    const _id = req.params.id
    console.log(req.params)
    let viewSpec = await ViewSpec.findOne({specId:_id}).populate([
        {path:"specId", model:Specialist, populate:{path:"profession", model:Profession} }
    ]).lean()
    console.log("specId",viewSpec)
    if (!viewSpec) {
        res.status(403).send({message: "Specialist не найдено"})
    }

    res.status(200).json(viewSpec);
}


const changeStatus = async (req, res) => {
    try {
        if (req.params.id) {
            const _id = req.params.id
            let status = req.query.status;
            let viewSpec = await ViewSpec.findOne({_id}).lean()
            if (!viewSpec) {
                res.status(403).send({message: "Specialist не найдено"})
            }
            if(req.query.status) {
                viewSpec.status = parseInt(status)
            } else {
                viewSpec.status = viewSpec.status == 0 ? 1 : 0
            }
            let upstatus = await ViewSpec.findByIdAndUpdate(_id,viewSpec)
            let saveViewSpec = await ViewSpec.findOne({_id:_id}).populate('specId').lean()
            res.status(200).send(saveViewSpec)
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
        let viewSpec = await ViewSpec.find({ userId:userFunction.id, status:1 }).lean()
        res.status(200).json(viewSpec);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const create = async (req, res) => {
    try {
        let { specId, title, subtitle, subtexts, img, educations, work, certificate } = req.body;
        let userFunction = decoded(req,res)
        const viewSpec = await new ViewSpec({ userId:userFunction.id, specId, title, subtitle, subtexts, img, educations, work, certificate, createdTime:Date.now() });
        await viewSpec.save();
        let newViewSpec = await ViewSpec.findOne({_id:viewSpec._id}).populate('specId').lean()
        return res.status(201).json(newViewSpec);
    } catch (e) {
        console.log(e)
        res.send({message: "Ошибка сервера"})
    }
}


const update = async (req, res) => {
    try {
        if (req.body._id) {
            let _id = req.body._id;
            let findViewSpec = await ViewSpec.findOne({_id:_id}).lean()
            if (!findViewSpec) {
                res.status(403).send({message: "ViewSpec не найдено"})
            }
            let { specId, title, subtitle, subtexts, img, educations,  work, certificate } = req.body;
            let viewSpec = await ViewSpec.findOneAndUpdate({_id:_id},{ specId, title, subtitle, subtexts, img, educations, work, certificate, updateTime:Date.now()}, {returnDocument: 'after'});
            let saveViewSpec = await ViewSpec.findOne({_id:viewSpec._id}).populate('specId').lean();
            res.status(200).json(saveViewSpec);
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
        let viewSpec = await ViewSpec.findOne({specId:_id}).populate('specId').populate({
            path: 'specId',
            populate: {
                path: 'profession',
                model: 'Profession'
            }
        }).lean();
        console.log("aa",viewSpec)
        if (!viewSpec) {
            res.status(403).send({message: "ViewSpec не найдено"})
        }
        res.status(200).json(viewSpec);
    } catch (e) {
        console.log(e);
        res.send({message: "Ошибка сервера"});
    }
}

const del = async(req,res)=>{
    if (req.params.id) {
        let _id = req.params.id;
        let findViewSpec = await ViewSpec.findOne({_id}).lean()
        if (!findViewSpec) {
            res.status(403).send({message: "ViewSpec не найдено"})
        }
        await ViewSpec.findByIdAndDelete(_id);
        res.status(200).json(_id);
    } else {
        console.log(e);
        res.status(500).send({message: "Не найдено"});
    }
}


module.exports = { all,  changeStatus, create, update, allActive, findOne, del, allfront }