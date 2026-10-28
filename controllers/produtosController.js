const { lerBanco, salvarBanco } = require('../dados/produtosRepositorio');

async function listar(req, res) {
  const banco = await lerBanco();
  res.json(banco.produtos);
}

async function buscarPorId(req, res) {
  const banco = await lerBanco();
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const produto = banco.produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.json(produto);
}

async function criar(req, res) {
  const { nome, preco } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ erro: 'Nome é obrigatório' });
  }

  if (preco === undefined || isNaN(Number(preco)) || Number(preco) <= 0) {
    return res.status(400).json({ erro: 'Preço deve ser um número válido e maior que zero' });
  }

  const banco = await lerBanco();
  const novoProduto = {
    id: banco.proximoId,
    nome: nome.trim(),
    preco: Number(preco)
  };

  banco.produtos.push(novoProduto);
  banco.proximoId++;

  await salvarBanco(banco);
  res.status(201).json(novoProduto);
}

async function atualizar(req, res) {
  const banco = await lerBanco();
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const produto = banco.produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const { nome, preco } = req.body;

  if (nome !== undefined && nome.trim() !== '') {
    produto.nome = nome.trim();
  }

  if (preco !== undefined) {
    const precoNumero = Number(preco);
    if (isNaN(precoNumero) || precoNumero <= 0) {
      return res.status(400).json({ erro: 'Preço deve ser um número válido e maior que zero' });
    }
    produto.preco = precoNumero;
  }

  await salvarBanco(banco);
  res.json(produto);
}

async function remover(req, res) {
  const banco = await lerBanco();
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const indice = banco.produtos.findIndex(p => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  banco.produtos.splice(indice, 1);
  await salvarBanco(banco);
  res.status(204).send();
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };