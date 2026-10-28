const BASE = 'http://localhost:3000';

async function pedir(metodo, caminho, dados) {
  const opcoes = {method: metodo, headers: { 'Content-Type': 'application/json' } };
  if (dados) opcoes.body = JSON.stringify(dados);

  const resposta = await fetch(BASE + caminho, opcoes);
  const texto = await resposta.text();
  let corpo = null

  const corpo = texto ? JSON.parse(texto) : '(sem conteúdo)';

  console.log(`\n${method} ${caminho} → stutus ${resposta.status}`);
  console.log(corpo);
  return corpo;
}

async function testarTudo() {
  try {
    await pedir('GET', '/produtos');
    await pedir('GET', '/produtos/1');
    const novo = await pedir('POST', '/produtos', { nome: 'Boné', preco: 39.9 });
    await pedir('PUT', `/produtos/${novo.id}`, { preco: 59.9 });
    await pedir('DELETE', `/produtos/${novo.id}`);
    await pedir('GET', `/produtos/${novo.id}`);
    await pedir('POST',  '/produtos', { nome: 'Meia' });
  } catch (erro) {
    console.log('Motivo do erro:', erro.couse || erro.message);
  }
}

testarTudo();