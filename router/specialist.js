const Router = require("express");
const router = new Router();
const auth = require('../middleware/auth');
const { front, all, create, allActive, changeStatus, update, findOne, del } = require('../controllers/specialist');

router.get('/all',  front);

router.get('/', auth,  all);


router.get('/active', auth,  allActive);

router.post("/", auth, create);

router.get("/change/:id", auth, changeStatus);

router.get("/:id", auth, findOne);

router.put('/', auth, update);

router.delete('/:id', auth,  del);




module.exports = router;