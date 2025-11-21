const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

router.post('/cadastro', UsuarioController.criarUsuario);
router.post('/login', UsuarioController.loginUsuario);

module.exports = router;