/*

11 Online Technical Assessment

Simple Statistics Plugin QA

Testing By: David Sanderson

 */

/*

Discovered Bugs:

1) Cannot add more than 4 Statistics per block.

2) Not a bug, but you cannot edit the block without error 'This block contains unexpected or invalid content'.

references:

https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-deprecation/
https://wordpress.org/support/topic/upgrading-a-block-gives-invalid-content-error/

*/

const baseURL = Cypress.env( "site" ).url;

describe('Simple Statistic Plugin Tests', function() {

	beforeEach(() => {
		// 1) Login to wp-admin
		//Can this be refactored to use cy.request instead of UI Input? Create login function in support/commands.js?
		cy.visit(baseURL + 'wp-login.php');
		cy.wait(1000);
		//To shorten test time, I white listed word press cookies in my support/index.js file so that the login would only be required once.
		// Code used in support/index.js Below:
		// Cypress.Cookies.defaults({
		// 	whitelist: /wordpress_*/
		// })
		cy.get('#user_login').type(Cypress.env("wp_admin"));
		cy.get('#user_pass').type(Cypress.env("wp_pass"));
		cy.get('#wp-submit').click();

	});

	it('check how many statistic blocks can be added', function() {
		//2) Create a new page and add the Simple Statistic Block
		cy.visit(baseURL + 'wp-admin/post-new.php?post_type=page');
		cy.get('.editor-block-list__layout').find('textarea').focus();
		cy.get('.editor-inserter').first().click();
		cy.get('#editor-inserter__search-0').type('Simple', {force: true});
		cy.get('li').contains('Simple Statistics').click();

		//Add 5 statistics
		//Can this be refactored to loop 5 times?

		for (var i = 0; i < 5; i++) {
		cy.get('button').contains('Add Statistic').click();
		}
		// cy.get('button').contains('Add Statistic').click();
		// cy.get('button').contains('Add Statistic').click();
		// cy.get('button').contains('Add Statistic').click();
		// cy.get('button').contains('Add Statistic').click();

		//Assert that the Simple Stat Block should have 5 statistics.

		cy.get('.wp-block-cgb-block-gutenberg-simple-statistics').find('.container').children().should('have.length', 5);

	});


	//Tests if the Simple Stat block can be added and deleted.

	it('add and delete simple statistic plugin', function() {

	cy.visit(baseURL + 'wp-admin/post-new.php?post_type=page');
	cy.get('.editor-block-list__layout').find('textarea').focus();
	cy.get('.editor-inserter').first().click();
	cy.get('#editor-inserter__search-0').type('Simple', {force: true});
	cy.get('li').contains('Simple Statistics').click();
	cy.get('button').contains('Add Statistic').click();
   cy.get('div').find('.stat-edit-buttons').first().click();

   //the line below searches the DOM for all of the 'statistics' divs and asserts that there should be 0 after deletion
	cy.get('.wp-block-cgb-block-gutenberg-simple-statistics').find('.container').children().should('have.length', 0);

	});

	//Tests that values can be entered into the Simple Stat Block

	it('add and enter values into simple statistic block', function() {

		cy.visit(baseURL + 'wp-admin/post-new.php?post_type=page');
		cy.get('.editor-block-list__layout').find('textarea').focus();
		cy.get('.editor-inserter').first().click();
		cy.get('#editor-inserter__search-0').type('Simple', {force: true});
		cy.get('li').contains('Simple Statistics').click();
		cy.get('button').contains('Add Statistic').click();
		cy.get('.wp-block-cgb-block-gutenberg-simple-statistics').find('textarea').first().type('1234');
		cy.get(':nth-child(2) > .editor-plain-text').type('ABCDE');

	// assert that label and value input should match what was entered

	   cy.get(':nth-child(2) > .editor-plain-text').should('have.text', 'ABCDE');
	   cy.get('.wp-block-cgb-block-gutenberg-simple-statistics').find('textarea').first().should('have.text', '1234');

	 });

	//Test that value input shows NAN when non-integer is entered

	it('show NAN for non-integer input values', function() {

		cy.visit(baseURL + 'wp-admin/post-new.php?post_type=page');
		cy.get('.editor-block-list__layout').find('textarea').focus();
		cy.get('.editor-inserter').first().click();
		cy.get('#editor-inserter__search-0').type('Simple', {force: true});
		cy.get('li').contains('Simple Statistics').click();
		cy.get('button').contains('Add Statistic').click();
		cy.get('.wp-block-cgb-block-gutenberg-simple-statistics').find('textarea').first().type('$%#^');
		cy.get('#post-title-0').click({force: true});

		//assert that a non integer input should display as NaN

		cy.get('.editor-block-list__layout').children().first().should('have.text', 'NaN');

	});

	//Test that the block can be edited after publishing
	it('create, publish, and edit deprecated block', function() {

		cy.visit(baseURL + 'wp-admin/post-new.php?post_type=page');
		cy.get('.editor-block-list__layout').find('textarea').focus();
		cy.get('.editor-inserter').first().click();
		cy.get('#editor-inserter__search-0').type('Simple', {force: true});
		cy.get('li').contains('Simple Statistics').click();
		cy.get('button').contains('Add Statistic').click();
		cy.get('.wp-block-cgb-block-gutenberg-simple-statistics').find('textarea').first().type('1234');
		cy.get(':nth-child(2) > .editor-plain-text').type('ABCDE');
		cy.get('.editor-post-publish-panel__toggle').click();
		cy.get('.editor-post-publish-panel__header-publish-button > .components-button').click();
		cy.get('.post-publish-panel__postpublish-buttons > a.components-button').click();
		cy.get('.post-edit-link').click({force: true });
		cy.get('.editor-warning__contents').should('not.exist');

	});


});





