describe('Authentication Flow', () => {
  it('should show login form', () => {
    cy.visit('/auth/login');
    cy.get('input[placeholder="Usuario"]').should('be.visible');
    cy.get('input[placeholder="Contraseña"]').should('be.visible');
    cy.get('button[type="submit"]').contains(/Iniciar sesión/i).should('be.visible');
  });
});
