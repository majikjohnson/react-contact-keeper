import React from 'react';
import { render } from '@testing-library/react';
import Contacts from '../../../components/contacts/Contacts';
import ContactState from '../../../context/contacts/ContactState';

describe('Contacts Component', () => {
	it('Should display 3 contacts', () => {
		const { getByText } = render(
			<ContactState>
				<Contacts />
			</ContactState>
		);

		expect(getByText('Mickey Mouse'));
		expect(getByText('Donald Duck'));
		expect(getByText('Minnie Mouse'));
	});

	it.skip('Should display 1 contact', () => {});
});
