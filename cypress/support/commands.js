/// <reference types="Cypress" />
/* eslint-disable cypress/no-force */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable cypress/no-unnecessary-waiting */

var timeout = { timeout: 60000 }

Cypress.Commands.add('login', (numb) => {
	let number;
	let random;
	let num = 1;
	cy.server();
	if (numb === 'random') {
		random = Math.floor(100000 + Math.random() * 1000000000);
		number = `81${random}`;
		cy.fixture('/auth/verify-otp-register').as('dataOtp');
		cy.route({
			method: 'POST',
			url: '/api/auth/verify-otp',
			status: 200,
			response: '@dataOtp',
		}).as('[POST]Otp');
	} else {
		number = '81222333444';
		cy.fixture('/auth/verify-otp').as('dataOtp');
		cy.route({
			method: 'POST',
			url: '/api/auth/verify-otp',
			status: 200,
			response: '@dataOtp',
		}).as('postOtp');
	}

	cy.server();
	cy.fixture('/auth/check-number').as('dataNumber');
	cy.route({
		method: 'POST',
		url: '/api/auth/check-number',
		status: 200,
		response: '@dataNumber',
	}).as('postNumber');

	cy.visit('/');
	cy.get('.banner-landing-content--center > :nth-child(2) > form > :nth-child(1) > .form-group > .form-input-group > .form-control', timeout).type(number);
	cy.get('button').contains('BECOME A MEMBER').click({ force: true });
	for (let index = 1; index <= 6; index++) {
		cy.get(`.otp-input > :nth-child(${index})`, { timeout: 60000 }).type(`${num++}`);
	}
});

Cypress.Commands.add('btnDetail', () => {
	cy.get(':nth-child(1) > .card-list > .card-wrapper', timeout).click({ force: true });
});

Cypress.Commands.add('defineStub', () => {
	cy.server();

	cy.fixture('/inbox/count').as('dataInbox');
	cy.route({
		method: 'POST',
		url: '/api/inbox/totalUnread',
		status: 200,
		response: '@dataInbox',
	}).as('postInbox');
});

Cypress.Commands.add('checkElement_cardList', () => {

	// Account
	cy.get('a[href="/account"', timeout).should('be.visible');

	// Inbox
	cy.get('div[class="navbar__menu__icon"', timeout).eq(1).should('be.visible');

	// 3 dot
	cy.get('li[class="navbar-dropdown"]', timeout).should('be.visible');

	// Title
	cy.get('div[class="navbar__title"]', timeout).should('be.visible');

	// Card option
	cy.get('div[class="card-options"]', timeout).should('be.visible');

});

Cypress.Commands.add('checkElement_cardDetail', () => {

	// QRCode
	cy.get('li[class="m_r:20"]', timeout).should('be.visible');

	// Inbox
	cy.get('div[class="navbar__menu__icon"', timeout).eq(0).should('be.visible');

	// 3 dot
	cy.get('li[class="navbar-dropdown m_r:10"]', timeout).should('be.visible');

	// Icon Card
	cy.get('div[class="h:30 grid-col-6"]', timeout).should('not.be.visible');

	// Banner vf
	cy.get('div[class="banner banner-vf"]', timeout).should('be.visible');

	// Banner reffer
	cy.get('div[class="banner banner-refer"]', timeout).should('be.visible');

	// Menu
	cy.get('div[class="grid-row"]', timeout).should('be.visible');

	cy.wait(3000);
});

Cypress.Commands.add('checkElement_shop', () => {

	// Back
	cy.get('button[class="c:p"', timeout).should('be.visible');

	// Search
	cy.get('input[name="inputSearch"', timeout).should('be.visible');

	// Icon Cart
	cy.get('img[class="m_r:10"]', timeout).should('be.visible');

	// Icon Filter
	cy.get('div[class="p:r m_r:15"]', timeout).should('be.visible');

	// Catalog
	cy.get('div[class="image-list catalog"]', timeout).should('be.visible');

	// Buy
	cy.contains('BUY', timeout).should('be.visible');

});

Cypress.Commands.add('checkElement_referral', () => {

	// Back
	cy.get('button[class="c:p"', timeout).should('be.visible');

	// How it works
	cy.contains('How It Works?', timeout).should('be.visible');

	// Navbar title
	cy.get('div[class="navbar__page-title"]', timeout).contains('Get 50.000 Points by Referring Your Friends');

	// Icon Filter
	cy.get('div[class="p:r"]', timeout).should('be.visible');

	// See details
	cy.contains('See Details').should('be.visible');

	// Icon Whatsapp
	cy.get('img[alt="Whatsapp Share"]', timeout).should('be.visible');

	// Icon Facebook
	cy.get('img[alt="Facebook Share"]', timeout).should('be.visible');

	// Icon Line
	cy.get('img[alt="Line Share"]', timeout).should('be.visible');

	// Code Country
	cy.contains('+62', timeout).should('be.visible');

	// Input number
	cy.get('input[input-mode="numeric"]');

	// Icon send
	cy.get('i[class="tada-wallet-icons ic-right-send"]', timeout).should('be.visible');

	// Show More
	cy.contains('SHOW MORE', timeout).should('be.visible');

	// Row summary
	cy.get('div[class="grid-row"]', timeout).should('be.visible');

});