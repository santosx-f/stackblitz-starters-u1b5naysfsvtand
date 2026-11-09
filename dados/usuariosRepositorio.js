const db = require('./banco');

function criar(nome, email, senhaHash) {
  const resultado = db
    .prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run(nome, email, senhaHash);
  return buscarPorId(Number(resultado.lastInsertRowid));
}

function buscarPorId(id) {
  return db.prepare('SELECT id, nome, email FROM usuarios WHERE id = ?').get(id);
}

// Devolve também o senha_hash (usado só no login)
function buscarPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
}

function criarSessao(token, usuarioId) {
  db.prepare('INSERT INTO sessoes (token, usuario_id, criada_em) VALUES (?, ?, ?)')
    .run(token, usuarioId, Date.now());
}

function buscarUsuarioPorToken(token) {
  return db.prepare(`
    SELECT u.id, u.nome, u.email, s.criada_em
    FROM sessoes s
    JOIN usuarios u ON u.id = s.usuario_id
    WHERE s.token = ?
  `).get(token);
}

function removerSessao(token) {
  db.prepare('DELETE FROM sessoes WHERE token = ?').run(token);
}

module.exports = {
  criar,
  buscarPorId,
  buscarPorEmail,
  criarSessao,
  buscarUsuarioPorToken,
  removerSessao,
};