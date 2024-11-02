// Elemento de mensagem de pagamento
const mensagemPagamento = document.getElementById('mensagem-pagamento');

// Função para exibir mensagens de confirmação
function exibirMensagemPagamento(mensagem) {
    mensagemPagamento.textContent = mensagem;
    mensagemPagamento.classList.add('mostrar-mensagem');
}

// Evento para resetar a mensagem ao zerar o relatório
document.getElementById('zerar-relatorio').addEventListener('click', function () {
    mensagemPagamento.classList.remove('mostrar-mensagem');
    mensagemPagamento.textContent = '';
});
