import React, { Fragment, useContext } from 'react';
import ContactContext from '../../context/contacts/ContactContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ContactItem from './ContactItem';

const Contacts = () => {
	const contactContext = useContext(ContactContext);
	const { contacts, filtered } = contactContext;

	if (contacts.length === 0) {
		return <h3>Please add a contact</h3>;
	}

	return (
		<Fragment>
			<TransitionGroup>
				{filtered !== null
					? filtered.map(contact => (
							<CSSTransition
								key={contact.id}
								timeout={500}
								classNames="item"
							>
								<ContactItem contact={contact} />
							</CSSTransition>
					  ))
					: contacts.map(contact => (
							<CSSTransition
								key={contact.id}
								timeout={500}
								classNames="item"
							>
								<ContactItem contact={contact} />
							</CSSTransition>
					  ))}
			</TransitionGroup>
		</Fragment>
	);
};

export default Contacts;
