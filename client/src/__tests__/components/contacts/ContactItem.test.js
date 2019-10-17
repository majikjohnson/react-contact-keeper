import React from 'react';
import { render, waitForDomChange } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactItem from '../../../components/contacts/ContactItem';
import ContactForm from '../../../components/contacts/ContactForm';
import Contacts from '../../../components/contacts/Contacts';
import ContactState from '../../../context/contacts/ContactState';

const renderContactList = () => {
	return render(
		<ContactState>
			<div>
				<Contacts />
			</div>
		</ContactState>
	);
};

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

jest.mock('react-transition-group', () => {
	const FakeTransitionGroup = jest.fn(({children}) => children);
	const FakeCSSTransition = jest.fn(({children}) => children);

	return {
		CSSTransition: FakeCSSTransition,
		TransitionGroup: FakeTransitionGroup
	}
});

describe('ContactItem Component', () => {
	it('should display contact with full details', () => {
		const contact = {
			id: 1,
			name: 'Mickey Mouse',
			email: 'mmouse@nascentpixels.io',
			phone: '01234567890',
			type: 'business',
		};

		const { getByText, getByTestId } = render(
			<ContactState>
				<ContactItem contact={contact} />
			</ContactState>
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

		const { getByText, queryByTestId } = render(
			<ContactState>
				<ContactItem contact={contact} />
			</ContactState>
		);

		expect(getByText('Mickey Mouse'));
		expect(getByText('Personal'));
		expect(getByText('Edit'));
		expect(getByText('Delete'));
		expect(queryByTestId('envelope-icon')).toBeNull();
		expect(queryByTestId('phone-icon')).toBeNull();
	});

	it('should populate the contact form with the contact details when the user clicks "edit"', async () => {
		const {
			getByPlaceholderText,
			getAllByText,
			getByTestId,
		} = renderContactForm();

		//Get the edit buttons.  As there are 3 contact cards there should be 3 edit buttons
		const editButtons = getAllByText('Edit');
		expect(editButtons).toHaveLength(3);

		//Click the edit button on card 2
		userEvent.click(editButtons[1]);

		//Check that the dom has updated following the button being clicked.
		const node = await waitForDomChange(getByPlaceholderText('Name'));

		//Check that the contact form is populated with the correct details
		expect(getByTestId('add-contact-form')).toHaveFormValues({
			name: 'Donald Duck',
			email: 'dduck@nascentpixels.io',
			phone: '01234567891',
			type: 'personal',
		});
	});

	it('should delete the correct contact when user clicks "Delete" while multiple contacts are displayed', () => {
		const { getByText, queryByText, getAllByText } = renderContactList();

		//Get the delete buttons.  As there are 3 contact cards there should be 3 delete buttons
		const originalDeleteButtons = getAllByText('Delete');
		expect(originalDeleteButtons).toHaveLength(3);

		//Check the details displayed cards
		expect(getByText('Mickey Mouse'));
		expect(getByText('Donald Duck'));
		expect(getByText('Minnie Mouse'));

		//Click the delete button on card 2
		userEvent.click(originalDeleteButtons[1]);

		//There should now only be 2 contact cards and therefore 2 delete buttons
		const remainingDeleteButtons = getAllByText('Delete');
		expect(remainingDeleteButtons).toHaveLength(2);

		//Check that only the details of the second card have been deleted
		expect(getByText('Mickey Mouse'));
		expect(queryByText('Donald Duck')).toBeNull();
		expect(getByText('Minnie Mouse'));
	});

	it('should delete the last contact when the user click clicks "Delete"', () => {
		const { getAllByText, queryAllByTestId } = renderContactList();

		//There should be 3 contact cards to start with
		expect(queryAllByTestId(/card-id-/)).toHaveLength(3);

		//Get the delete buttons for all 3 contact cards and click each of them
		const deleteButtons = getAllByText('Delete');
		deleteButtons.forEach(button => {
			userEvent.click(button);
		});

		//There should not be any contact cards remaining
		expect(queryAllByTestId(/card-id-/)).toHaveLength(0);
	});
});
