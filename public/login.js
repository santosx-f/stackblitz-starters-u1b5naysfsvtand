const formulario = document.getElementById('form-login');
const titulo = document.getElementById('titulo-login');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoSenha = document.getElementById('senha');
const botaoEnviar = document.getElementById('botao-enviar');
const botaoAlternar = document.getElementById('botao-alternar');
const mensagem = document.getElementById('mensagem');

let modoCadastro = false;

// já está logado? vai direto para a loja
if (localStorage.getItem('token')) {
    window.location.href = '/';
}

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = tipo || '';
}

function alternarModo() {
    modoCadastro = !modoCadastro;
    campoNome.hidden = !modoCadastro;
    campoNome.required = modoCadastro;
    campoSenha.autocomplete = modoCadastro ? 'new-password' : 'current-password';
    titulo.textContent = modoCadastro ? 'Criar conta' : 'Entrar';
    botaoEnviar.textContent = modoCadastro ? 'Cadastrar' : 'Entrar';
    botaoAlternar.textContent = modoCadastro
        ? 'Já tem conta? Entrar'
        : 'Não tem conta? Cadastre-se';
    mostrarMensagem('');
}

async function enviar(caminho, dados) {
    const resposta = await fetch(caminho, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    });
    const corpo = await resposta.json();
    if (!resposta.ok) throw new Error(corpo.erro || 'Algo deu errado');
    return corpo;
}

async function fazerLogin() {
    const sessao = await enviar('/auth/login', {
        email: campoEmail.value,
        senha: campoSenha.value,
    });
    localStorage.setItem('token', sessao.token);
    localStorage.setItem('usuario', JSON.stringify(sessao.usuario));
    window.location.href = '/';
}

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    botaoEnviar.disabled = true;
    mostrarMensagem('');

    try {
        if (modoCadastro) {
            await enviar('/auth/registrar', {
                nome: campoNome.value,
                email: campoEmail.value,
                senha: campoSenha.value,
            });
        }
        await fazerLogin(); // depois de cadastrar, já entra
    } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
    } finally {
        botaoEnviar.disabled = false;
    }
});

botaoAlternar.addEventListener('click', alternarModo);
