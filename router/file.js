const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { create, del } = require('../controllers/file');


router.post("/", auth, create);

router.post("/del", auth, del);





module.exports = router;