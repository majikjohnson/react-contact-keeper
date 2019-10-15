import React, { useState, useContext, useEffect } from 'react';
import ContactContext from '../../context/contacts/ContactContext';

const ContactForm = () => {
	const contactContext = useContext(ContactContext);

	const { addContact, updateContact, clearCurrent, current } = contactContext;

	useEffect(() => {
		if (current !== null) {
			setContact(current);
		} else {
			setContact({
				name: '',
				email: '',
				phone: '',
				type: 'personal',
			});
		}
	}, [contactContext, current]);

	const [contact, setContact] = useState({
		name: '',
		email: '',
		phone: '',
		type: 'personal',
	});

	const { name, email, phone, type } = contact;

	const clearAll = () => {
		clearCurrent();
		setContact({
			name: '',
			email: '',
			phone: '',
			type: 'personal',
		});
	};

	const onChange = e => {
		setContact({
			...contact,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = e => {
		e.preventDefault();
		if (current === null) {
			addContact(contact);
		} else {
			updateContact(contact);
		}
		clearAll();
	};

	return (
		<form data-testid="add-contact-form" onSubmit={onSubmit}>
			<h2 className="text-primary" data-testid="form-title">
				{current ? 'Update Contact' : 'Add Contact'}
			</h2>
			<input
				type="text"
				placeholder="Name"
				name="name"
				value={name}
				onChange={onChange}
			/>
			<input
				type="email"
				placeholder="Email"
				name="email"
				value={email}
				onChange={onChange}
			/>
			<input
				type="text"
				placeholder="Phone"
				name="phone"
				value={phone}
				onChange={onChange}
			/>
			<h5>Contact Type</h5>
			<input
				data-testid="type-personal"
				type="radio"
				name="type"
				value="personal"
				onChange={onChange}
				checked={type === 'personal'}
			/>{' '}
			Personal{' '}
			<input
				data-testid="type-business"
				type="radio"
				name="type"
				value="business"
				onChange={onChange}
				checked={type === 'business'}
			/>{' '}
			Business
			<div>
				<input
					data-testid="submit-contact"
					type="submit"
					value={current ? 'Update' : 'Add Contact'}
					className="btn btn-primary btn-block"
				/>
			</div>
			{current && (
				<div>
					<button
						className="btn btn-light btn-block"
						onClick={clearAll}
					>
						Clear
					</button>
				</div>
			)}
		</form>
	);
};

export default ContactForm;
