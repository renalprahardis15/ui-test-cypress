/// <reference types="Cypress" />
/* eslint-disable cypress/no-unnecessary-waiting */

var timeout = { timeout: 60000 }

describe('Delivery Order', () => {
  before(() => {
    cy.defineStub();
    cy.login();
    cy.checkElement_cardList();
    cy.btnDetail();
  });

  beforeEach(() => {
    cy.defineStub();
  });

  it('Internal Website', () => {
    cy.log('Check tab on History');
    cy.get('i[class="tada-wallet-icons ic-more-menu"]', timeout).click();
    cy.get('i[class="tada-wallet-icons ic-history"]', timeout).eq(1).click();
    cy.contains('Delivery Order', timeout).click();

    cy.wait(5000);
    cy.get('div[class="navbar-action c:p"]', timeout).click();
    cy.wait(2000);

    cy.get('i[class="tada-wallet-icons ic-delivery-order"]', timeout).eq(0).click();
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });
  });

  it('External Website', () => {
    cy.fixture('/cards/detail-DO-external').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.wait(3000);
    cy.get('div[class="navbar-action c:p"]', timeout).click();
    cy.wait(['@pCards', '@postInbox'], timeout);
    cy.btnDetail();

    cy.log('Check tab on History');
    cy.get('i[class="tada-wallet-icons ic-more-menu"]', timeout).click({ force: true });
    cy.get('i[class="tada-wallet-icons ic-history"]', timeout).eq(1).click({ force: true });
    cy.contains('Delivery Order', timeout).should('not.be.visible');

    cy.get('i[class="tada-wallet-icons ic-order-external"]', timeout).eq(0).click({ force: true });
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });
  });

  it('External Website with invalid link', () => {
    cy.fixture('/cards/detail-DO-external-invalid').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.wait(3000);
    cy.get('div[class="navbar-action c:p"]', timeout).click();
    cy.wait(3000);

    cy.log('Check tab on History');
    cy.get('i[class="tada-wallet-icons ic-more-menu"]', timeout).click({ force: true });
    cy.get('i[class="tada-wallet-icons ic-history"]', timeout).eq(1).click({ force: true });
    cy.contains('Delivery Order', timeout).should('not.be.visible');

    cy.get('i[class="tada-wallet-icons ic-order-external"]', timeout).eq(0).click({ force: true });
    cy.contains('URL is not valid protocol.');
    cy.wait(3000);
  });

  it('Not Show DO Button', () => {
    cy.fixture('/cards/detail-DO-notShow').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.wait(3000);
    cy.get('div[class="navbar-action c:p"]', timeout).click();
    cy.wait(3000);

    cy.log('Check tab on History');
    cy.get('i[class="tada-wallet-icons ic-more-menu"]', timeout).click({ force: true });
    cy.get('i[class="tada-wallet-icons ic-history"]', timeout).eq(1).click();
    cy.contains('Delivery Order', timeout).should('not.be.visible');

    cy.wait(5000);
    cy.get('div[class="navbar-action c:p"]', timeout).click();
    cy.wait(2000);

    cy.get('i[class="tada-wallet-icons ic-delivery-order"]', timeout).should('not.be.visible');
  });
});
