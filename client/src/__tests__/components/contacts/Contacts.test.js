import React from 'react';
import { render } from '@testing-library/react';
import Contacts from '../../../components/contacts/Contacts';
import ContactContext from '../../../context/contacts/ContactContext';

const contacts = [
	{
		id: 1,
		name: 'Mickey Mouse',
		email: 'mmouse@nascentpixels.io',
		phone: '01234567890',
		type: 'business',
	},
	{
		id: 2,
		name: 'Donald Duck',
		email: 'dduck@nascentpixels.io',
		type: 'personal',
	},
	{
		id: 3,
		name: 'Minnie Mouse',
		email: 'mmouse2@nascentpixels.io',
		type: 'business',
	},
];

describe('Contacts Component', () => {
	it('Should display 3 contacts', () => {
		const { getByText } = render(
			<ContactContext.Provider value={{ contacts }}>
				<Contacts />
			</ContactContext.Provider>
		);

		expect(getByText('Mickey Mouse'));
		expect(getByText('Donald Duck'));
		expect(getByText('Minnie Mouse'));
	});

	it('Should display 1 contact', () => {
		const contact = contacts[0];
		const { getByText } = render(
			<ContactContext.Provider value={{ contacts: [contact] }}>
				<Contacts />
			</ContactContext.Provider>
		);

		expect(getByText('Mickey Mouse'));
	});
});
