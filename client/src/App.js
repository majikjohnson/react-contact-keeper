import React, { Fragment } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import About from './components/pages/About';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ContactState from './context/contacts/ContactState';
import AuthState from './context/auth/AuthState';

const App = () => {
	return (
		<AuthState>
			<ContactState>
				<Router>
					<Fragment>
						<Navbar />
						<div className="container">
							<Switch>
								<Route exact path="/" component={Home} />
								<Route exact path="/About" component={About} />
							</Switch>
						</div>
					</Fragment>
				</Router>
			</ContactState>
		</AuthState>
	);
};

export default App;
