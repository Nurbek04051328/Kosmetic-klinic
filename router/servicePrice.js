const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { all, create, changeStatus, update, findOne, del } = require('../controllers/servicePrice');


router.get('/:id', auth,  all);

router.post("/", auth, create);

router.get("/change/:id", auth, changeStatus);

router.get("/find/:id", auth, findOne);

router.put('/', auth, update);

router.delete('/:id', auth,  del);




module.exports = router;