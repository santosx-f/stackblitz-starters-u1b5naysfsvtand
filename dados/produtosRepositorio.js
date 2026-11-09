const db = require('./banco');

const { total } = db.prepare('SELECT COUNT(*) AS total FROM produtos').get();
if (total === 0) {
  const inserir = db.prepare('INSERT INTO produtos (nome, preco) VALUES (?, ?)');
  inserir.run('Camiseta', 49.9);
  inserir.run('Calça', 129.9);
  inserir.run('Tênis', 299.9);
}

function listar() {
  return db.prepare('SELECT * FROM produtos').all();
}

function buscarPorId(id) {
  return db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
}

function criar(nome, preco) {
  const resultado = db
    .prepare('INSERT INTO produtos (nome, preco) VALUES (?, ?)')
    .run(nome, preco);
  return buscarPorId(Number(resultado.lastInsertRowid));
}

function atualizar(id, nome, preco) {
  db.prepare('UPDATE produtos SET nome = ?, preco = ? WHERE id = ?').run(nome, preco, id);
  return buscarPorId(id);
}

function remover(id) {
  const resultado = db.prepare('DELETE FROM produtos WHERE id = ?').run(id);
  return resultado.changes > 0;
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
