const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
let quantidade = 1;
let totalDiario = parseFloat(localStorage.getItem('totalDiario')) || 0;

// Função para salvar dados no LocalStorage
function salvarDados() {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    localStorage.setItem('totalDiario', totalDiario.toString());
}

// Função para ajustar a quantidade
function ajustarQuantidade(alteracao) {
    quantidade = Math.max(1, quantidade + alteracao);
    document.getElementById('quantidade').innerText = quantidade;
}

// Função para registrar pedidos
document.getElementById('pedido-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const garcom = document.getElementById('garcom').value;
    const item = document.getElementById('item').value;
    const preco = 20.00;

    const pedido = { garcom, item, quantidade, preco };
    pedidos.push(pedido);

    atualizarListaPedidos();
    salvarDados();
    quantidade = 1;
    document.getElementById('quantidade').innerText = quantidade;
    this.reset();
});

// Função para atualizar a lista de pedidos registrados
function atualizarListaPedidos() {
    const pedidosList = document.getElementById('pedidos-list');
    pedidosList.innerHTML = '';

    pedidos.forEach((pedido, index) => {
        const li = document.createElement('li');
        li.textContent = `${pedido.quantidade}x ${pedido.item} - Garçom: ${pedido.garcom}`;

        const buttonRemover = document.createElement('button');
        buttonRemover.textContent = 'Remover';
        buttonRemover.onclick = () => {
            pedidos.splice(index, 1);
            atualizarListaPedidos();
            salvarDados();
        };

        li.appendChild(buttonRemover);
        pedidosList.appendChild(li);
    });
}

// Função para calcular a conta total
document.getElementById('calcular-conta').addEventListener('click', function () {
    const total = calcularTotal();
    document.getElementById('total-conta').textContent = `R$ ${total.toFixed(2)}`;
});

// Função para calcular o total de vendas
function calcularTotal() {
    return pedidos.reduce((total, pedido) => total + pedido.quantidade * pedido.preco, 0);
}

// Função para processar pagamento
document.getElementById('processar-pagamento').addEventListener('click', function () {
    const total = calcularTotal();
    const metodoPagamento = document.getElementById('metodo-pagamento').value;
    const mensagemPagamento = document.getElementById('mensagem-pagamento');

    if (total > 0) {
        totalDiario += total;
        salvarDados();

        const detalhesPedido = pedidos.map(pedido => `${pedido.quantidade}x ${pedido.item}`).join(', ');
        const mensagemSucesso = `Nota Fiscal: ${detalhesPedido} - R$ ${total.toFixed(2)}. Total: R$ ${total.toFixed(2)}. Pagamento processado com ${metodoPagamento === 'credito' ? 'crédito' : 'débito'}.`;

        mensagemPagamento.textContent = mensagemSucesso;
        mensagemPagamento.classList.add('mostrar-mensagem');

        pedidos.length = 0;
        atualizarListaPedidos();
        document.getElementById('total-conta').textContent = 'R$ 0,00';
    } else {
        mensagemPagamento.textContent = 'Não há total para processar.';
        mensagemPagamento.classList.add('mostrar-mensagem');
    }
});

// Função para gerar o relatório diário
document.getElementById('gerar-relatorio-diario').addEventListener('click', function () {
    const dataHoje = new Date().toLocaleDateString();
    const relatorio = `Relatório do Dia ${dataHoje}: Total de Vendas: R$ ${totalDiario.toFixed(2)}`;
    document.getElementById('relatorio-result').textContent = relatorio;
});

// Botão para zerar o relatório diário com confirmação
document.getElementById('zerar-relatorio').addEventListener('click', function () {
    if (confirm("Você tem certeza que deseja zerar o relatório diário?")) {
        totalDiario = 0;
        document.getElementById('relatorio-result').textContent = '';
        salvarDados();
    }
});

// Função para exportar o backup dos dados
function exportarBackup() {
    const dadosBackup = {
        pedidos,
        totalDiario
    };

    const blob = new Blob([JSON.stringify(dadosBackup)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'backup_restaurante.json';
    link.click();
}

// Função para importar dados do backup
function importarBackup(event) {
    const arquivo = event.target.files[0];
    const leitor = new FileReader();

    leitor.onload = function (e) {
        const dadosImportados = JSON.parse(e.target.result);
        localStorage.setItem('pedidos', JSON.stringify(dadosImportados.pedidos));
        localStorage.setItem('totalDiario', dadosImportados.totalDiario.toString());

        pedidos.length = 0;
        pedidos.push(...dadosImportados.pedidos);
        totalDiario = parseFloat(dadosImportados.totalDiario);
        
        atualizarListaPedidos();
    };

    leitor.readAsText(arquivo);
}

// Executa ao carregar para exibir dados salvos
atualizarListaPedidos();
document.getElementById('total-conta').textContent = `R$ ${calcularTotal().toFixed(2)}`;
document.getElementById('quantidade').innerText = quantidade;
