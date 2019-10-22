import {
	waitForDomChange,
	waitForElement,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
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

describe('ContactItem Component', () => {
	it('should display contact with full details', () => {
		const contact = {
			id: 1,
			name: 'Mickey Mouse',
			email: 'mmouse@nascentpixels.io',
			phone: '01234567890',
			type: 'business',
		};

		const { getByText, getByTestId } = componentRenderer.contactItem(
			contact
		);

		// Thought quite hard about whether to check for the email/phone images (obtained via CSS class)
		// Also, thought about checking the colour of 'Business' by checking the CSS class
		// Decided that the above cases were impelmentation detail, and should be checked by higher layer
		// Considered checking that Edit/Delete are buttons, but this again is implementation detail (i.e. could be changed to links).
		// Will check the button functionality in different tests when the functionality is implemented
		expect(getByText('Mickey Mouse'));
		expect(getByTestId('envelope-icon'));
		expect(getByText('mmouse@nascentpixels.io'));
		expect(getByTestId('phone-icon'));
		expect(getByText('01234567890'));
		expect(getByText('Business'));
		expect(getByText('Edit'));
		expect(getByText('Delete'));
	});

	it('should display contact with partial details', () => {
		const contact = {
			id: 1,
			name: 'Mickey Mouse',
			type: 'personal',
		};

		const { getByText, queryByTestId } = componentRenderer.contactItem(
			contact
		);

		expect(getByText('Mickey Mouse'));
		expect(getByText('Personal'));
		expect(getByText('Edit'));
		expect(getByText('Delete'));
		expect(queryByTestId('envelope-icon')).toBeNull();
		expect(queryByTestId('phone-icon')).toBeNull();
	});

	it('should populate the contact form with the contact details when the user clicks "edit"', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);

		const {
			getByPlaceholderText,
			getAllByText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Get the edit buttons.  As there are 3 contact cards there should be 3 edit buttons
		const editButtons = getAllByText('Edit');
		expect(editButtons).toHaveLength(3);

		//Click the edit button on card 2
		userEvent.click(editButtons[1]);

		//Check that the dom has updated following the button being clicked.
		await waitForDomChange(getByPlaceholderText('Name'));

		//Check that the contact form is populated with the correct details
		expect(getByTestId('add-contact-form')).toHaveFormValues({
			name: 'Donald Duck',
			email: 'dduck@nascentpixels.io',
			phone: '01234567891',
			type: 'business',
		});
	});

	it('should delete the correct contact when user clicks "Delete" while multiple contacts are displayed', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		mock.onDelete(/\/api\/contacts\/\w+/).reply(200, {
			msg: 'Contact Deleted',
		});

		const {
			getByText,
			queryByText,
			getAllByText,
			getAllByTestId,
		} = componentRenderer.contacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Get the delete buttons.  As there are 3 contact cards there should be 3 delete buttons
		const originalDeleteButtons = getAllByText('Delete');
		expect(originalDeleteButtons).toHaveLength(3);

		//Check the details displayed cards
		expect(getByText('Mickey Mouse'));
		expect(getByText('Donald Duck'));
		expect(getByText('Minnie Mouse'));

		//Click the delete button on card 2 and wait until it disappears
		userEvent.click(originalDeleteButtons[1]);
		await waitForElementToBeRemoved(() => getByText('Donald Duck'));

		//There should now only be 2 contact cards and therefore 2 delete buttons
		const remainingDeleteButtons = getAllByText('Delete');
		expect(remainingDeleteButtons).toHaveLength(2);

		//Check that only the details of the second card have been deleted
		expect(getByText('Mickey Mouse'));
		expect(queryByText('Donald Duck')).toBeNull();
		expect(getByText('Minnie Mouse'));
	});

	it('should delete the last contact when the user click clicks "Delete"', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, [
			{
				type: 'personal',
				_id: '5dacd3c18663c362e04cefa3',
				name: 'Minnie Mouse',
				email: 'mmouse2@nascentpixels.io',
				phone: '01234567890',
				user: '5d975cf367fd0e1c58383d26',
				date: '2019-10-20T21:38:09.186Z',
				__v: 0,
			},
		]);
		mock.onDelete(/\/api\/contacts\/\w+/).reply(200, {
			msg: 'Contact Deleted',
		});

		const { getByTestId, getByText } = componentRenderer.contacts();

		//Wait until the contact card is loaded
		await waitForElement(() => getByTestId(/card-id-/));

		//Click the delete button
		userEvent.click(getByText('Delete'));

		//As there are no contacts left, the "Please add a contact" message should be displayed
		await waitForElement(() => getByText('Please add a contact'));
	});
});
