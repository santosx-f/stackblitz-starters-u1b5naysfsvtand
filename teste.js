// Rode com o servidor ligado:  node index.js   (em um terminal)
//                              node teste.js   (em outro)
const BASE = 'http://localhost:3000';
let token = null;

async function pedir(metodo, caminho, dados) {
  const opcoes = { method: metodo, headers: { 'Content-Type': 'application/json' } };
  if (token) opcoes.headers.Authorization = `Bearer ${token}`;
  if (dados) opcoes.body = JSON.stringify(dados);

  const resposta = await fetch(BASE + caminho, opcoes);
  const texto = await resposta.text();
  const corpo = texto ? JSON.parse(texto) : '(sem conteúdo)';

  console.log(`\n${metodo} ${caminho} → status ${resposta.status}`);
  console.log(corpo);
  return corpo;
}

async function testarTudo() {
  try {
    const email = `teste${Date.now()}@loja.com`;

    console.log('--- sem login (deve dar 401) ---');
    await pedir('GET', '/produtos');

    console.log('\n--- cadastro e login ---');
    await pedir('POST', '/auth/registrar', { nome: 'Teste', email, senha: '123456' });
    await pedir('POST', '/auth/login', { email, senha: 'errada' }); // 401
    const sessao = await pedir('POST', '/auth/login', { email, senha: '123456' });
    token = sessao.token;
    await pedir('GET', '/auth/eu');

    console.log('\n--- produtos (com login) ---');
    await pedir('GET', '/produtos');
    await pedir('GET', '/produtos/1');
    const novo = await pedir('POST', '/produtos', { nome: 'Boné', preco: 39.9 });
    await pedir('PUT', `/produtos/${novo.id}`, { preco: 59.9 });
    await pedir('DELETE', `/produtos/${novo.id}`);
    await pedir('GET', `/produtos/${novo.id}`);   // 404
    await pedir('POST', '/produtos', { nome: 'Meia' }); // 400

    console.log('\n--- logout ---');
    await pedir('POST', '/auth/logout');
    await pedir('GET', '/produtos'); // 401 de novo
  } catch (erro) {
    console.log('Motivo do erro:', erro.cause || erro.message);
  }
}

testarTudo();
