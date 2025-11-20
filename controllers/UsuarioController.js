const Usuario = require("../models/Usuario");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const criarUsuario = async (req, res) => {
    try {
        const { nome, usuario, email, senha } = req.body;

        const emailExistente = await Usuario.findOne({ email });
        if (emailExistente) {
            return res.status(400).json({ mensagem: "Email já cadastrado." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const novoUsuario = new Usuario({ nome, usuario, email, senha: senhaCriptografada });
        await novoUsuario.save();

        res.status(201).json({ usuario: novoUsuario });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao criar usuário.", erro });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        const usuarioExiste = await Usuario.findOne({ usuario });
        if (!usuarioExiste) {
            return res.status(400).json({ mensagem: "Usuário não encontrado." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioExiste.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "Senha inválida." });
        }

        const token = jwt.sign({ id: usuarioExiste._id }, 'seuSegredoJWT', { expiresIn: '1d' });
        const { senha: _, ...dadosUsuario } = usuarioExiste.toObject();

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,
            usuario: dadosUsuario
        });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao realizar login.", erro });
    }
};

module.exports = { criarUsuario, loginUsuario };