import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createMemoryHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from '../../../components/routing/PrivateRoute';
import Register from '../../../components/auth/Register';
import Home from '../../../components/pages/Home';
import Navbar from '../../../components/layout/Navbar';
import Alerts from '../../../components/layout/Alerts';
import AuthState from '../../../context/auth/AuthState';
import AlertState from '../../../context/alerts/AlertState';
import ContactState from '../../../context/contacts/ContactState';

const renderRegistrationForm = () => {
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

describe('Register User', () => {
	it('should allow user to register successfully', async () => {
		const mock = new MockAdapter(axios);

		mock.onPost('/api/users').reply(200, tokenResp);
		mock.onGet('/api/auth').reply(200, userResp);

		const { getByTestId, getByText } = renderRegistrationForm();

		userEvent.type(getByTestId('register-name'), 'Harry Potter');
		userEvent.type(getByTestId('register-email'), 'hpotter@nascentpixels.io');
		userEvent.type(getByTestId('register-password'), 'abc123');
		userEvent.type(getByTestId('register-password2'), 'abc123');
		userEvent.click(getByTestId('submit-register'));

		await waitForElement(() => getByText(/Hello\sHarry/));
	});

	it('should display an error if name field is missing', () => {
		const { getByTestId, getByText } = renderRegistrationForm();

		userEvent.type(getByTestId('register-email'), 'hpotter@nascentpixels.io');
		userEvent.type(getByTestId('register-password'), 'abc123');
		userEvent.type(getByTestId('register-password2'), 'abc123');
		userEvent.click(getByTestId('submit-register'));

		expect(getByText(/You must fill in all form fields/));
	});

	it('should display an error if email field is missing', () => {
		const { getByTestId, getByText } = renderRegistrationForm();

		userEvent.type(getByTestId('register-name'), 'Harry Potter');
		userEvent.type(getByTestId('register-password'), 'abc123');
		userEvent.type(getByTestId('register-password2'), 'abc123');
		userEvent.click(getByTestId('submit-register'));

		expect(getByText(/You must fill in all form fields/));
	});

	it('should display an error if password field is missing', () => {
		const { getByTestId, getByText } = renderRegistrationForm();

		userEvent.type(getByTestId('register-name'), 'Harry Potter');
		userEvent.type(getByTestId('register-email'), 'hpotter@nascentpixels.io');
		userEvent.type(getByTestId('register-password2'), 'abc123');
		userEvent.click(getByTestId('submit-register'));

		expect(getByText(/You must fill in all form fields/));
	});

	it('should display an error if password confirmation field is missing', () => {
		const { getByTestId, getByText } = renderRegistrationForm();

		userEvent.type(getByTestId('register-name'), 'Harry Potter');
		userEvent.type(getByTestId('register-email'), 'hpotter@nascentpixels.io');
		userEvent.type(getByTestId('register-password'), 'abc123');
		userEvent.click(getByTestId('submit-register'));

		expect(getByText(/You must fill in all form fields/));
	});

	it('should display an error if password is too short', () => {
		const { getByTestId, getByText } = renderRegistrationForm();

		userEvent.type(getByTestId('register-name'), 'Harry Potter');
		userEvent.type(getByTestId('register-email'), 'hpotter@nascentpixels.io');
		userEvent.type(getByTestId('register-password'), 'abc12');
		userEvent.type(getByTestId('register-password2'), 'abc12');
		userEvent.click(getByTestId('submit-register'));

		expect(getByText(/Password must be at least 6 characters long/));
	});

	it("should display an error if password doesn't match password confirmation", () => {
		const { getByTestId, getByText } = renderRegistrationForm();

		userEvent.type(getByTestId('register-name'), 'Harry Potter');
		userEvent.type(getByTestId('register-email'), 'hpotter@nascentpixels.io');
		userEvent.type(getByTestId('register-password'), 'abc123');
		userEvent.type(getByTestId('register-password2'), 'abc124');
		userEvent.click(getByTestId('submit-register'));

		expect(getByText(/Password doesn't match Password Confirmation/));
	});

	it('should display an error user already exists', async () => {
		const mock = new MockAdapter(axios);
		mock.onPost('/api/users').reply(400, {
			msg: 'User already exists in database',
		});

		const { getByTestId, getByText } = renderRegistrationForm();

		userEvent.type(getByTestId('register-name'), 'Harry Potter');
		userEvent.type(getByTestId('register-email'), 'hpotter@nascentpixels.io');
		userEvent.type(getByTestId('register-password'), 'abc123');
		userEvent.type(getByTestId('register-password2'), 'abc123');
		userEvent.click(getByTestId('submit-register'));

		await waitForElement(() =>
			getByText(/User already exists in database/)
		);
	});
});
