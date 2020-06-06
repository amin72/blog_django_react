import React, { Component } from 'react';

import Posts from './component/post/posts';
import Post from './component/post/post';
import Login from './component/user/login';
import Register from './component/user/register';
import Header from './component/layout/header';

import { Provider } from './context/context'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


class App extends Component {
	render() {
		return (
			<Provider>
				<Router>
					<div className="App">
						<Header />

						<div className="container">
							<Switch>
								<Route exact path="/user/login" component={Login} />
								<Route exact path="/user/register" component={Register} />
								<Route exact path="/" component={Posts} />
								<Route exact path="/post/:slug" component={Post} />
							</Switch>
						</div>
					</div>
				</Router>
			</Provider>
		)
	}
}

export default App;
