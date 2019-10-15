import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../../components/contacts/ContactForm';
import Contacts from '../../../components/contacts/Contacts';
import ContactState from '../../../context/contacts/ContactState';

const renderContactForm = () => {
	return render(
		<ContactState>
			<div>
				<div>
					<ContactForm />
				</div>
				<div>
					<Contacts />
				</div>
			</div>
		</ContactState>
	);
};

describe('Add Contact Form', () => {
	it('should display the form with correct title', () => {
		const { getByTestId } = render(<ContactForm />);

		expect(getByTestId('form-title')).toHaveTextContent('Add Contact');
	});

	it('should display the form with correct placeholder text', () => {
		const { getByPlaceholderText } = render(<ContactForm />);

		expect(getByPlaceholderText('Name'));
		expect(getByPlaceholderText('Email'));
		expect(getByPlaceholderText('Phone'));
	});

	it('should set "personal" contact type as the default', () => {
		const { getByTestId } = render(<ContactForm />);

		expect(getByTestId('type-personal')).toHaveAttribute('checked');
		expect(getByTestId('type-business')).not.toHaveAttribute('checked');
	});

	it('should allow user to enter a new contact providing full details', () => {
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = renderContactForm();

		//Enter contact details in the form and submit
		userEvent.type(getByPlaceholderText('Name'), 'Peppa Pig');
		userEvent.type(getByPlaceholderText('Email'), 'ppig@nacentpixels.io');
		userEvent.type(getByPlaceholderText('Phone'), '01234567899');
		userEvent.click(getByTestId('submit-contact'));

		//Check that the form values have been cleared
		expect(getByTestId('add-contact-form')).toHaveFormValues({
			name: '',
			email: '',
			phone: '',
			type: 'personal'
		});

		//Check that the dom now contains the 4th contact card
		const contactCards = getAllByTestId(/card-id-/);
		expect(contactCards).toHaveLength(4);

		//Check that the contact details have been added to the contact list
		expect(contactCards[3]).toHaveTextContent('Peppa Pig');
		expect(contactCards[3]).toHaveTextContent('ppig@nacentpixels.io');
		expect(contactCards[3]).toHaveTextContent('01234567899');
		expect(contactCards[3]).toHaveTextContent('Personal');
	});

	it('should allow user to choose "business" for contact type', () => {
		const {
			getByPlaceholderText,
			getByTestId,
			getAllByTestId,
		} = renderContactForm();

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
		} = renderContactForm();

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
		} = renderContactForm();

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
		} = renderContactForm();

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

	it.skip('should display an error if the user attempts to submit and invalid contact', () => {});
});
