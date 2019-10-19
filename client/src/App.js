import React, { Fragment } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/routing/PrivateRoute';
import About from './components/pages/About';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import setAuthToken from './utils/setAuthToken';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ContactState from './context/contacts/ContactState';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alerts/AlertState';

if(localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	return (
		<AuthState>
			<ContactState>
				<AlertState>
					<Router>
						<Fragment>
							<Navbar />
							<div className="container">
								<Alerts />
								<Switch>
									<PrivateRoute exact path="/" component={Home} />
									<Route exact path="/About" component={About} />
									<Route exact path="/Register" component={Register} />
									<Route exact path="/Login" component={Login} />
								</Switch>
							</div>
						</Fragment>
					</Router>
				</AlertState>
			</ContactState>
		</AuthState>
	);
};

export default App;
