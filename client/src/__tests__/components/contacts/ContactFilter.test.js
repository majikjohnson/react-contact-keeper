import { fireEvent, waitForElement } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import userEvent from '@testing-library/user-event';
import componentRenderer from '../../../testingUtils/componentRenderer';

const mulitpleContacts = [
	{
		type: 'personal',
		_id: '5dacd3c18663c362e04cefa3',
		name: 'Minnie Mouse',
		email: 'mmouse2@nascentpixels.io',
		phone: '01234567893',
		user: '5d975cf367fd0e1c58383d26',
		date: '2019-10-20T21:38:09.186Z',
		__v: 0,
	},
	{
		type: 'business',
		_id: '5d97b56adda70a52b86d696f',
		name: 'Donald Duck',
		email: 'dduck@nascentpixels.io',
		phone: '01234567891',
		user: '5d975cf367fd0e1c58383d26',
		date: '2019-10-04T21:11:06.414Z',
		__v: 0,
	},
	{
		type: 'personal',
		_id: '5d97b547dda70a52b86d696e',
		name: 'Mickey Mouse',
		email: 'mmouse@nascentpixels.io',
		phone: '01234567890',
		user: '5d975cf367fd0e1c58383d26',
		date: '2019-10-04T21:10:31.276Z',
		__v: 0,
	},
];

describe('Contact Filter', () => {
	it('should display all contacts when the search text matches all contact names', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		
		const {
			getAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Enter 'o' as search text in filter
		userEvent.type(getByPlaceholderText('Filter Contacts...'), 'o');

		//'o' matches name in all contacts, so there should still be 3 displayed
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(3);
	});

	it('should display all contacts when the search text matches all contact emails', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		
		const {
			getAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Enter 'nasc' as search text in filter
		userEvent.type(getByPlaceholderText('Filter Contacts...'), 'nasc');

		//'nasc' matches email in all contacts, so there should still be 3 displayed
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(3);
	});

	it('should dynamically filter the contacts as the user enters each character of the seach term', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		
		const {
			getAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

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

	it('should not display any contact cards if none of the contacts match the search term', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		
		const {
			queryAllByTestId,
			getAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Enter 'xxx' as search text in filter
		userEvent.type(getByPlaceholderText('Filter Contacts...'), 'xxx');

		//'xxx' doesn't match any contacts, so none should be displayed
		let contactCards = queryAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(0);
    });

    it('should should all contacts if search term is removed', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		
		const {
			getAllByTestId,
			getByPlaceholderText,
		} = componentRenderer.contactFilterWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

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
});
