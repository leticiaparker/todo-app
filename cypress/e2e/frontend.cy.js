// cypress/e2e/frontend.cy.js
// Testes E2E do Frontend — Lista de Tarefas

describe('Frontend — Lista de Tarefas', () => {
  beforeEach(() => {
    cy.resetTasks();
    cy.visit('/');
  });

  // ────────────────────────────────────────────────
  // Carregamento inicial
  // ────────────────────────────────────────────────
  it('exibe o título "Lista de Tarefas" centralizado', () => {
    cy.get('[data-cy="app-title"]')
      .should('be.visible')
      .and('contain', 'Lista de Tarefas');
  });

  it('exibe o subtítulo "Organize seu dia com eficiência"', () => {
    cy.get('[data-cy="app-subtitle"]')
      .should('be.visible')
      .and('contain', 'Organize seu dia com eficiência');
  });

  it('exibe campo de entrada e botão adicionar', () => {
    cy.get('[data-cy="task-input"]').should('be.visible');
    cy.get('[data-cy="add-btn"]').should('be.visible');
  });

  it('exibe 0 tarefas restantes ao iniciar', () => {
    cy.get('[data-cy="task-count"]').should('contain', '0');
  });

  it('exibe as abas Todas, Ativas e Concluídas', () => {
    cy.get('[data-cy="filter-all"]').should('be.visible').and('contain', 'Todas');
    cy.get('[data-cy="filter-active"]').should('be.visible').and('contain', 'Ativas');
    cy.get('[data-cy="filter-completed"]').should('be.visible').and('contain', 'Concluídas');
  });

  // ────────────────────────────────────────────────
  // Adicionar tarefas
  // ────────────────────────────────────────────────
  it('adiciona tarefa ao clicar no botão ADICIONAR', () => {
    cy.get('[data-cy="task-input"]').type('Comprar pão');
    cy.get('[data-cy="add-btn"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Comprar pão');
  });

  it('adiciona tarefa ao pressionar Enter', () => {
    cy.get('[data-cy="task-input"]').type('Estudar Cypress{enter}');
    cy.get('[data-cy="task-list"]').should('contain', 'Estudar Cypress');
  });

  it('limpa o campo após adicionar tarefa', () => {
    cy.get('[data-cy="task-input"]').type('Tarefa teste{enter}');
    cy.get('[data-cy="task-input"]').should('have.value', '');
  });

  it('não adiciona tarefa com título vazio', () => {
    cy.get('[data-cy="add-btn"]').click();
    cy.get('[data-cy="task-item"]').should('have.length', 0);
  });

  it('atualiza contador ao adicionar tarefas', () => {
    cy.get('[data-cy="task-input"]').type('Tarefa 1{enter}');
    cy.get('[data-cy="task-count"]').should('contain', '1');
    cy.get('[data-cy="task-input"]').type('Tarefa 2{enter}');
    cy.get('[data-cy="task-count"]').should('contain', '2');
  });

  // ────────────────────────────────────────────────
  // Ícone de lixeira + confirmação de exclusão
  // ────────────────────────────────────────────────
  it('exibe ícone de lixeira ao lado de cada tarefa', () => {
    cy.addTaskViaAPI('Tarefa com lixeira');
    cy.visit('/');
    cy.get('[data-cy^="delete-btn-"]').first().should('be.visible');
  });

  it('abre modal de confirmação ao clicar na lixeira', () => {
    cy.addTaskViaAPI('Confirmar exclusão');
    cy.visit('/');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="confirm-modal"]').should('be.visible');
  });

  it('exibe o nome da tarefa no modal de confirmação', () => {
    cy.addTaskViaAPI('Minha tarefa especial');
    cy.visit('/');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="modal-task-title"]').should('contain', 'Minha tarefa especial');
  });

  it('cancela a exclusão ao clicar em Cancelar', () => {
    cy.addTaskViaAPI('Não deletar esta');
    cy.visit('/');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="modal-cancel"]').click();
    cy.get('[data-cy="confirm-modal"]').should('not.be.visible');
    cy.get('[data-cy="task-list"]').should('contain', 'Não deletar esta');
  });

  it('confirma a exclusão ao clicar em Excluir no modal', () => {
    cy.addTaskViaAPI('Deletar esta');
    cy.visit('/');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="modal-confirm"]').click();
    cy.get('[data-cy="task-list"]').should('not.contain', 'Deletar esta');
  });

  it('fecha o modal ao clicar no overlay', () => {
    cy.addTaskViaAPI('Overlay test');
    cy.visit('/');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="confirm-modal"]').click({ force: true });
    cy.get('[data-cy="confirm-modal"]').should('not.be.visible');
  });

  it('mantém a tarefa na lista após cancelar exclusão', () => {
    cy.addTaskViaAPI('Persistir após cancelar');
    cy.visit('/');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="modal-cancel"]').click();
    cy.get('[data-cy="task-item"]').should('have.length', 1);
  });

  // ────────────────────────────────────────────────
  // Marcar como concluída — risco, ordenação, horário
  // ────────────────────────────────────────────────
  it('marca tarefa como concluída ao clicar no círculo', () => {
    cy.addTaskViaAPI('Concluir isso');
    cy.visit('/');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy^="task-check-"]').first().should('have.class', 'done');
  });

  it('aplica risco (line-through) no título da tarefa concluída', () => {
    cy.addTaskViaAPI('Tarefa com risco');
    cy.visit('/');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy^="task-title-"]').first().should('have.class', 'done');
  });

  it('tarefa concluída vai para o final da lista na aba Todas', () => {
    cy.addTaskViaAPI('Primeira');
    cy.addTaskViaAPI('Segunda');
    cy.visit('/');
    cy.get('[data-cy="task-item"]').first().find('[data-cy^="task-check-"]').click();
    cy.get('[data-cy="task-item"]').last().find('[data-cy^="task-title-"]').should('have.class', 'done');
  });

  it('exibe horário de conclusão ao marcar tarefa como concluída', () => {
    cy.addTaskViaAPI('Com horário');
    cy.visit('/');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy^="task-completed-at-"]').first().should('be.visible');
    cy.get('[data-cy^="task-completed-at-"]').first()
      .invoke('text')
      .should('match', /Concluída em \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
  });

  it('remove horário ao desmarcar tarefa concluída', () => {
    cy.addTaskViaAPI('Desmarcar');
    cy.visit('/');
    cy.get('[data-cy^="task-check-"]').first().click(); // conclui
    cy.get('[data-cy^="task-check-"]').first().click(); // desmarca
    cy.get('[data-cy^="task-completed-at-"]').should('not.exist');
  });

  it('reduz o contador ao concluir tarefa', () => {
    cy.addTaskViaAPI('A');
    cy.addTaskViaAPI('B');
    cy.visit('/');
    cy.get('[data-cy="task-count"]').should('contain', '2');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy="task-count"]').should('contain', '1');
  });

  // ────────────────────────────────────────────────
  // Filtros
  // ────────────────────────────────────────────────
  it('aba Ativas exibe apenas tarefas não concluídas', () => {
    cy.addTaskViaAPI('Ativa');
    cy.addTaskViaAPI('Vai ser concluída');
    cy.visit('/');
    cy.get('[data-cy^="task-check-"]').last().click();
    cy.get('[data-cy="filter-active"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Ativa');
    cy.get('[data-cy="task-list"]').should('not.contain', 'Vai ser concluída');
  });

  it('aba Concluídas exibe apenas tarefas concluídas', () => {
    cy.addTaskViaAPI('Ativa');
    cy.addTaskViaAPI('Concluída');
    cy.visit('/');
    cy.get('[data-cy^="task-check-"]').last().click();
    cy.get('[data-cy="filter-completed"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Concluída');
    cy.get('[data-cy="task-list"]').should('not.contain', 'Ativa');
  });

  it('aba Todas exibe todas as tarefas', () => {
    cy.addTaskViaAPI('X');
    cy.addTaskViaAPI('Y');
    cy.visit('/');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy="filter-all"]').click();
    cy.get('[data-cy="task-item"]').should('have.length', 2);
  });

  it('aba ativa fica destacada ao ser selecionada', () => {
    cy.get('[data-cy="filter-active"]').click();
    cy.get('[data-cy="filter-active"]').should('have.class', 'active');
    cy.get('[data-cy="filter-all"]').should('not.have.class', 'active');
  });

  // ────────────────────────────────────────────────
  // Limpar concluídas
  // ────────────────────────────────────────────────
  it('botão "Limpar concluídas" remove apenas tarefas concluídas', () => {
    cy.addTaskViaAPI('Manter');
    cy.addTaskViaAPI('Remover');
    cy.visit('/');
    cy.get('[data-cy^="task-check-"]').last().click();
    cy.get('[data-cy="clear-btn"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Manter');
    cy.get('[data-cy="task-list"]').should('not.contain', 'Remover');
  });
});
