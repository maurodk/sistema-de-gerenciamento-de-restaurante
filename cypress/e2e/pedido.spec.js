describe('Sistema de Gerenciamento de Restaurante', () => {
    beforeEach(() => {
        localStorage.setItem('backupData', JSON.stringify([
            { garcom: 'Garçom 1', item: 'Prato 1', quantidade: 2, preco: 20.00 }
        ]));
        cy.visit('http://127.0.0.1:5500/public/login.html');
        cy.get('#username').type('admin');
        cy.get('#password').type('senha123');
        cy.get('#login-form').submit();
        cy.url().should('include', 'index.html');
    });

    it('Deve permitir o registro de novos pedidos', () => {
        cy.get('#garcom').select('Garçom 1');
        cy.get('#item').select('Prato 1');
        cy.get('#quantidade').should('contain', '1');
        cy.get('#quantidade-plus').click();
        cy.get('#pedido-form').submit();
        cy.get('#pedidos-list').should('contain', '2x Prato 1 - Garçom: Garçom 1');
    });

    it('Deve permitir a visualização de pedidos na cozinha', () => {
        cy.get('#garcom').select('Garçom 2');
        cy.get('#item').select('Prato 2');
        cy.get('#quantidade-plus').click().click();
        cy.get('#pedido-form').submit();
        cy.get('#pedidos-list').should('contain', '3x Prato 2');
    });

    it('Deve calcular automaticamente a conta', () => {
        cy.get('#garcom').select('Garçom 3');
        cy.get('#item').select('Prato 3');
        cy.get('#pedido-form').submit();
        cy.get('#calcular-conta').click();
        cy.get('#total-conta').should('contain', 'R$ 20.00');
    });

    it('Deve processar pagamentos com cartões de crédito e débito', () => {
        cy.get('#garcom').select('Garçom 4');
        cy.get('#item').select('Prato 4');
        cy.get('#quantidade-plus').click();
        cy.get('#pedido-form').submit();
        cy.get('#calcular-conta').click();

        cy.get('#metodo-pagamento').select('credito');
        cy.get('#processar-pagamento').click();
    
        cy.get('#mensagem-pagamento', { timeout: 10000 })
            .should('contain', 'Nota Fiscal: 2x Prato 4 - R$ 40.00. Total: R$ 40.00. Pagamento processado com crédito.');
    
        cy.get('#pedidos-list').should('be.empty');
        cy.get('#total-conta').should('contain', 'R$ 0,00');
    });

    it('Deve gerar relatórios de vendas', () => {
        cy.get('#garcom').select('Garçom 5');
        cy.get('#item').select('Prato 5');
        cy.get('#quantidade-plus').click();
        cy.get('#pedido-form').submit();
        cy.get('#calcular-conta').click();

        cy.get('#metodo-pagamento').select('credito');
        cy.get('#processar-pagamento').click();

        cy.get('#gerar-relatorio-diario').click();
        const dataHoje = new Date().toLocaleDateString('pt-BR');
        cy.get('#relatorio-result').should('contain', `Relatório do Dia ${dataHoje}: Total de Vendas: R$ 40.00`);
    });

    it('Deve ser acessível em dispositivos móveis', () => {
        cy.viewport('iphone-6');
        cy.get('#garcom').select('Garçom 6');
        cy.get('#item').select('Prato 6');
        cy.get('#pedido-form').submit();
        cy.get('#pedidos-list').should('contain', '1x Prato 6 - Garçom: Garçom 6');
    });

    it('Deve ter um tempo de resposta máximo de 2 segundos', () => {
        cy.get('#garcom').select('Garçom 7');
        cy.get('#item').select('Prato 7');
        cy.get('#pedido-form').submit();
        cy.get('#calcular-conta').click();
        cy.get('#total-conta', { timeout: 2000 }).should('exist');
    });

    it('Deve restaurar pedidos a partir do backup localStorage', () => {
        cy.get('#garcom').select('Garçom 1');
        cy.get('#item').select('Prato 1');
        cy.get('#quantidade-plus').click();
        cy.get('#pedido-form').submit();
        cy.get('#calcular-conta').click();
        cy.get('#botao-backup').click();
        cy.get('#pedidos-list').should('contain', '2x Prato 1 - Garçom: Garçom 1');
        
        cy.window().then((win) => {
            const pedidos = JSON.parse(win.localStorage.getItem('backupData'));
            expect(pedidos).to.deep.equal([
                { garcom: 'Garçom 1', item: 'Prato 1', quantidade: 2, preco: 20.00 }
            ]);
        });     
    });
});
