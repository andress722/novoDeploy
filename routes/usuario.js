var express = require('express');
var router = express.Router();
var usuario = require('../controller/usuarioControl');

var verificaLogin = require('../middlewares/authLogin');

router.get('/', usuario.index);
router.get('/login', usuario.login);
router.post('/login', usuario.loginPost);
router.get('/logout', usuario.logout);
router.get('/contato', usuario.contato);
router.get('/newpass', usuario.forgetPassword);
router.get('/produtos', usuario.produtoUsuario);
router.get('/procura', usuario.procura);
router.get('/procura/:nome', usuario.procuraParam);
router.get('/produtos/:idProduto', usuario.produtoUsuarioId);
router.get('/cadastro', usuario.cadastro);
router.post('/cadastro', usuario.cadastroPost);
router.get('/cep', usuario.cep);
router.post('/cep', usuario.cepPost);
router.get('/logar', usuario.log);
router.get('/cadastro/edit/:id', usuario.editUsuarioGet);
router.post('/cadastro/edit/:id', usuario.editUsuarioPost);
router.get('/order/:order', verificaLogin, usuario.viewOrder);
router.get('/admin', verificaLogin, usuario.admin);

module.exports = router;
