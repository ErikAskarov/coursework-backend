const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const eventRouter = require('./eventRouter');
const registerEventRouter = require('./registerEventRouter');
const cardpassRouter = require('./cardpassRouter');

router.use('/user', userRouter);
router.use('/cardpass', cardpassRouter);
router.use('/registerevent', registerEventRouter);
router.use('/event', eventRouter);

module.exports = router