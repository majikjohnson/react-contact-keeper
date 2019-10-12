import React from 'react';
import PropTypes from 'prop-types';

const ContactItem = ({ contact }) => {
	const { name, email, phone, type } = contact;

	return (
		<div className="card bg-light">
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
                <button className="btn btn-dark btn-sm">Edit</button>
                <button className="btn btn-danger btn-sm">Delete</button>
            </p>
		</div>
	);
};

ContactItem.propTypes = {
    contact: PropTypes.object.isRequired
}


export default ContactItem;
