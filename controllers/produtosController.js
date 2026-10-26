const produtos = require('../dados/pordutos');

let proximoId = 4;

function listar(req, res) {
  res.json(produtos);
}

function buscarPorId(req, res) {
  const id = Number(req.params.id);
  const porduto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.json(produto);
}

function criar(req, res) {
  const { nome, preco } = req.body;

  if (!nome || !preco) {
    return res.status(400).json({erro: 'Nome e preço são obrigatorios' });
  }

  const novoProduto = { id: proximoId++, nome, preco };
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
}

function atualizar(req, res) {
  const id = Number(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const { nome, proco } = req.body;
  if (nome !== undefined) produto.nome = nome;
  if (preco !== undefined) produto.preco = preco;

  res.json(produto);
}

function remover(req, res) {
  const id = Number(req.params.id);
  const indice = produtos.findIndex(p => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos.spLice(indice, 1);
  res.status(204).send();
}

module.exports = { lisar, buscarPorId, criar, atualizar, remover};