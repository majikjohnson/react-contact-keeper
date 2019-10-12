import React from 'react';
import { render } from '@testing-library/react';
import ContactItem from '../../../components/contacts/ContactItem';

describe('ContactItem Component', () => {
	it('Should display contact with full details', () => {

        const contact = {
            id: 1,
            name: 'Mickey Mouse',
            email: 'mmouse@nascentpixels.io',
            phone: '01234567890',
            type: 'business',
        };

		const { getByText, getByTestId } = render(
			<ContactItem contact={contact} />
		);

        expect(getByText('Mickey Mouse'));
        expect(getByTestId('envelope-icon'));
        expect(getByText('mmouse@nascentpixels.io'));
        expect(getByTestId('phone-icon'));
		expect(getByText('01234567890'));
        expect(getByText('Business'));
        expect(getByText('Edit'));
		expect(getByText('Delete'));
    });
    
    it('Should display contact with partial details', () => {

        const contact = {
            id: 1,
            name: 'Mickey Mouse',
            type: 'personal'
        };

		const { getByText, queryByTestId } = render(
			<ContactItem contact={contact} />
		);

        expect(getByText('Mickey Mouse'));
        expect(getByText('Personal'));
        expect(getByText('Edit'));
        expect(getByText('Delete'));
        expect(queryByTestId('envelope-icon')).toBeNull();
        expect(queryByTestId('phone-icon')).toBeNull();
    });
    
    it.skip('should navigate to edit page when user clicks \"Edit\"', () => {

    });

    it.skip('should delete the contact when user clicks \"Delete\"', () => {

    });
});
