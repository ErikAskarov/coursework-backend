const Router = require('express');
const router = new Router();
const CardpassController = require('../controllers/cardpassController');

router.post('/', CardpassController.create);
router.get('/', CardpassController.getAll);


module.exports = router