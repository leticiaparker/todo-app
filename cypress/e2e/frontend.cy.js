describe('Frontend — Lista de Tarefas', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('exibe o titulo Lista de Tarefas', () => {
    cy.get('[data-cy="app-title"]').should('contain', 'Lista de Tarefas');
  });

  it('exibe o subtitulo correto', () => {
    cy.get('[data-cy="app-subtitle"]').should('contain', 'Organize seu dia com');
  });

  it('exibe campo de entrada e botao adicionar', () => {
    cy.get('[data-cy="task-input"]').should('be.visible');
    cy.get('[data-cy="add-btn"]').should('be.visible');
  });

  it('exibe as abas de filtro', () => {
    cy.get('[data-cy="filter-all"]').should('be.visible');
    cy.get('[data-cy="filter-active"]').should('be.visible');
    cy.get('[data-cy="filter-completed"]').should('be.visible');
  });

  it('adiciona tarefa ao clicar no botao', () => {
    cy.get('[data-cy="task-input"]').type('Comprar pao');
    cy.get('[data-cy="add-btn"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Comprar pao');
  });

  it('adiciona tarefa ao pressionar Enter', () => {
    cy.get('[data-cy="task-input"]').type('Estudar Cypress{enter}');
    cy.get('[data-cy="task-list"]').should('contain', 'Estudar Cypress');
  });

  it('limpa o campo apos adicionar tarefa', () => {
    cy.get('[data-cy="task-input"]').type('Teste{enter}');
    cy.get('[data-cy="task-input"]').should('have.value', '');
  });

  it('nao adiciona tarefa com titulo vazio', () => {
    cy.get('[data-cy="add-btn"]').click();
    cy.get('[data-cy="task-item"]').should('have.length', 0);
  });

  it('atualiza contador ao adicionar tarefas', () => {
    cy.get('[data-cy="task-input"]').type('Tarefa 1{enter}');
    cy.get('[data-cy="task-count"]').should('contain', '1');
    cy.get('[data-cy="task-input"]').type('Tarefa 2{enter}');
    cy.get('[data-cy="task-count"]').should('contain', '2');
  });

  it('exibe icone de lixeira em cada tarefa', () => {
    cy.get('[data-cy="task-input"]').type('Tarefa{enter}');
    cy.get('[data-cy^="delete-btn-"]').should('be.visible');
  });

  it('abre modal ao clicar na lixeira', () => {
    cy.get('[data-cy="task-input"]').type('Deletar{enter}');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="confirm-modal"]').should('be.visible');
  });

  it('cancela exclusao pelo modal', () => {
    cy.get('[data-cy="task-input"]').type('Manter{enter}');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="modal-cancel"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Manter');
  });

  it('confirma exclusao pelo modal', () => {
    cy.get('[data-cy="task-input"]').type('Remover{enter}');
    cy.get('[data-cy^="delete-btn-"]').first().click();
    cy.get('[data-cy="modal-confirm"]').click();
    cy.get('[data-cy="task-list"]').should('not.contain', 'Remover');
  });

  it('marca tarefa como concluida', () => {
    cy.get('[data-cy="task-input"]').type('Concluir{enter}');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy^="task-check-"]').first().should('have.class', 'done');
  });

  it('aplica risco no titulo da tarefa concluida', () => {
    cy.get('[data-cy="task-input"]').type('Risco{enter}');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy^="task-title-"]').first().should('have.class', 'done');
  });

  it('exibe horario de conclusao', () => {
    cy.get('[data-cy="task-input"]').type('Horario{enter}');
    cy.get('[data-cy^="task-check-"]').first().click();
    cy.get('[data-cy^="task-completed-at-"]').first().should('be.visible');
  });

  it('filtra tarefas ativas', () => {
    cy.get('[data-cy="task-input"]').type('Ativa{enter}');
    cy.get('[data-cy="task-input"]').type('Concluida{enter}');
    cy.get('[data-cy^="task-check-"]').last().click();
    cy.get('[data-cy="filter-active"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Ativa');
    cy.get('[data-cy="task-list"]').should('not.contain', 'Concluida');
  });

  it('filtra tarefas concluidas', () => {
    cy.get('[data-cy="task-input"]').type('Ativa{enter}');
    cy.get('[data-cy="task-input"]').type('Concluida{enter}');
    cy.get('[data-cy^="task-check-"]').last().click();
    cy.get('[data-cy="filter-completed"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Concluida');
    cy.get('[data-cy="task-list"]').should('not.contain', 'Ativa');
  });

  it('limpa tarefas concluidas', () => {
    cy.get('[data-cy="task-input"]').type('Manter{enter}');
    cy.get('[data-cy="task-input"]').type('Remover{enter}');
    cy.get('[data-cy^="task-check-"]').last().click();
    cy.get('[data-cy="clear-btn"]').click();
    cy.get('[data-cy="task-list"]').should('contain', 'Manter');
    cy.get('[data-cy="task-list"]').should('not.contain', 'Remover');
  });
});