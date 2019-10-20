import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import componentRenderer from '../../../testingUtils/componentRenderer';

describe('Contact Filter', () => {
	it('should display all contacts when the search text matches all contact names', () => {
		const {
			getAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Enter 'o' as search text in filter
		userEvent.type(getByPlaceholderText('Filter Contacts...'), 'o');

		//'o' matches name in all contacts, so there should still be 3 displayed
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(3);
	});

	it('should display all contacts when the search text matches all contact emails', () => {
		const {
			getAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Enter 'nasc' as search text in filter
		userEvent.type(getByPlaceholderText('Filter Contacts...'), 'nasc');

		//'nasc' matches email in all contacts, so there should still be 3 displayed
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(3);
	});

	it('should dynamically filter the contacts as the user enters each character of the seach term', () => {
		const {
			getAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Enter 'm' as search text in filter
		userEvent.type(getByPlaceholderText('Filter Contacts...'), 'm');

		//'m' matches 2 contacts, so check that 2 are displayed
		let contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(2);

		//Update seach text with 'ic'
		userEvent.type(getByPlaceholderText('Filter Contacts...'), 'ic');

		//'mic' matches 1 contacts, so check that 1 is displayed
		contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(1);
	});

	it('should not display any contact cards if none of the contacts match the search term', () => {
        const {
			queryAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Enter 'xxx' as search text in filter
		userEvent.type(getByPlaceholderText('Filter Contacts...'), 'xxx');

		//'xxx' doesn't match any contacts, so none should be displayed
		let contactCards = queryAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(0);
    });

    it('should should additional contact cards if search text becomes less specific', () => {
        const {
			getAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Enter 'm' as search text in filter
		userEvent.type(getByPlaceholderText('Filter Contacts...'), 'm');

		//'m' matches 2 contacts, so check that 2 are displayed
		let contactCards = getAllByTestId(/card-id-/);
        expect(contactCards).toHaveLength(2);
        
        //remove the search text from the filter
        //userEvent.type(getByPlaceholderText('Filter Contacts...'), '');
        fireEvent.change(getByPlaceholderText('Filter Contacts...'), { target: { value: '' } })

        //all three contacts should be displayed
        contactCards = getAllByTestId(/card-id-/);
        expect(contactCards).toHaveLength(3);
    });

    it('should display all contacts if the seach text is removed', () => {

    });
});
