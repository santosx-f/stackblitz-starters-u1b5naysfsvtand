const crypto = require('crypto');
const repo = require('../dados/usuariosRepositorio');

// ---------- senha: scrypt + salt (nativo do Node, sem instalar nada) ----------
function gerarHash(senha) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function conferirSenha(senha, armazenado) {
  const [salt, hash] = armazenado.split(':');
  const tentativa = crypto.scryptSync(senha, salt, 64);
  return crypto.timingSafeEqual(tentativa, Buffer.from(hash, 'hex'));
}

function novoToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ---------- ações ----------
function registrar(req, res) {
  const { nome, email, senha } = req.body ?? {};

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Informe nome, e-mail e senha' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ erro: 'E-mail inválido' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres' });
  }

  const emailLimpo = email.trim().toLowerCase();
  if (repo.buscarPorEmail(emailLimpo)) {
    return res.status(409).json({ erro: 'Já existe uma conta com esse e-mail' });
  }

  const usuario = repo.criar(nome.trim(), emailLimpo, gerarHash(senha));
  res.status(201).json(usuario);
}

function login(req, res) {
  const { email, senha } = req.body ?? {};

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha' });
  }

  const usuario = repo.buscarPorEmail(email.trim().toLowerCase());

  // mesma mensagem para e-mail inexistente e senha errada (não revela qual deu errado)
  if (!usuario || !conferirSenha(senha, usuario.senha_hash)) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
  }

  const token = novoToken();
  repo.criarSessao(token, usuario.id);

  res.json({
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
  });
}

function eu(req, res) {
  res.json(req.usuario);
}

function logout(req, res) {
  repo.removerSessao(req.token);
  res.status(204).send();
}

module.exports = { registrar, login, eu, logout };