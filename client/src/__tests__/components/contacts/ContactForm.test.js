import { waitForDomChange } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import componentRenderer from '../../../testingUtils/componentRenderer';


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
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Enter contact details in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Email'), 'ppig@nacentpixels.io');
		userEvent.type(getByPlaceholderText('Phone'), '01234567899');
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the contact details have been added to the contact list
		expect(contactCards[3]).toHaveTextContent('Peppa Pig');
		expect(contactCards[3]).toHaveTextContent('ppig@nacentpixels.io');
		expect(contactCards[3]).toHaveTextContent('01234567899');
		expect(contactCards[3]).toHaveTextContent('Personal');
	});

	it('should clear the form when a new contact is submitted', () => {
		const { getByTestId, getByPlaceholderText } = componentRenderer.contactForm();

		//Enter contact details in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Email'), 'ppig@nacentpixels.io');
		userEvent.type(getByPlaceholderText('Phone'), '01234567899');
		userEvent.click(getByTestId('type-business'));
		userEvent.click(getByTestId('submit-contact'));

		//Check that the form values have been cleared
		expect(getByTestId('add-contact-form')).toHaveFormValues({
			name: '',
			email: '',
			phone: '',
			type: 'personal',
		});
	});

	it('should allow user to choose "business" for contact type', () => {
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Enter contact name in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.click(getByTestId('type-business'));
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the the name and business type have been set in the contact card
		expect(contactCards[3]).toHaveTextContent('Peppa Pig');
		expect(contactCards[3]).toHaveTextContent('Business');
	});

	it('should allow user to enter a new contact providing name only', () => {
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Enter contact name in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the name has been added to the contact card
		expect(contactCards[3]).toHaveTextContent('Peppa Pig');

		//Check that there is not a phone number of email address in the contact card
		expect(contactCards[3]).not.toHaveTextContent(/\d+/);
		expect(contactCards[3]).not.toHaveTextContent(/\w+@\w+/);
	});

	it('should allow user to enter a new contact providing name and email address', () => {
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Enter contact name in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Email'), 'ppig@nacentpixels.io');
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the name and email address have been added to the contact card
		expect(contactCards[3]).toHaveTextContent('Peppa Pig');
		expect(contactCards[3]).toHaveTextContent('ppig@nacentpixels.io');

		//Check that there is not a phone number in the contact card
		expect(contactCards[3]).not.toHaveTextContent(/\d+/);
	});

	it('should allow user to enter a new contact providing name phone number', () => {
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = componentRenderer.contactFormWithContacts();

		//Enter contact name in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Phone'), '01234567899');
		userEvent.click(getByTestId('submit-contact'));

		//Check that the dom now contains the 4th contact card
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the name and phone number have been added to the contact card
		expect(contactCards[3]).toHaveTextContent('Peppa Pig');
		expect(contactCards[3]).toHaveTextContent('01234567899');

		//Check that there is not an email address in the contact card
		expect(contactCards[3]).not.toHaveTextContent(/\w+@\w+/);
	});

	it('Should change to the "Update" Contact Form UI when the user clicks edit on a contact card', () => {
		const { getByTestId, getAllByText } = componentRenderer.contactFormWithContacts();

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
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
			getAllByText,
		} = componentRenderer.contactFormWithContacts();

		//Get the edit buttons.  As there are 3 contact cards there should be 3 edit buttons
		const editButtons = getAllByText('Edit');
		expect(editButtons).toHaveLength(3);

		//Click the edit button on card 2
		userEvent.click(editButtons[1]);

		//Check that the dom has updated following the button being clicked.
		const node = await waitForDomChange(getByPlaceholderText('Name'));

		//Update the form fields and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Email'), 'ppig@nacentpixels.io');
		userEvent.type(getByPlaceholderText('Phone'), '01234567899');
		userEvent.click(getByTestId('type-business'));
		userEvent.click(getByTestId('submit-contact'));

		//Check that the contact details have been updated
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards[1]).toHaveTextContent('Peppa Pig');
		expect(contactCards[1]).toHaveTextContent('ppig@nacentpixels.io');
		expect(contactCards[1]).toHaveTextContent('01234567899');
		expect(contactCards[1]).toHaveTextContent('Business');
	});

	it('Should update the correct field when user only updates a single detail', async () => {
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
			getAllByText,
		} = componentRenderer.contactFormWithContacts();

		//Get the edit buttons.  As there are 3 contact cards there should be 3 edit buttons
		const editButtons = getAllByText('Edit');
		expect(editButtons).toHaveLength(3);

		//Click the edit button on card 2
		userEvent.click(editButtons[1]);

		//Check that the dom has updated following the button being clicked.
		const node = await waitForDomChange(getByPlaceholderText('Name'));

		//Update the form field and submit
		userEvent.type(
			getByPlaceholderText('Email'),
			'newemail@nacentpixels.io'
		);
		userEvent.click(getByTestId('submit-contact'));

		//Check that the contact details have been updated
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards[1]).toHaveTextContent('Donald Duck');
		expect(contactCards[1]).toHaveTextContent('newemail@nacentpixels.io');
		expect(contactCards[1]).toHaveTextContent('01234567891');
		expect(contactCards[1]).toHaveTextContent('Personal');
	});

	it('should not update the contact if the user clicks "clear"', async () => {
		const {
			getByPlaceholderText,
			getByText,
			getAllByTestId,
			getAllByText,
			getByTestId,
		} = componentRenderer.contactFormWithContacts();

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
			'newemail@nacentpixels.io'
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
		expect(contactCards[1]).toHaveTextContent('Personal');
	});

	it.skip('should display an error if the user attempts to submit and invalid contact', () => {});
});
