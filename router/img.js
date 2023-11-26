const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { create, del } = require('../controllers/img');


router.post("/", auth, create);

router.post("/del", auth, del);





module.exports = router;