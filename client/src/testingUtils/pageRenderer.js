import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from '../components/routing/PrivateRoute';
import Login from '../components/auth/Login';
import Home from '../components/pages/Home';
import Navbar from '../components/layout/Navbar';
import Alerts from '../components/layout/Alerts';
import AuthState from '../context/auth/AuthState';
import AlertState from '../context/alerts/AlertState';
import ContactState from '../context/contacts/ContactState';

const pageRenderer = {
	renderHomePage: () => {
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
};

export default pageRenderer;
