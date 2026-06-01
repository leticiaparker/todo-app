describe('Frontend — Lista de Tarefas', () => {
  beforeEach(() => {
    cy.visit('frontend/index.html');
  });

  it('exibe o título "Lista de Tarefas"', () => {
    cy.get('[data-cy="app-title"]').should('contain', 'Lista de Tarefas');
  });

  it('exibe o subtítulo correto', () => {
    cy.get('[data-cy="app-subtitle"]').should('contain', 'Organize seu dia com eficiência');
  });

  it('exibe campo de entrada e botão adicionar', () => {
    cy.get('[data-cy="task-input"]').should('be.visible');
    cy.get('[data-cy="add-btn"]').should('be.visible');
  });

  it('exibe as abas Todas, Ativas e Concluídas', () => {
    cy.get('[data-cy="filter-all"]').should('contain', 'Todas');
    cy.get('[data-cy="filter-active"]').should('contain', 'Ativas');
    cy.get('[data-cy="filter-completed"]').should('contain', 'Concluídas');
  });

  it('adiciona tarefa ao clicar no botão', () => {
    cy.get('[data-cy="task-input"]').type('Comprar pão');
    cy.get('[data-cy="add-btn"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Comprar pão');
  });

  it('adiciona tarefa ao pressionar Enter', () => {
    cy.get('[data-cy="task-input"]').type('Estudar Cypress{enter}');
    cy.get('[data-cy="task-list"]').should('contain', 'Estudar Cypress');
  });

  it('limpa o campo após adicionar tarefa', () => {
    cy.get('[data-cy="task-input"]').type('Teste{enter}');
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

  it('exibe ícone de lixeira em cada tarefa', () => {
    cy.get('[data-cy="task-input"]').type('Tarefa{enter}');
    cy.get('[data-cy^="delete-btn-"]').should('be.visible');
  });

  it('abre modal de confirmação ao clicar na lixeira', () => {
    cy.get('[data-cy="task-input"]').type('Deletar{enter}');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="confirm-modal"]').should('be.visible');
  });

  it('cancela exclusão ao clicar em Cancelar', () => {
    cy.get('[data-cy="task-input"]').type('Manter{enter}');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="modal-cancel"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Manter');
  });

  it('confirma exclusão ao clicar em Excluir', () => {
    cy.get('[data-cy="task-input"]').type('Remover{enter}');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="modal-confirm"]').click();
    cy.get('[data-cy="task-list"]').should('not.contain', 'Remover');
  });

  it('marca tarefa como concluída', () => {
    cy.get('[data-cy="task-input"]').type('Concluir{enter}');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy^="task-check-"]').first().should('have.class', 'done');
  });

  it('aplica risco no título da tarefa concluída', () => {
    cy.get('[data-cy="task-input"]').type('Risco{enter}');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy^="task-title-"]').first().should('have.class', 'done');
  });

  it('exibe horário de conclusão', () => {
    cy.get('[data-cy="task-input"]').type('Horário{enter}');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy^="task-completed-at-"]').first().should('be.visible');
  });

  it('filtra tarefas ativas', () => {
    cy.get('[data-cy="task-input"]').type('Ativa{enter}');
    cy.get('[data-cy="task-input"]').type('Concluída{enter}');
    cy.get('[data-cy^="task-check-"]').last().click();
    cy.get('[data-cy="filter-active"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Ativa');
    cy.get('[data-cy="task-list"]').should('not.contain', 'Concluída');
  });

  it('filtra tarefas concluídas', () => {
    cy.get('[data-cy="task-input"]').type('Ativa{enter}');
    cy.get('[data-cy="task-input"]').type('Concluída{enter}');
    cy.get('[data-cy^="task-check-"]').last().click();
    cy.get('[data-cy="filter-completed"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Concluída');
    cy.get('[data-cy="task-list"]').should('not.contain', 'Ativa');
  });

  it('limpa tarefas concluídas', () => {
    cy.get('[data-cy="task-input"]').type('Manter{enter}');
    cy.get('[data-cy="task-input"]').type('Remover{enter}');
    cy.get('[data-cy^="task-check-"]').last().click();
    cy.get('[data-cy="clear-btn"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Manter');
    cy.get('[data-cy="task-list"]').should('not.contain', 'Remover');
  });
});