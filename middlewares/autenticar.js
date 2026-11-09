const repo = require('../dados/usuariosRepositorio');

const VALIDADE_MS = 1000 * 60 * 60 * 8; // sessão dura 8 horas

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Faça login para continuar' });
  }

  const usuario = repo.buscarUsuarioPorToken(token);

  if (!usuario) {
    return res.status(401).json({ erro: 'Sessão inválida' });
  }
  if (Date.now() - usuario.criada_em > VALIDADE_MS) {
    repo.removerSessao(token);
    return res.status(401).json({ erro: 'Sessão expirada, entre novamente' });
  }

  req.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email };
  req.token = token;
  next();
}

module.exports = autenticar;
