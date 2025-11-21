const Usuario = require("../models/Usuario");

const criarUsuario = async (req, res) => {
  try {
    const { nome, usuario, email, senha } = req.body;

    // Verifica duplicidade de email e usuário
    const emailExistente = await Usuario.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ mensagem: "Email já cadastrado." });
    }

    const usuarioExistente = await Usuario.findOne({ usuario });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: "Usuário já cadastrado." });
    }

    // Criação do usuário (hash será feito automaticamente no pre-save do schema)
    const novoUsuario = new Usuario({ nome, usuario, email, senha });
    await novoUsuario.save();

    // Remove senha do retorno
    const usuarioSemSenha = novoUsuario.toObject();
    delete usuarioSemSenha.senha;

    res.status(201).json({ usuario: usuarioSemSenha });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao criar usuário.", erro });
  }
};


const loginUsuario = async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Verifica se o usuário existe
    const usuarioEncontrado = await Usuario.findOne({ usuario });
    if (!usuarioEncontrado) {
      return res.status(400).json({ mensagem: "Usuário não encontrado." });
    }

    // Compara a senha informada com o hash salvo
    const senhaValida = await usuarioEncontrado.compareSenha(senha);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Senha inválida." });
    }

    // Gera token JWT usando método do schema
    const token = usuarioEncontrado.generateAuthToken();

    // Remove a senha antes de retornar
    const usuarioSemSenha = usuarioEncontrado.toObject();
    delete usuarioSemSenha.senha;

    res.status(200).json({ usuario: usuarioSemSenha, token });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao realizar login.", erro });
  }
};

module.exports = { loginUsuario, criarUsuario };