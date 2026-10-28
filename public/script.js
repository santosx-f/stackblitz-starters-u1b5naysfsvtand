const API = '/produtos';

const formulario = document.getElementById('formulario');
const campoNome = document.getElementById('nome');
const campoPreco = document.getElementById('preco');
const tituloForm = document.getElementById('titulo-form');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const mensagem = document.getElementById('mensagem');
const lista = document.getElementById('lista');

let idEmEdicao = null;

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = tipo;
}

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
}

function criarItem(produto) {
    const item = document.createElement('li');

    const info = document.createElement('div');
    const nome = document.createElement('strong');
    nome.textContent = produto.nome;
    const preco = document.createElement('div');
    preco.className = 'preco';
    preco.textContent = formatarPreco(produto.preco);
    info.append(nome, preco);

    const botaoEditar = document.createElement('button');
    botaoEditar.textContent = 'Editar';
    botaoEditar.className = 'editar';
    botaoEditar.addEventListener('click', () => iniciarEdicao(produto));

    const botaoApagar = document.createElement('button');
    botaoApagar.textContent = 'Apagar';
    botaoApagar.className = 'apagar';
    botaoApagar.addEventListener('click', () => apagarProduto(produto));

    const botoes = document.createElement('div');
    botoes.className = 'botoes';
    botoes.append(botaoEditar, botaoApagar);

    item.append(info, botoes);
    return item;
}

async function carregarProdutos() {
    lista.textContent = 'Carregando...'

    try {
        const resposta = await fetch(API);
        const produtos = await resposta.json();

        lista.textContent = '';
        if (produtos.lenght === 0) {
            lista.textContent = 'Nenhum produto cadastro.';
            return;
        }
        produtos.forEach(produto => lista.append(criarItem(produto)));
    } catch {
        lista.textContent = 'Não foi possivel caregar os produtos';
    }
}