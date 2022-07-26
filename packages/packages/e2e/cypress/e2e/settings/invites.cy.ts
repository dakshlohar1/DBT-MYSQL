describe('Settings - Invites', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('/');
    });

    it('Should invite user', () => {
        cy.get('[data-cy="settings-button"]').click();
        cy.contains('User management').click();
        cy.contains('Add user').click();
        cy.findByLabelText('Enter user email address *').type(
            'marygreen@lightdash.com',
        );
        cy.contains('Generate invite').click();
        cy.get('#invite-link-input')
            .should('be.visible')
            .then(($input) => {
                const value = $input.val();
                if (typeof value === 'string') {
                    cy.logout();
                    cy.visit(value);
                }
            });
        cy.get('[data-cy="welcome-user"]').should('be.visible');
        cy.contains('Join your team').click();
        cy.findByLabelText('First name *').type('Mary');
        cy.findByLabelText('Last name *').type('Green');
        cy.findByLabelText('Email address *')
            .should('be.disabled')
            .should('have.value', 'marygreen@lightdash.com');
        cy.findByLabelText('Password *').type('PasswordMary1');
        cy.contains('Sign up').click();
        cy.get('[data-cy="user-avatar"]').should('contain', 'MG');
    });

    it('Should delete user', () => {
        cy.get('[data-cy="settings-button"]').click();
        cy.contains('User management').click();
        cy.findByText('marygreen@lightdash.com')
            .parents('.bp4-card')
            .find('[icon="delete"]')
            .click();
        cy.findByText('Are you sure you want to delete this user ?')
            .parents('.bp4-dialog')
            .findByRole('button', { name: 'Delete' })
            .click();
        cy.findByText('Success! User was deleted.').should('be.visible');
        cy.findByText('marygreen@lightdash.com').should('not.exist');
    });
});
