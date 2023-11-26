const {Router} = require('express');
const router = Router();


router.use('/auth', require("./router/auth"));
router.use('/user', require("./router/user"));
router.use('/img', require("./router/img"));
router.use('/files', require("./router/file"));

router.use('/profession', require("./router/profession"));
router.use('/specialist', require("./router/specialist"));
router.use('/viewspec', require("./router/viewSpec"));
router.use('/service', require("./router/service"));
router.use('/serviceitem', require("./router/serviceItem"));
router.use('/serviceitemproblem', require("./router/serviceItemProblem"));
router.use('/process', require("./router/process"));
router.use('/procedure', require("./router/procedure"));
router.use('/servicequestion', require("./router/serviceQuestion"));
router.use('/serviceprice', require("./router/servicePrice"));
router.use('/addconsul', require("./router/addconsul"));




module.exports = router