import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import ContactContext from '../../context/contacts/ContactContext';

const Navbar = ({ title, icon }) => {
	const authContext = useContext(AuthContext);
	const contactContext = useContext(ContactContext);

	const { isAuthenticated, logout, user } = authContext;
	const { clearContacts } = contactContext;

	const onLogout = () => {
		logout();
		clearContacts();
	};

	const authLinks = (
		<Fragment>
			<li data-testid="user-greeting">Hello {user && user.name.split(' ')[0]} | </li>
			<li>
				<a href="#!" onClick={onLogout}>
					<i className="fas fa-sign-out-alt" />
					<span className="hide-sm">Logout</span>
				</a>
			</li>
		</Fragment>
	);

	const guestLinks = (
		<Fragment>
			<li>
				<Link to="/Login">Login</Link>
			</li>
			<li>
				<Link to="/Register">Register</Link>
			</li>
			<li>
				<Link to="/About">About</Link>
			</li>
		</Fragment>
	);

	return (
		<div className="navbar bg-primary">
			<h1>
				<i className={icon} /> {title}
			</h1>
			<ul>{isAuthenticated ? authLinks : guestLinks}</ul>
		</div>
	);
};

Navbar.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
};

Navbar.defaultProps = {
	title: 'Contact Keeper',
	icon: 'fas fa-id-card-alt',
};

export default Navbar;
