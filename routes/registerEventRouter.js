const Router = require('express');
const router = new Router();
const RegisterEventController = require('../controllers/registerEventController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, RegisterEventController.create);
router.post('/update', authMiddleware, checkRole('Начальник смены'), RegisterEventController.updateConfirm);
router.get('/', RegisterEventController.getAll);
router.get('/worker/:id', authMiddleware, RegisterEventController.getOneToWorker);
router.get('/master/:id', authMiddleware, RegisterEventController.getOneToMaster);

module.exports = router