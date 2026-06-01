// cypress/support/e2e.js
// Comandos customizados e configurações globais

Cypress.Commands.add('resetTasks', () => {
  cy.request('POST', 'http://localhost:3001/api/reset');
});

Cypress.Commands.add('addTaskViaAPI', (title) => {
  cy.request('POST', 'http://localhost:3001/api/tasks', { title })
    .its('body')
    .should('have.property', 'id');
}); 
