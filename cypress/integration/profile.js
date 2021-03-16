/* eslint-disable cypress/no-force */
/* eslint-disable cypress/no-unnecessary-waiting */

describe('PROFILE', () => {
  before(() => {
    cy.defineStub();
    cy.login();
    cy.checkElement_cardList();
    cy.get('div[class="navbar__menu__icon"]').eq(0).click({ force: true });
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });
    cy.get('input[disabled="disabled"]', { timeout: 60000 });
  });

  it('Edit Profile', () => {
    // Success edit
    cy.get('input[name="name"]').clear().type('Aziz');
    cy.get('input[name="email"]').clear().type('otoshop@mailinator.com');
    cy.contains('SAVE').click();
    cy.contains('Your profile successfully updated', { timeout: 60000 });

    // Failed edit
    cy.fixture('/profile/invalid').as('invProfile');
    cy.route({
      method: 'PUT',
      url: '/api/account/profile',
      status: 400,
      response: '@invProfile',
    }).as('pInvProfile');
    cy.get('input[name="email"]').clear().type('zizcode.exporadev@gmail.com');
    cy.contains('SAVE').click();
    cy.contains('email is already in used', { timeout: 60000 });
  });
});
