const Router = require('express');
const router = new Router();
const EventController = require('../controllers/eventController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('Начальник смены'), EventController.create);
router.get('/', EventController.getAll);
router.get('/:id', EventController.getOne);


module.exports = router