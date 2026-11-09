const express = require('express');
const controller = require('../controllers/authController');
const autenticar = require('../middlewares/autenticar');

const router = express.Router();

router.post('/registrar', controller.registrar);
router.post('/login', controller.login);
router.get('/eu', autenticar, controller.eu);
router.post('/logout', autenticar, controller.logout);

module.exports = router;
