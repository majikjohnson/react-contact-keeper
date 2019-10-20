import { waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import componentRenderer from '../../../testingUtils/componentRenderer';

describe('UserLogin', () => {
	it('should login successfully', async () => {
		const tokenResp = {
			token:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ5NzVjZjM2N2ZkMGUxYzU4MzgzZDI2In0sImlhdCI6MTU3MTUxNDUzNywiZXhwIjoxNTcxNTE4MTM3fQ.sLxwMREuyxNkw3DAxNGVnWHIetS09ee77nvcVL3ZUOs',
		};
	
		const userResp = {
			user: {
				_id: '5d975cf367fd0e1c58383d26',
				name: 'Harry Potter',
				email: 'hpotter@hogwarts.io',
				date: '2019-10-04T14:53:39.270Z',
				__v: 0,
			},
		};
		
		const mock = new MockAdapter(axios);
		mock.onPost('/api/auth').reply(200, tokenResp);
		mock.onGet('/api/auth').reply(200, userResp);

		const { getByTestId, getByText } = componentRenderer.loginPage();

		userEvent.type(getByTestId('login-email'), 'hpotter@hogwarts.io');
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

		const { getByTestId, getByText } = componentRenderer.loginPage();

		userEvent.type(getByTestId('login-email'), 'hpotter@hogwarts.io');
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

		const { getByTestId, getByText } = componentRenderer.loginPage();

		userEvent.type(getByTestId('login-email'), 'hpotter@hogwarts.io');
		userEvent.type(getByTestId('login-password'), 'abc123');
		userEvent.click(getByTestId('login-submit'));

		await waitForElement(() => getByText(/User doesn\'t exist/));
		expect(getByTestId('login-page'));
	});

	it('should display error if email address is missing', () => {
		const { getByTestId, getByText } = componentRenderer.loginPage();

		userEvent.type(getByTestId('login-password'), 'abc123');
		userEvent.click(getByTestId('login-submit'));

		expect(getByText(/You must enter a valid email and password/));
		expect(getByTestId('login-page'));
	});

	it('should display error if password is missing', () => {
		const { getByTestId, getByText } = componentRenderer.loginPage();

		userEvent.type(getByTestId('login-email'), 'hpotter@hogwarts.io');
		userEvent.click(getByTestId('login-submit'));

		expect(getByText(/You must enter a valid email and password/));
		expect(getByTestId('login-page'));
	});

	it('should display error if email and password are missing', () => {
		const { getByTestId, getByText } = componentRenderer.loginPage();

		userEvent.click(getByTestId('login-submit'));

		expect(getByText(/You must enter a valid email and password/));
		expect(getByTestId('login-page'));
	});
});
