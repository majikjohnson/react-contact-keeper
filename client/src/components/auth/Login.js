import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alerts/AlertContext';
import AuthContext from '../../context/auth/AuthContext';

const Login = props => {
	const [user, setUser] = useState({
		email: '',
		password: '',
	});

	const alertContext = useContext(AlertContext);
	const authContext = useContext(AuthContext);

	const { email, password } = user;
	const { setAlert } = alertContext;
	const { login, error, clearErrors, isAuthenticated } = authContext;

	useEffect(() => {
		if (isAuthenticated) {
			props.history.push('/');
		}

		if (error === "User doesn't exist" || error === 'Incorrect password') {
			setAlert(error, 'danger');
			clearErrors();
		}
		// eslint-disable-next-line
	}, [error, isAuthenticated, props.history]);

	const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = e => {
		e.preventDefault();
		if (email === '' || password === '') {
			setAlert('You must enter a valid email and password', 'danger');
		} else {
			login({
				email,
				password,
			});
		}
	};

	return (
		<div className="form-container">
			<h1>
				Account <span className="text-primary">Login</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={onChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={onChange}
					/>
				</div>
				<input
					type="submit"
					value="Log In"
					className="btn btn-primary btn-block"
				/>
			</form>
		</div>
	);
};

export default Login;
