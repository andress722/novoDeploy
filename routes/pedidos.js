var express = require('express');
var router = express.Router();
var pedidos = require('../controller/pedidoController');
var creaOrder = require('../controller/payController');

var verificaLogin = require('../middlewares/authLogin');

const multer = require('multer');

router.get('/', pedidos.index);
router.get('/adiciona/:idProduto', pedidos.adiciona);
router.get('/adiciona/:idProdutos/post', pedidos.adicionaPost);
router.get('/vercarrinho', pedidos.verCarrinho);
router.post('/detalhes-pedido', pedidos.enviarPedido);
router.get('/pay', creaOrder.teste);
router.post('/create_preference', creaOrder.createPrefer);
router.get('/feedback', creaOrder.feedback);
router.post('/update', pedidos.refreshQuantaty);

module.exports = router;
