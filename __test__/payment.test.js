// Função para calcular total
function calcularTotal() {
    return pedidos.reduce((acc, pedido) => acc + (pedido.quantidade * pedido.preco), 0);
}

document.getElementById('processar-pagamento').addEventListener('click', function () {
    const total = calcularTotal();
    const metodoPagamento = document.getElementById('metodo-pagamento').value;
    const mensagemPagamento = document.getElementById('mensagem-pagamento');

    // Limpa a mensagem anterior
    mensagemPagamento.textContent = '';
    mensagemPagamento.classList.remove('mostrar-mensagem');

    if (total > 0) {
        // Cria a descrição detalhada dos pedidos
        const detalhesPedidos = pedidos.map(pedido => `${pedido.quantidade}x ${pedido.item} - R$ ${(pedido.quantidade * pedido.preco).toFixed(2)}`).join(', ');

        // Atualiza a mensagem de pagamento
        mensagemPagamento.textContent = `Nota Fiscal: ${detalhesPedidos}. Total: R$ ${total.toFixed(2)}. Pagamento processado com ${metodoPagamento}.`;
        mensagemPagamento.classList.add('mostrar-mensagem');

        // Limpa os pedidos após o pagamento
        pedidos.length = 0; // Limpa a lista de pedidos
        atualizarListaPedidos(); // Atualiza a lista
        atualizarListaCozinha(); // Atualiza a lista na cozinha
        document.getElementById('total-conta').textContent = 'R$ 0,00'; // Reseta o total
    } else {
        mensagemPagamento.textContent = 'Não há total para processar.';
        mensagemPagamento.classList.add('mostrar-mensagem');
    }
});
