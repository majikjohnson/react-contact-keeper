import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alerts/AlertContext';
import AuthContext from '../../context/auth/AuthContext';

const Register = props => {
	const [user, setUser] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});

	const alertContext = useContext(AlertContext);
	const authContext = useContext(AuthContext);

	const { name, email, password, password2 } = user;
	const { setAlert } = alertContext;
	const { register, error, clearErrors, isAuthenticated } = authContext;

	useEffect(() => {
		if (isAuthenticated) {
			props.history.push('/');
		}

		if (error === 'User already exists in database') {
			setAlert(error, 'danger');
			clearErrors();
		}
		// eslint-disable-next-line
	}, [error, isAuthenticated, props.history]);

	const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

	const onSubmit = e => {
		e.preventDefault();
		if (
			name === '' ||
			email === '' ||
			password === '' ||
			password2 === ''
		) {
			setAlert('You must fill in all form fields', 'danger');
		} else if (password.length < 6 || password2.length < 6) {
			setAlert('Password must be at least 6 characters long', 'danger');
		} else if (password !== password2) {
			setAlert("Password doesn't match Password Confirmation", 'danger');
		} else {
			register({
				name,
				email,
				password,
			});
		}
	};

	return (
		<div className="form-container">
			<h1>
				Account <span className="text-primary">Register</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="name">Name</label>
					<input
						data-testid="register-name"
						type="text"
						name="name"
						value={name}
						onChange={onChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						data-testid="register-email"
						type="email"
						name="email"
						value={email}
						onChange={onChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						data-testid="register-password"
						type="password"
						name="password"
						value={password}
						onChange={onChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password2">Confirm Password</label>
					<input
						data-testid="register-password2"
						type="password"
						name="password2"
						value={password2}
						onChange={onChange}
					/>
				</div>
				<input
					data-testid="submit-register"
					type="submit"
					value="Register"
					className="btn btn-primary btn-block"
				/>
			</form>
		</div>
	);
};

export default Register;
