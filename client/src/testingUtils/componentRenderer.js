import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from '../components/routing/PrivateRoute';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Home from '../components/pages/Home';
import Navbar from '../components/layout/Navbar';
import Alerts from '../components/layout/Alerts';
import Contacts from '../components/contacts/Contacts';
import ContactItem from '../components/contacts/ContactItem';
import ContactForm from '../components/contacts/ContactForm';
import ContactFilter from '../components/contacts/ContactFilter';
import AuthState from '../context/auth/AuthState';
import AlertState from '../context/alerts/AlertState';
import ContactState from '../context/contacts/ContactState';

const componentRenderer = {
	homePageWithLogin: () => {
		const history = createMemoryHistory();
		history.push('/');

		return render(
			<AuthState>
				<ContactState>
					<AlertState>
						<Router history={history}>
							<Navbar />
							<Alerts />
							<Switch>
								<Route exact path="/Login" component={Login} />
								<PrivateRoute exact path="/" component={Home} />
							</Switch>
						</Router>
					</AlertState>
				</ContactState>
			</AuthState>
		);
	},
	loginPage: () => {
		const history = createMemoryHistory();

		history.push('/Login');
		return render(
			<AuthState>
				<ContactState>
					<AlertState>
						<Router history={history}>
							<Navbar />
							<Alerts />
							<Switch>
								<Route exact path="/Login" component={Login} />
								<PrivateRoute exact path="/" component={Home} />
							</Switch>
						</Router>
					</AlertState>
				</ContactState>
			</AuthState>
		);
	},
	registerPage: () => {
		const history = createMemoryHistory();
		history.push('/Register');

		return render(
			<AuthState>
				<ContactState>
					<AlertState>
						<Router history={history}>
							<Navbar />
							<Alerts />
							<Switch>
								<Route exact path="/Register" component={Register} />
								<PrivateRoute exact path="/" component={Home} />
							</Switch>
						</Router>
					</AlertState>
				</ContactState>
			</AuthState>
		);
	},
	contactItem: contact => {
		return render(
			<ContactState>
				<ContactItem contact={contact} />
			</ContactState>
		);
	},
	contacts: () => {
		return render(
			<ContactState>
				<div>
					<Contacts />
				</div>
			</ContactState>
		);
	},
	contactFilterWithContacts: () => {
		return render(
			<ContactState>
				<div>
					<ContactFilter />
					<Contacts />
				</div>
			</ContactState>
		);
	},
	contactForm: () => {
		return render(
			<ContactState>
				<ContactForm />
			</ContactState>
		);
	},
	contactFormWithContacts: () => {
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
	},
};

export default componentRenderer;
