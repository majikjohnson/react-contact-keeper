import { waitForDomChange, waitForElement, getByText } from '@testing-library/react';
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

describe('Add Contact Form', () => {
	it('should display the form with correct title', () => {
		const { getByTestId } = componentRenderer.contactForm();

		expect(getByTestId('form-title')).toHaveTextContent('Add Contact');
	});

	it('should display the form with correct placeholder text', () => {
		const { getByPlaceholderText } = componentRenderer.contactForm();

		expect(getByPlaceholderText('Name'));
		expect(getByPlaceholderText('Email'));
		expect(getByPlaceholderText('Phone'));
	});

	it('should set "personal" contact type as the default', () => {
		const { getByTestId } = componentRenderer.contactForm();

		expect(getByTestId('type-personal')).toHaveAttribute('checked');
		expect(getByTestId('type-business')).not.toHaveAttribute('checked');
	});

	it('should allow user to enter a new contact providing full details', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		mock.onPost('/api/contacts').reply(200, {
			type: 'personal',
			_id: '5d97b56adda70a52b86d6970',
			name: 'Peppa Pig',
			email: 'ppig@nascentpixels.io',
			phone: '01234567899',
			user: '5d975cf367fd0e1c58383d26',
			date: '2019-10-04T21:11:06.414Z',
			__v: 0,
		});
		
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Enter contact details in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Email'), 'ppig@nascentpixels.io');
		userEvent.type(getByPlaceholderText('Phone'), '01234567899');
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		await waitForDomChange(() => getAllByTestId(/card-id-/));
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the contact details have been added to the contact list
		expect(contactCards[0]).toHaveTextContent('Peppa Pig');
		expect(contactCards[0]).toHaveTextContent('ppig@nascentpixels.io');
		expect(contactCards[0]).toHaveTextContent('01234567899');
		expect(contactCards[0]).toHaveTextContent('Personal');
	});

	it('should clear the form when a new contact is submitted', async () => {		
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		mock.onPost('/api/contacts').reply(200, {
			type: 'business',
			_id: '5d97b56adda70a52b86d6970',
			name: 'Peppa Pig',
			email: 'ppig@nascentpixels.io',
			user: '5d975cf367fd0e1c58383d26',
			date: '2019-10-04T21:11:06.414Z',
			__v: 0,
		});
		
		const {
			getByTestId,
			getByPlaceholderText,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		await waitForElement(() => getAllByTestId(/card-id-/));

		//Enter contact details in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Email'), 'ppig@nascentpixels.io');
		userEvent.type(getByPlaceholderText('Phone'), '01234567899');
		userEvent.click(getByTestId('type-business'));
		userEvent.click(getByTestId('submit-contact'));

		//Check that the form values have been cleared
		await waitForDomChange(getByPlaceholderText('Name'));
		expect(getByTestId('add-contact-form')).toHaveFormValues({
			name: '',
			email: '',
			phone: '',
			type: 'personal',
		});
	});

	it('should allow user to choose "business" for contact type', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		mock.onPost('/api/contacts').reply(200, {
			type: 'business',
			_id: '5d97b56adda70a52b86d6970',
			name: 'Peppa Pig',
			user: '5d975cf367fd0e1c58383d26',
			date: '2019-10-04T21:11:06.414Z',
			__v: 0,
		});
		
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Enter contact name in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.click(getByTestId('type-business'));
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		await waitForDomChange(() => getAllByTestId(/card-id-/));
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the the name and business type have been set in the contact card
		expect(contactCards[0]).toHaveTextContent('Peppa Pig');
		expect(contactCards[0]).toHaveTextContent('Business');
	});

	it('should allow user to enter a new contact providing name only', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		mock.onPost('/api/contacts').reply(200, {
			type: 'personal',
			_id: '5d97b56adda70a52b86d6970',
			name: 'Peppa Pig',
			user: '5d975cf367fd0e1c58383d26',
			date: '2019-10-04T21:11:06.414Z',
			__v: 0,
		});
		
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Enter contact name in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		await waitForDomChange(() => getAllByTestId(/card-id-/));
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the name has been added to the contact card
		expect(contactCards[0]).toHaveTextContent('Peppa Pig');

		//Check that there is not a phone number of email address in the contact card
		expect(contactCards[0]).not.toHaveTextContent(/\d+/);
		expect(contactCards[0]).not.toHaveTextContent(/\w+@\w+/);
	});

	it('should allow user to enter a new contact providing name and email address', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		mock.onPost('/api/contacts').reply(200, {
			type: 'personal',
			_id: '5d97b56adda70a52b86d6970',
			name: 'Peppa Pig',
			email: 'ppig@nascentpixels.io',
			user: '5d975cf367fd0e1c58383d26',
			date: '2019-10-04T21:11:06.414Z',
			__v: 0,
		});

		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Enter contact name in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Email'), 'ppig@nascentpixels.io');
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		await waitForDomChange(() => getAllByTestId(/card-id-/));
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the name and email address have been added to the contact card
		expect(contactCards[0]).toHaveTextContent('Peppa Pig');
		expect(contactCards[0]).toHaveTextContent('ppig@nascentpixels.io');

		//Check that there is not a phone number in the contact card
		expect(contactCards[0]).not.toHaveTextContent(/\d+/);
	});

	it('should allow user to enter a new contact providing name phone number', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		mock.onPost('/api/contacts').reply(200, {
			type: 'personal',
			_id: '5d97b56adda70a52b86d6970',
			name: 'Peppa Pig',
			phone: '01234567899',
			user: '5d975cf367fd0e1c58383d26',
			date: '2019-10-04T21:11:06.414Z',
			__v: 0,
		});
		
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//Enter contact name in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Phone'), '01234567899');
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		await waitForDomChange(() => getAllByTestId(/card-id-/));
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the name and phone number have been added to the contact card
		expect(contactCards[0]).toHaveTextContent('Peppa Pig');
		expect(contactCards[0]).toHaveTextContent('01234567899');

		//Check that there is not an email address in the contact card
		expect(contactCards[0]).not.toHaveTextContent(/\w+@\w+/);
	});

	it('Should change to the "Update" Contact Form UI when the user clicks edit on a contact card', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		
		const {
			getByTestId,
			getAllByText,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Wait until the contact cards are loaded
		await waitForElement(() => getAllByTestId(/card-id-/));

		//click the edit button on a contact
		const editButtons = getAllByText('Edit');
		userEvent.click(editButtons[0]);

		//Check that the contact form title and button text is correct
		expect(getByTestId('form-title')).toHaveTextContent('Update Contact');
		expect(getByTestId('submit-contact')).toHaveAttribute(
			'value',
			'Update'
		);
	});

	it('Should display updated details when the user clicks "update" after editing all contact details', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		mock.onPut(/\/api\/contacts\/\w+/).reply(200, {
			type: 'personal',
			_id: '5d97b56adda70a52b86d696f',
			name: 'Peppa Pig',
			email: 'ppig@nascentpixels.io',
			phone: '01234567899',
			user: '5d975cf367fd0e1c58383d26',
			date: '2019-10-04T21:11:06.414Z',
			__v: 0,
		});
		
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
			getAllByText,
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

		//Update the form fields and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Email'), 'ppig@nascentpixels.io');
		userEvent.type(getByPlaceholderText('Phone'), '01234567899');
		userEvent.click(getByTestId('type-personal'));
		userEvent.click(getByTestId('submit-contact'));

		//Check that the contact details have been updated
		await waitForDomChange(() => contactCards[1]);
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards[1]).toHaveTextContent('Peppa Pig');
		expect(contactCards[1]).toHaveTextContent('ppig@nascentpixels.io');
		expect(contactCards[1]).toHaveTextContent('01234567899');
		expect(contactCards[1]).toHaveTextContent('Personal');
	});

	it('Should update the correct field when user only updates a single detail', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);
		mock.onPut(/\/api\/contacts\/\w+/).reply(200, {
			type: 'business',
			_id: '5d97b56adda70a52b86d696f',
			name: 'Donald Duck',
			email: 'newemail@nascentpixels.io',
			phone: '01234567891',
			user: '5d975cf367fd0e1c58383d26',
			date: '2019-10-04T21:11:06.414Z',
			__v: 0,
		});

		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
			getAllByText,
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

		//Update the form field and submit
		userEvent.type(
			getByPlaceholderText('Email'),
			'newemail@nascentpixels.io'
		);
		userEvent.click(getByTestId('submit-contact'));

		//Check that the contact details have been updated
		await waitForDomChange(() => contactCards[1]);
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards[1]).toHaveTextContent('Donald Duck');
		expect(contactCards[1]).toHaveTextContent('newemail@nascentpixels.io');
		expect(contactCards[1]).toHaveTextContent('01234567891');
		expect(contactCards[1]).toHaveTextContent('Business');
	});

	it('should not update the contact if the user clicks "clear"', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/contacts').reply(200, mulitpleContacts);

		const {
			getByPlaceholderText,
			getByText,
			getAllByTestId,
			getAllByText,
			getByTestId,
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

		//Update a form field, then click cancel
		userEvent.type(
			getByPlaceholderText('Email'),
			'newemail@nascentpixels.io'
		);
		userEvent.click(getByText('Clear'));

		//Check that the form values have been cleared
		expect(getByTestId('add-contact-form')).toHaveFormValues({
			name: '',
			email: '',
			phone: '',
			type: 'personal',
		});

		//Check that the contact details have not been updated
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards[1]).toHaveTextContent('Donald Duck');
		expect(contactCards[1]).toHaveTextContent('dduck@nascentpixels.io');
		expect(contactCards[1]).toHaveTextContent('01234567891');
		expect(contactCards[1]).toHaveTextContent('Business');
	});
});
