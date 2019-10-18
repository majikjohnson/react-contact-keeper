import React, { useState, useContext } from 'react';
import AlertContext from '../../context/alerts/AlertContext';

const Register = () => {
	const [user, setUser] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});

	const { name, email, password, password2 } = user;

	const alertContext = useContext(AlertContext);

	const { setAlert } = alertContext;

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
			setAlert('Password doesn\'t match Password Confirmation', 'danger');
		} else {
			console.log('User Registered');
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
						type="text"
						name="name"
						value={name}
						onChange={onChange}
					/>
				</div>
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
				<div className="form-group">
					<label htmlFor="password2">Confirm Password</label>
					<input
						type="password"
						name="password2"
						value={password2}
						onChange={onChange}
					/>
				</div>
				<input
					type="submit"
					value="Register"
					className="btn btn-primary btn-block"
				/>
			</form>
		</div>
	);
};

export default Register;
