/// <reference types="Cypress" />
/* eslint-disable cypress/no-force */
/* eslint-disable cypress/no-unnecessary-waiting */

global.setNumb = 'random';
var timeout = { timeout: 60000 };
describe('REGISTER', () => {
  beforeEach(() => {
    cy.server();
    cy.fixture('/auth/verify-otp-register').as('dataOtp');
    cy.route({
      method: 'POST',
      url: '/api/auth/verify-otp',
      status: 200,
      response: '@dataOtp',
    }).as('[POST]Otp');

    cy.fixture('/inbox/registered').as('dataInbox');
    cy.route({
      method: 'POST',
      url: '/api/inbox/totalUnread',
      status: 200,
      response: '@dataInbox',
    }).as('postInbox');

    cy.fixture('/cards/list_registered').as('dataCards');
    cy.route({
      method: 'POST',
      url: '/api/cards',
      status: 200,
      response: '@dataCards',
    }).as('postCards');

    cy.fixture('/cards/detail_registered').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.fixture('settings/terms').as('terms');
    cy.route({
      method: 'POST',
      url: '/api/settings/terms',
      status: 200,
      response: '@terms',
    }).as('[POST]terms');

    cy.fixture('shippings/cities').as('cities');
    cy.route({
      method: 'POST',
      url: '/api/shippings/cities',
      status: 200,
      response: '@cities',
    }).as('[POST]cities');

    cy.fixture('perks/list').as('perks');
    cy.route({
      method: 'POST',
      url: '/api/perks',
      status: 200,
      response: '@perks',
    }).as('pPerks');

    cy.fixture('my_vouchers/my-voucher').as('vouchers');
    cy.route({
      method: 'POST',
      url: '/api/my_vouchers',
      status: 200,
      response: '@vouchers',
    }).as('pVouchers');

    cy.fixture('administrative/countries').as('countries');
    cy.route({
      method: 'GET',
      url: '/api/administrative/countries',
      status: 200,
      response: '@countries',
    }).as('pCountries');

    cy.fixture('administrative/city').as('city');
    cy.route({
      method: 'GET',
      url: '/api/administrative/cities?id=1',
      status: 200,
      response: '@city',
    }).as('pCity');

    cy.fixture('administrative/Indonesia').as('countries');
    cy.route({
      method: 'GET',
      url: '/api/administrative/cities/Indonesia',
      status: 200,
      response: '@countries',
    }).as('pCountries');

    cy.fixture('catalogs/detail-by-card').as('detailbyCard');
    cy.route({
      method: 'POST',
      url: '/api/catalogs/detail-by-card',
      status: 200,
      response: '@detailbyCard',
    }).as('pdetailbyCard');

    cy.fixture('ambassador/list').as('amabassador');
    cy.route({
      method: 'POST',
      url: '/api/ambassadors',
      status: 200,
      response: '@amabassador',
    }).as('pAmabassador');

    cy.fixture('perks/detail_refer').as('detail_refer');
    cy.route({
      method: 'POST',
      url: '/api/perks/detail',
      status: 200,
      response: '@detail_refer',
    }).as('pDetail_refer');

    cy.fixture('stores/stores').as('stores');
    cy.route({
      method: 'POST',
      url: '/api/cards/stores',
      status: 200,
      response: '@stores',
    }).as('pStores');

    cy.fixture('/profile/success').as('profile');
    cy.route({
      method: 'GET',
      url: '/api/account/profile',
      status: 200,
      response: '@profile',
    }).as('postProfile');

    cy.fixture('/profile/success').as('profile');
    cy.route({
      method: 'PUT',
      url: '/api/account/profile',
      status: 200,
      response: '@profile',
    }).as('postProfile');

    cy.fixture('catalogs/catalogs-regis').as('catalogs');
    cy.route({
      method: 'POST',
      url: '/api/catalogs',
      status: 200,
      response: '@catalogs',
    }).as('pCatalogs-regis');
  });

  it('Check Invalid Country Code', () => {
    cy.server();
    cy.fixture('/auth/check-number-invalid').as('dataNumber');
    cy.route({
      method: 'POST',
      url: '/api/auth/check-number',
      status: 400,
      response: '@dataNumber',
    }).as('postNumber');

    cy.visit('/');
    cy.contains('+62', timeout).click();
    cy.get('input[placeholder="Search Region"]', timeout).eq(0).type('Singapore');
    cy.get('div[class="d-flex"]', timeout).contains('Singapore (SG)').click();
    cy.get('.banner-landing-content--center > :nth-child(2) > form > :nth-child(1) > .form-group > .form-input-group > .form-control', timeout).type('81222333444');
    cy.get('button').contains('BECOME A MEMBER').click({ force: true });
    cy.contains('invalid phone number format', timeout).should('be.visible');
  });

  it('Success register', () => {
    cy.login(setNumb);
    cy.get('div[class="navbar__page-title"]', timeout).should('have.text', 'Marugame Udon membership');
    cy.get('input[name="Name"]', timeout).should('be.visible').type('Anonymous');
    cy.get('input[name="Email"]').should('be.visible').type('test@mailinator.com');
    cy.get('input[name="date"]').should('be.visible').type('12');
    cy.get('input[name="month"]').should('be.visible').type('05');
    cy.get('input[name="year"]').should('be.visible').type('1995');
    cy.contains('Male').click();

    //Search City
    cy.get('input[name="city"]').should('be.visible').click();
    cy.get('.modal-search__list > :nth-child(1)', timeout).click();

    cy.get('div[class="md-radio-container"]').eq(2).click();

    cy.fixture('register/register').as('register');
    cy.route({
      method: 'POST',
      url: '/api/cards/register',
      status: 200,
      response: '@register',
    }).as('pRegister');

    cy.contains('Please input the correct Email', timeout).should('not.be.visible');
    cy.contains('Please fill the Name.', timeout).should('not.be.visible');

    // Check T&C

    cy.contains('Terms & Condition', timeout).should('be.visible').click();
    cy.contains('Privacy Policy', timeout).should('be.visible').click();

    cy.contains('Register').click();
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });
  });

  it('Not complete fill all required fields', () => {
    cy.fixture('register/register').as('register');
    cy.route({
      method: 'POST',
      url: '/api/cards/register',
      status: 200,
      response: '@register',
    }).as('pRegister');

    cy.login(setNumb);
    cy.get('div[class="navbar__page-title"]', timeout).should('have.text', 'Marugame Udon membership');
    cy.get('input[name="Name"]', timeout).should('be.visible').type('Anonymous');

    cy.contains('Register').click();
    cy.contains('Please fill all required fields', timeout).should('be.visible');

    cy.get('input[name="Email"]').should('be.visible').type('test@mailinator.com');
    cy.get('input[name="date"]').should('be.visible').type('12');
    cy.get('input[name="month"]').should('be.visible').type('05');
    cy.get('input[name="year"]').should('be.visible').type('1995');
    cy.contains('Male').click();

    //Search City
    cy.get('input[name="city"]').should('be.visible').click();
    cy.get('.modal-search__list > :nth-child(1)', timeout).click();

    cy.get('div[class="md-radio-container"]').eq(2).click();

    //Validation
    cy.contains('Please fill the name.').should('not.be.visible');
    cy.contains('Please fill the birthday.').should('not.be.visible');
    cy.contains('Please fill the sex.').should('not.be.visible');
    cy.contains('Please fill the city.').should('not.be.visible');
    cy.contains('Please fill the Apa anda pernah ke sini?.').should('not.be.visible');
    cy.contains('Please fill the apakah anda pernah berenang?.').should('not.be.visible');
    cy.contains('Please fill the have you ever drink?.').should('not.be.visible');
    cy.contains('Please fill the have you hahaha.').should('not.be.visible');
    cy.contains('Please fill the apakah anda manusia?.').should('not.be.visible');

    cy.contains('Register').click();
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });

  });

  it('Enable customer to upload image', () => {
    cy.server();
    cy.fixture('/cards/detail_upload').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.fixture('register/register').as('register');
    cy.route({
      method: 'POST',
      url: '/api/cards/register',
      status: 200,
      response: '@register',
    }).as('pRegister');

    cy.fixture('/inbox/list').as('list');
    cy.route({
      method: 'POST',
      url: '/api/inbox/list',
      status: 200,
      response: '@list',
    }).as('postList');

    cy.login(setNumb);

    cy.get('input[name="Name"]', timeout).should('be.visible').type('Anonymous');
    cy.get('input[name="Email"]').should('be.visible').type('test@mailinator.com');
    cy.get('input[name="date"]').should('be.visible').type('12');
    cy.get('input[name="month"]').should('be.visible').type('05');
    cy.get('input[name="year"]').should('be.visible').type('1995');
    cy.contains('Male').click();

    //Search City
    cy.get('input[name="city"]').should('be.visible').click();
    cy.get('.modal-search__list > :nth-child(1)', timeout).click();
    cy.get('div[class="md-radio-container"]').eq(2).click();

    cy.log('Check with null image');
    cy.contains('Register', timeout).click();
    cy.contains('Please fill upload image', timeout).should('be.visible');
    cy.contains('Please fill all required fields', timeout).should('be.visible');

    cy.get('div[class="upload-capture__fit"]').click({ force: true });
    cy.contains('Open Gallery', timeout).click();
    cy.get('div[class="upload-capture__fit"]').click({ force: true });
    cy.contains('Take a Photo').click();
    cy.wait(5000);
    cy.get('video[autoplay="autoplay"]', timeout).click();
    cy.wait(2000);
    cy.contains('Register', timeout).click();
    cy.get('.navbar-dropdown > .navbar__menu__icon > img', timeout).click();
    cy.contains('Change Language', timeout).click();
    cy.contains('Bahasa Indonesia', timeout).click();
    cy.contains('Voucher Saya', timeout).should('be.visible');

    cy.get('.navbar-dropdown > .navbar__menu__icon > img', timeout).click();
    cy.contains('Ubah Bahasa', timeout).click();
    cy.contains('English', timeout).click();

    cy.contains('My Voucher', timeout).should('be.visible');
    cy.get('div[class="h:40 grid-col-6"]', timeout).should('be.visible');

    cy.log('Check redirect');
    cy.defineStub();
    cy.server();
    cy.fixture('catalogs/detail').as('detail');
    cy.route({
      method: 'POST',
      url: '/api/catalogs/detail',
      status: 200,
      response: '@detail',
    }).as('pDetail');
    cy.get('li[class="m_r:20"]', timeout).click();
    cy.get('button[class="font-size--24 f_w:b f_c:white"]').eq(0).click();
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
    cy.get('.navbar-dropdown > .navbar__menu__icon > img', timeout).click();
    cy.contains('Profile').click();
    cy.wait(2000);
    cy.get('button[class="c:p"]', timeout).click({ force: true });
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
    cy.contains('Learn More', timeout).click();
    cy.wait(2000);
    cy.get('button[class="c:p"]', timeout).click({ force: true });
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
    cy.get('i[class="tada-wallet-icons ic-redeem-item"]', timeout).click();
    cy.wait(7000);
    cy.get('button[class="c:p"]', timeout).click({ force: true });
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
    cy.get('i[class="tada-wallet-icons ic-official-store"]', timeout).click();
    cy.wait(7000);
    cy.get('button[class="c:p"]', timeout).click({ force: true });
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
    cy.contains('Sell Now', timeout).click();
    cy.wait(2000);
    cy.get('button[class="c:p"]', timeout).click({ force: true });
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
    cy.get('i[class="tada-wallet-icons ic-more-menu"]', timeout).click();
    cy.get('i[class="tada-wallet-icons ic-privilege"]', timeout).eq(1).click();
    cy.wait(5000);
    cy.go('back');
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
    cy.get('i[class="tada-wallet-icons ic-more-menu"]', timeout).click();
    cy.get('i[class="tada-wallet-icons ic-history"]', timeout).eq(1).click();
    cy.wait(2000);
    cy.get('div[class="navbar-action c:p"]', timeout).click();
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
    cy.get('i[class="tada-wallet-icons ic-more-menu"]', timeout).click();
    cy.get('i[class="tada-wallet-icons ic-referral"]', timeout).eq(1).click();
    cy.wait(5000);
    cy.get('div[class="navbar-action c:p back-details"]', timeout).click();
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
    cy.scrollTo('bottom', { duration: 3000 });
    cy.contains('20 Stores', timeout).click();
    cy.wait(2000);
    cy.get('button[class="c:p"]', timeout).click();
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
  });

  it('No required data', () => {
    cy.fixture('/cards/regist-noRequired').as('dataCards');
    cy.route({
      method: 'POST',
      url: '/api/cards',
      status: 200,
      response: '@dataCards',
    }).as('postCards');

    cy.fixture('/cards/detail_noRequired').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.fixture('register/register-noRequired').as('register');
    cy.route({
      method: 'POST',
      url: '/api/cards/register',
      status: 200,
      response: '@register',
    }).as('pRegister');

    cy.login(setNumb);
    cy.get('input[name="Name"]', timeout).should('not.be.visible');
    cy.contains('Register', timeout).click();
    cy.wait(['@pCardDetail', '@postInbox', '@pStores', '@postInbox'], timeout);
    cy.checkElement_cardDetail();
  });

  it('New Registration Field for Existing Member > 1 cards', () => {
    cy.defineStub();
    cy.fixture('/cards/detail-updateCustomerRequired').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.fixture('register/register').as('register');
    cy.route({
      method: 'POST',
      url: '/api/cards/register',
      status: 200,
      response: '@register',
    }).as('pRegister');

    cy.login();
    cy.checkElement_cardList();
    cy.btnDetail();

    cy.get('div[class="navbar__page-title"]', timeout).should('have.text', 'Marugame Udon membership');

    cy.contains('UPDATE', timeout).click();

    //Validation
    cy.contains('Please fill all required fields', timeout).should('be.visible');
    cy.contains('Please fill the name.', timeout).should('not.be.visible');
    cy.contains('Please input the correct Email', timeout).should('not.be.visible');
    cy.contains('Please fill the birthday.', timeout).should('not.be.visible');
    cy.contains('Please fill the sex.', timeout).should('not.be.visible');
    cy.contains('Please fill the NPWP.', timeout).should('be.visible');
    cy.contains('Please fill the test exisiting member.', timeout).should('be.visible');

    //Search City
    cy.get('input[name="city"]', timeout).should('be.visible').click();
    cy.get('.modal-search__list > :nth-child(1)', timeout).click();

    cy.get('div[class="md-radio-container"]').eq(2).click();

    cy.get('input[name="NPWP"]').should('be.visible').type('12345345345');
    cy.get('input[name="test exisiting member"]').should('be.visible').type('Testing');
    cy.get('div[class="upload-capture__fit"]').click({ force: true });
    cy.contains('Open Gallery', timeout).click();
    cy.get('div[class="upload-capture__fit"]').click({ force: true });
    cy.contains('Take a Photo').click();
    cy.wait(5000);
    cy.get('video[autoplay="autoplay"]', timeout).click();
    cy.wait(2000);

    //Validation
    cy.contains('Please fill the NPWP.').should('not.be.visible');
    cy.contains('Please fill the test exisiting member.').should('not.be.visible');

    cy.fixture('/cards/detail').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.contains('UPDATE').click();
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });

    cy.get('li[class="m_r:20"]', timeout).should('be.visible');
    cy.get('div[class="navbar__menu__icon"', timeout).eq(0).should('be.visible');
  });

  it('New Registration Field for Existing Member = 1 cards', () => {
    cy.defineStub();

    cy.fixture('/cards/1-card').as('dataCards');
    cy.route({
      method: 'POST',
      url: '/api/cards',
      status: 200,
      response: '@dataCards',
    }).as('pCards');

    cy.fixture('/cards/detail-updateCustomerRequired').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.fixture('register/register').as('register');
    cy.route({
      method: 'POST',
      url: '/api/cards/register',
      status: 200,
      response: '@register',
    }).as('pRegister');

    cy.login();
    cy.contains('UPDATE', timeout).click();

    //Validation
    cy.contains('Please fill all required fields', timeout).should('be.visible');
    cy.contains('Please fill the name.', timeout).should('not.be.visible');
    cy.contains('Please input the correct Email', timeout).should('not.be.visible');
    cy.contains('Please fill the birthday.', timeout).should('not.be.visible');
    cy.contains('Please fill the sex.', timeout).should('not.be.visible');
    cy.contains('Please fill the NPWP.', timeout).should('be.visible');
    cy.contains('Please fill the test exisiting member.', timeout).should('be.visible');

    //Search City
    cy.get('input[name="city"]', timeout).should('be.visible').click();
    cy.get('.modal-search__list > :nth-child(1)', timeout).click();

    cy.get('div[class="md-radio-container"]').eq(2).click();

    cy.get('input[name="NPWP"]').should('be.visible').type('12345345345');
    cy.get('input[name="test exisiting member"]').should('be.visible').type('Testing');
    cy.get('div[class="upload-capture__fit"]').click({ force: true });
    cy.contains('Open Gallery', timeout).click();
    cy.get('div[class="upload-capture__fit"]').click({ force: true });
    cy.contains('Take a Photo').click();
    cy.wait(5000);
    cy.get('video[autoplay="autoplay"]', timeout).click();
    cy.wait(2000);

    //Validation
    cy.contains('Please fill the NPWP.').should('not.be.visible');
    cy.contains('Please fill the test exisiting member.').should('not.be.visible');

    cy.fixture('/cards/detail').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.contains('UPDATE').click();
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });

    cy.get('li[class="m_r:20"]', timeout).should('be.visible');
    cy.get('div[class="navbar__menu__icon"', timeout).eq(0).should('be.visible');
  });

  it('Change email with google dots trick', () => {
    cy.login(setNumb);
    cy.get('div[class="navbar__page-title"]', timeout).should('have.text', 'Marugame Udon membership');
    cy.get('input[name="Name"]', timeout).should('be.visible').type('Anonymous');
    cy.get('input[name="Email"]').should('be.visible').type('testemail@gmail.com');
    cy.get('input[name="date"]').should('be.visible').type('12');
    cy.get('input[name="month"]').should('be.visible').type('05');
    cy.get('input[name="year"]').should('be.visible').type('1995');
    cy.contains('Male').click();

    //Search City
    cy.get('input[name="city"]').should('be.visible').click();
    cy.get('.modal-search__list > :nth-child(1)', timeout).click();

    cy.get('div[class="md-radio-container"]').eq(2).click();

    cy.fixture('register/register').as('register');
    cy.route({
      method: 'POST',
      url: '/api/cards/register',
      status: 200,
      response: '@register',
    }).as('pRegister');

    cy.contains('Please input the correct Email', timeout).should('not.be.visible');
    cy.contains('Please fill the Name.', timeout).should('not.be.visible');

    cy.fixture('register/register-CaseEmail').as('register');
    cy.route({
      method: 'POST',
      url: '/api/cards/register',
      status: 200,
      response: '@register',
    }).as('pRegister-email');

    cy.fixture('/cards/detail').as('cardDetail');
    cy.route({
      method: 'POST',
      url: '/api/cards/detail',
      status: 200,
      response: '@cardDetail',
    }).as('pCardDetail');

    cy.contains('Register').click();
    cy.server().should((server) => {
      expect(server.status).to.eq(200);
    });

    cy.fixture('/profile/caseEmail').as('profile');
    cy.route({
      method: 'GET',
      url: '/api/account/profile',
      status: 200,
      response: '@profile',
    }).as('postProfile');

    cy.get('li[class="navbar-dropdown m_r:10"]', timeout).click();
    cy.contains('Profile', timeout).click();

    cy.get('input[name="name"]').clear().type('Test');
    cy.get('input[name="email"]').clear().type('test.email@gmail.com');

    cy.get('div[class="md-radio-container"]', timeout).eq(1).click();
    cy.get('input[name="date"]', timeout).type('12');
    cy.get('input[name="month"]', timeout).type('12');
    cy.get('input[name="year"]', timeout).type('1995');

    cy.fixture('/profile/invalid').as('invProfile');
    cy.route({
      method: 'PUT',
      url: '/api/account/profile',
      status: 400,
      response: '@invProfile',
    }).as('pInvProfile');

    cy.contains('SAVE').click();
    cy.contains('email is already in used', { timeout: 60000 });
  });
});
