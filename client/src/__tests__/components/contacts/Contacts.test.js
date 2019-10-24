import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Contacts from '../../../components/contacts/Contacts';
import ContactState from '../../../context/contacts/ContactState';

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

const contact = [
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
];

describe('Contacts Component', () => {
	it('Should display 3 contacts', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);

		const { getByText, getAllByTestId } = render(
			<ContactState>
				<Contacts />
			</ContactState>
		);

		//Wait until the contact cards are loaded
		const contactCards = await waitForElement(() => getAllByTestId(/card-id-/));

		expect(contactCards).toHaveLength(3);
		expect(getByText('Mickey Mouse'));
		expect(getByText('Donald Duck'));
		expect(getByText('Minnie Mouse'));
	});

	it('Should display 1 contact', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, contact);

		const { getByText, getAllByTestId } = render(
			<ContactState>
				<Contacts />
			</ContactState>
		);

		//Wait until the contact cards are loaded
		const contactCards = await waitForElement(() => getAllByTestId(/card-id-/));

		expect(contactCards).toHaveLength(1);
		expect(getByText('Minnie Mouse'));
	});

	it('Should display the loading... message while contacts are loading', async () => {
		const mock = new MockAdapter(axios, { delayResponse: 100 });
		mock.onGet('/api/contacts').reply(200, contact);

		const { getByAltText, getAllByTestId } = render(
			<ContactState>
				<Contacts />
			</ContactState>
		);

		//Check that loading image is displayed
		expect(getByAltText('Loading...'));

		//Wait until the contact cards are loaded
		const contactCards = await waitForElement(() => getAllByTestId(/card-id-/));

		//Verify that the page has updated and is now displaying the contacts
		expect(contactCards).toHaveLength(1);
	});
});
