const express = require('express');
const controller = require('../controllers/produtosController');
const autenticar = require('../middlewares/autenticar');

const router = express.Router();

// todas as rotas de produtos exigem login
router.use(autenticar);

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;
