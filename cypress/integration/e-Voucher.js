/// <reference types="Cypress" />

/* eslint-disable cypress/no-force */
/* eslint-disable cypress/no-unnecessary-waiting */

var timeout = { timeout: 60000 };

describe('E-VOUCHER', () => {

  beforeEach(() => {
    cy.mockEvoucher();
    cy.login();
  });

  it('Egift delivery only', () => {
    cy.server();
    cy.fixture('/evoucher/detail-delivery').as('delivery');
    cy.route({
      method: 'POST',
      url: '/api/vouchers/detail',
      status: 200,
      response: '@delivery',
    }).as('[POST]detail');

    cy.get(':nth-child(2) > .voucher > .voucher__body', timeout).click();
    cy.contains('e-Voucher Code', timeout).should('be.visible');
    cy.contains('USE NOW').click();
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });
    cy.wait(3000);
    cy.get('button[class="c:p"]').click();
    cy.wait(3000);
  });

  it('Egift instore only', () => {
    cy.server();
    cy.fixture('/evoucher/detail-discount').as('discount');
    cy.route({
      method: 'POST',
      url: '/api/vouchers/detail',
      status: 200,
      response: '@discount',
    }).as('[POST]discount');

    cy.get(':nth-child(3) > .voucher > .voucher__body', timeout).click();
    cy.contains('e-Voucher Code', timeout).should('be.visible');
    cy.contains('USE NOW').click();
    cy.contains('Let the cashier scan your QR Code', timeout).should('be.visible');
  });

  it('Egift delivery & instsore', () => {
    cy.server();
    cy.fixture('/evoucher/detail-regis').as('regis');
    cy.route({
      method: 'POST',
      url: '/api/vouchers/detail',
      status: 200,
      response: '@regis',
    }).as('[POST]regis');

    cy.fixture('/evoucher/fail-redeem').as('fail-redeem');
    cy.route({
      method: 'POST',
      url: '/api/vouchers/redeem',
      status: 422,
      response: '@fail-redeem',
    }).as('[POST]fail-redeem');

    cy.get(':nth-child(4) > .voucher > .voucher__body', timeout).click();
    cy.contains('e-Voucher Code', timeout).should('be.visible');
    cy.contains('USE NOW').click();
    cy.contains('Delivery', timeout).click();
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });
    cy.contains('In-Store').click();
    cy.get('div[class="qrcode qrcode--size-medium"]', timeout).should('be.visible');
    cy.contains('REDEEM NOW', timeout).click();
    cy.contains('"cashierCode" is required', timeout).should('be.visible');
    cy.wait(1000);
    cy.go('back');
    cy.wait(1000);
  });
});
