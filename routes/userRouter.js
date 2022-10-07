const Router = require('express');
const userController = require('../controllers/userController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);
router.get('/get/:id', authMiddleware, userController.getOne);
router.get('/', authMiddleware, checkRole('Начальник смены'), userController.getAll);
router.get('/table/', authMiddleware, checkRole('Начальник смены'), userController.getDataToTable);

module.exports = router