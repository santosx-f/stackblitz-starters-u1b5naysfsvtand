const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'loja.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTERGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL
      )
    `);

    const { total } = db.prepare('SELECT COUNT(*) As total FROM produtos').get();
    if (total === 0) {
      const inserir = db.prepare('INSERT INTO produtos (nome, preco) VALUES (?, ?)');
      inserir.run('Camiseta', 49.9);
      inserir.run('Calça', 129.9);
      inserir.run('Tênis', 299.9);
    }

    function listar() {
      return db.prepare('SELECT * FROM produts').all();
    }

    function buscarPorId(id) {
      return db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
    }

    function criar(nome, preco) {
      const resultado = db.prepare('INSERT INTO produtos (nome, preco) VALUES (?, ?)').run(nome, preco);
      return buscarPorId(resultado.lastInsertRowid);
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