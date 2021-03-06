import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ContactContext from '../../context/contacts/ContactContext';

const ContactItem = ({ contact }) => {
	const contactContext = useContext(ContactContext);
	const { deleteContact, setCurrent, clearCurrent } = contactContext;

	const { _id, name, email, phone, type } = contact;

	const onDelete = () => {
		deleteContact(_id);
		clearCurrent();
	}

	const onEdit = () => {
		setCurrent(contact);
	}

	return (
		<div data-testid={`card-id-${_id}`} className="card bg-light">
			<h3 className="text-primary text-left">
				{name}{' '}
				<span
					style={{ float: 'right' }}
					className={
						'badge ' +
						(type === 'business'
							? 'badge-success'
							: 'badge-primary')
					}
				>
				{type.charAt(0).toUpperCase() + type.slice(1)}
				</span>
			</h3>
			<ul className="list">
				{email && (
					<li>
						<i data-testid="envelope-icon" className="fas fa-envelope-open" /> {email}
					</li>
				)}
                {phone && (
					<li>
						<i data-testid="phone-icon" className="fas fa-phone" /> {phone}
					</li>
				)}
			</ul>
            <p>
                <button className="btn btn-dark btn-sm" onClick={onEdit}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
            </p>
		</div>
	);
};

ContactItem.propTypes = {
    contact: PropTypes.object.isRequired
}


export default ContactItem;
