const router = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use(auth);
router.use('/users', routerUsers);
router.use('/cards', routerCards);

router.use((req, res, next) => {
  next(new NotFoundError('Ошибка 404: Страница отсутствует'));
});

module.exports = router;
