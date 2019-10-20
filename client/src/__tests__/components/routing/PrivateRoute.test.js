import { waitForElement } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import componentRenderer from '../../../testingUtils/componentRenderer';

describe('Private Routes', () => {
	it('should redirect user from home page to login page if user is not logged in', async () => {
		const mock = new MockAdapter(axios);
		mock.onGet('/api/auth').reply(401, {
			msg: 'No auth token.  Access Denied.',
		});

		const { getByTestId } = componentRenderer.homePageWithLogin();

		await waitForElement(() => getByTestId('login-page'));
	});
});
