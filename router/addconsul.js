const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { all, create, changeStatus, update, findOne, del } = require('../controllers/addconsul');


router.get('/', auth,  all);

router.post("/", create);

router.get("/change/:id", auth, changeStatus);

router.get("/:id", auth, findOne);

router.put('/', auth, update);

router.delete('/:id', auth,  del);



module.exports = router;
