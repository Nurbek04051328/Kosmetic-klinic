const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");



const addadmin = async (req, res) => {
    let check = await User.findOne({login:'admin'});
    if (check){
        res.json({message: "Ошибка, Такой админ уже есть"});
    } else {
        const hashPass = await bcrypt.hash('12345', 10)
        let admin =  await new User({login:'admin', password: hashPass,role:'admin',name:'SuperAdmin', createdAt:Date.now()})
        await admin.save()
        res.json({message: "Админ создан"})
    }
}


const checkLogin = async(req,res) => {
    let {login} = req.body
    if(login) {
        login = login.toLowerCase()
    }
    const user = await User.findOne({login})
    if (user) {
        return res.status(400).json({message: "Пользователь с таким логином есть!"})
    } else {
        return res.status(200).json({message: "ок"})
    }
}


const login = async (req, res) => {
    console.log(req.body)
    let {login, password} = req.body
    const user = await User.findOne({login})
    if (!user) {
        return res.status(400).send('Пользователь не найден')
    }
    const isPassValid = bcrypt.compareSync(password, user.password)
    if (!isPassValid) {
        return res.status(400).send('В пароле ошибка')
    }
    if (user.status !== 1) {
        return res.status(404).json( "У вас нет доступа к этому сайту")
    }
    const token = jwt.sign({id: user.id}, process.env.SecretKey, {expiresIn: "1d"})
    user.loginAt.push(Date.now())
    await User.findByIdAndUpdate(user._id,user);
    let data = {
        id: user.id,
        login: user.login,
        role: user.role,
        name: user.name
    }
    return res.status(200).send({
        token,
        user: data
    })
}

const checkUser = async (req,res) => {
    const user = await User.findOne({_id: req.user.id})
    if (!user){
        return res.status(404).json({message: "Пользователь не найдено!"})
    }
    let data = {
        id: user.id,
        login: user.login,
        role: user.role,
        name: user.name
    }
    res.status(200).json(data)
}

const getUser = async (req, res) => {
    const user = await User.findOne({_id: req.user.id})
    const token = jwt.sign({id: user.id}, process.env.secretKey, {expiresIn: "1d"})
    return res.json({
        token,
        user: {
            id: user.id,
            login: user.login,
        }
    })
}

module.exports = { addadmin, checkLogin, login, checkUser, getUser }