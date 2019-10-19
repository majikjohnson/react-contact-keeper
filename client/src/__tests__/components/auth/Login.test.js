import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createMemoryHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from '../../../components/routing/PrivateRoute';
import Login from '../../../components/auth/Login';
import Home from '../../../components/pages/Home';
import Navbar from '../../../components/layout/Navbar';
import Alerts from '../../../components/layout/Alerts';
import AuthState from '../../../context/auth/AuthState';
import AlertState from '../../../context/alerts/AlertState';
import ContactState from '../../../context/contacts/ContactState';

const renderLoginForm = () => {
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
};

const tokenResp = {
	token:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ5NzVjZjM2N2ZkMGUxYzU4MzgzZDI2In0sImlhdCI6MTU3MTUxNDUzNywiZXhwIjoxNTcxNTE4MTM3fQ.sLxwMREuyxNkw3DAxNGVnWHIetS09ee77nvcVL3ZUOs',
};

const userResp = {
	user: {
		_id: '5d975cf367fd0e1c58383d26',
		name: 'Harry Potter',
		email: 'hpotter@nascentpixels.io',
		date: '2019-10-04T14:53:39.270Z',
		__v: 0,
	},
};

describe('UserLogin', () => {
	it('should login successfully', async () => {
		const mock = new MockAdapter(axios);
		mock.onPost('/api/auth').reply(200, tokenResp);
		mock.onGet('/api/auth').reply(200, userResp);

		const { getByTestId, getByText } = renderLoginForm();

		userEvent.type(getByTestId('login-email'), 'hpotter@nascentpixels.io');
		userEvent.type(getByTestId('login-password'), 'abc123');
		userEvent.click(getByTestId('login-submit'));

		await waitForElement(() => getByText(/Hello\sHarry/));
		expect(getByTestId('form-title')).toHaveTextContent('Add Contact');
	});

	it('should display error if password is incorrect', async () => {
		const mock = new MockAdapter(axios);
		mock.onPost('/api/auth').reply(400, {
			msg: 'Incorrect password',
		});

		const { getByTestId, getByText } = renderLoginForm();

		userEvent.type(getByTestId('login-email'), 'hpotter@nascentpixels.io');
		userEvent.type(getByTestId('login-password'), 'xxxxxx');
		userEvent.click(getByTestId('login-submit'));

		await waitForElement(() => getByText(/Incorrect password/));
		expect(getByTestId('login-page'));
	});

	it("should display error if user doesn't exist", async () => {
		const mock = new MockAdapter(axios);
		mock.onPost('/api/auth').reply(400, {
			msg: "User doesn't exist",
		});

		const { getByTestId, getByText } = renderLoginForm();

		userEvent.type(getByTestId('login-email'), 'xxxxxx@nascentpixels.io');
		userEvent.type(getByTestId('login-password'), 'abc123');
		userEvent.click(getByTestId('login-submit'));

		await waitForElement(() => getByText(/User doesn\'t exist/));
		expect(getByTestId('login-page'));
	});

	it('should display error if email address is missing', () => {
		const { getByTestId, getByText } = renderLoginForm();

		userEvent.type(getByTestId('login-password'), 'abc123');
		userEvent.click(getByTestId('login-submit'));

		expect(getByText(/You must enter a valid email and password/));
		expect(getByTestId('login-page'));
	});

	it('should display error if password is missing', () => {
		const { getByTestId, getByText } = renderLoginForm();

		userEvent.type(getByTestId('login-email'), 'hpotter@nascentpixels.io');
		userEvent.click(getByTestId('login-submit'));

		expect(getByText(/You must enter a valid email and password/));
		expect(getByTestId('login-page'));
	});

	it('should display error if email and password are missing', () => {
		const { getByTestId, getByText } = renderLoginForm();

		userEvent.click(getByTestId('login-submit'));

		expect(getByText(/You must enter a valid email and password/));
		expect(getByTestId('login-page'));
	});
});
