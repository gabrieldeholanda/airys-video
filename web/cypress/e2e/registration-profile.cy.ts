import { faker } from '@faker-js/faker';

describe('Registration and Profile Flow', () => {
  const testUser = {
    email: faker.internet.email(),
    password: 'Test@123456',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfBirth: '1990-01-01',
    gender: 'male',
    nationality: 'Brasileiro(a)',
    cpf: '123.456.789-09',
    rg: '12.345.678-9',
    phone: '(11) 3456-7890',
    mobilePhone: '(11) 98765-4321',
    address: 'Rua Teste',
    addressNumber: '123',
    complement: 'Apto 456',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  };

  const businessUser = {
    email: faker.internet.email(),
    password: 'Test@123456',
    companyName: faker.company.name(),
    tradingName: faker.company.name(),
    businessType: 'ltda',
    businessCategory: 'technology',
    cnpj: '12.345.678/0001-90',
    stateRegistration: '123456789',
    municipalRegistration: '987654321',
    phone: '(11) 3456-7890',
    website: faker.internet.url(),
    address: 'Avenida Comercial',
    addressNumber: '789',
    complement: 'Sala 123',
    neighborhood: 'Centro Empresarial',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '04567-890'
  };

  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register a personal account and display correct data in profile', () => {
    // Fill registration form
    cy.get('#email-address').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('#confirm-password').type(testUser.password);

    // Select personal account type
    cy.contains('label', 'Account Type').parent().find('button[role="combobox"]').click();
    cy.get('[role="option"][data-value="personal"]').click();

    // Fill personal details
    cy.get('#firstName').type(testUser.firstName);
    cy.get('#lastName').type(testUser.lastName);
    cy.get('#dateOfBirth').type(testUser.dateOfBirth);
    cy.contains('label', 'Gender').parent().find('button[role="combobox"]').click();
    cy.get('[role="option"][data-value="male"]').click();
    cy.get('#nationality').type(testUser.nationality);
    cy.get('#cpf').type(testUser.cpf);
    cy.get('#rg').type(testUser.rg);
    cy.get('#phone').type(testUser.phone);
    cy.get('#mobilePhone').type(testUser.mobilePhone);
    cy.get('#zipCode').type(testUser.zipCode);
    cy.get('#address').type(testUser.address);
    cy.get('#addressNumber').type(testUser.addressNumber);
    cy.get('#complement').type(testUser.complement);
    cy.get('#neighborhood').type(testUser.neighborhood);
    cy.get('#city').type(testUser.city);
    cy.contains('label', 'State').parent().find('button[role="combobox"]').click();
    cy.get('[role="option"][data-value="SP"]').click();

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for registration to complete and redirect
    cy.url().should('include', '/');

    // Navigate to profile
    cy.visit('/account/profile');

    // Verify personal details
    cy.get('#firstName').should('have.value', testUser.firstName);
    cy.get('#lastName').should('have.value', testUser.lastName);
    cy.get('#dateOfBirth').should('have.value', testUser.dateOfBirth);
    cy.get('#gender').should('have.value', 'male');
    cy.get('#nationality').should('have.value', testUser.nationality);
    cy.get('#cpf').should('have.value', testUser.cpf);
    cy.get('#rg').should('have.value', testUser.rg);
    cy.get('#phone').should('have.value', testUser.phone);
    cy.get('#mobilePhone').should('have.value', testUser.mobilePhone);
    cy.get('#address').should('have.value', testUser.address);
    cy.get('#addressNumber').should('have.value', testUser.addressNumber);
    cy.get('#complement').should('have.value', testUser.complement);
    cy.get('#neighborhood').should('have.value', testUser.neighborhood);
    cy.get('#city').should('have.value', testUser.city);
    cy.get('#state').should('have.value', 'SP');
    cy.get('#zipCode').should('have.value', testUser.zipCode);
  });

  it('should register a business account and display correct data in profile', () => {
    // Fill registration form
    cy.get('#email-address').type(businessUser.email);
    cy.get('#password').type(businessUser.password);
    cy.get('#confirm-password').type(businessUser.password);

    // Select business account type
    cy.contains('label', 'Account Type').parent().find('button[role="combobox"]').click();
    cy.get('[role="option"][data-value="business"]').click();

    // Fill business details
    cy.get('#companyName').type(businessUser.companyName);
    cy.get('#tradingName').type(businessUser.tradingName);
    cy.contains('label', 'Business Type').parent().find('button[role="combobox"]').click();
    cy.get('[role="option"][data-value="ltda"]').click();
    cy.contains('label', 'Business Category').parent().find('button[role="combobox"]').click();
    cy.get('[role="option"][data-value="technology"]').click();
    cy.get('#cnpj').type(businessUser.cnpj);
    cy.get('#stateRegistration').type(businessUser.stateRegistration);
    cy.get('#municipalRegistration').type(businessUser.municipalRegistration);
    cy.get('#phone').type(businessUser.phone);
    cy.get('#website').type(businessUser.website);
    cy.get('#zipCode').type(businessUser.zipCode);
    cy.get('#address').type(businessUser.address);
    cy.get('#addressNumber').type(businessUser.addressNumber);
    cy.get('#complement').type(businessUser.complement);
    cy.get('#neighborhood').type(businessUser.neighborhood);
    cy.get('#city').type(businessUser.city);
    cy.contains('label', 'State').parent().find('button[role="combobox"]').click();
    cy.get('[role="option"][data-value="SP"]').click();

    // Submit form
    cy.get('button[type="submit"]').click();

    // Wait for registration to complete and redirect
    cy.url().should('include', '/');

    // Navigate to profile
    cy.visit('/account/profile');

    // Verify business details
    cy.get('#companyName').should('have.value', businessUser.companyName);
    cy.get('#tradingName').should('have.value', businessUser.tradingName);
    cy.get('#businessType').should('have.value', 'ltda');
    cy.get('#businessCategory').should('have.value', 'technology');
    cy.get('#cnpj').should('have.value', businessUser.cnpj);
    cy.get('#stateRegistration').should('have.value', businessUser.stateRegistration);
    cy.get('#municipalRegistration').should('have.value', businessUser.municipalRegistration);
    cy.get('#phone').should('have.value', businessUser.phone);
    cy.get('#website').should('have.value', businessUser.website);
    cy.get('#address').should('have.value', businessUser.address);
    cy.get('#addressNumber').should('have.value', businessUser.addressNumber);
    cy.get('#complement').should('have.value', businessUser.complement);
    cy.get('#neighborhood').should('have.value', businessUser.neighborhood);
    cy.get('#city').should('have.value', businessUser.city);
    cy.get('#state').should('have.value', 'SP');
    cy.get('#zipCode').should('have.value', businessUser.zipCode);
  });

  it('should validate required fields in personal registration', () => {
    // Select personal account type
    cy.contains('label', 'Account Type').parent().find('button[role="combobox"]').click();
    cy.get('[role="option"][data-value="personal"]').click();

    // Try to submit without filling required fields
    cy.get('button[type="submit"]').click();

    // Check for required field validations
    cy.get('#email-address:invalid').should('exist');
    cy.get('#password:invalid').should('exist');
    cy.get('#firstName:invalid').should('exist');
    cy.get('#lastName:invalid').should('exist');
    cy.get('#dateOfBirth:invalid').should('exist');
    cy.get('#cpf:invalid').should('exist');
    cy.get('#phone:invalid').should('exist');
    cy.get('#mobilePhone:invalid').should('exist');
    cy.get('#address:invalid').should('exist');
    cy.get('#addressNumber:invalid').should('exist');
    cy.get('#neighborhood:invalid').should('exist');
    cy.get('#city:invalid').should('exist');
    cy.get('#state:invalid').should('exist');
    cy.get('#zipCode:invalid').should('exist');
  });

  it('should validate required fields in business registration', () => {
    // Select business account type
    cy.contains('label', 'Account Type').parent().find('button[role="combobox"]').click();
    cy.get('[role="option"][data-value="business"]').click();

    // Try to submit without filling required fields
    cy.get('button[type="submit"]').click();

    // Check for required field validations
    cy.get('#email-address:invalid').should('exist');
    cy.get('#password:invalid').should('exist');
    cy.get('#companyName:invalid').should('exist');
    cy.get('#tradingName:invalid').should('exist');
    cy.get('#cnpj:invalid').should('exist');
    cy.get('#stateRegistration:invalid').should('exist');
    cy.get('#municipalRegistration:invalid').should('exist');
    cy.get('#phone:invalid').should('exist');
    cy.get('#website:invalid').should('exist');
    cy.get('#address:invalid').should('exist');
    cy.get('#addressNumber:invalid').should('exist');
    cy.get('#complement:invalid').should('exist');
    cy.get('#neighborhood:invalid').should('exist');
    cy.get('#city:invalid').should('exist');
    cy.get('#state:invalid').should('exist');
    cy.get('#zipCode:invalid').should('exist');
  });
}); 