import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Posts from './component/post/posts';
import Post from './component/post/post';
import Login from './component/user/login';
import Register from './component/user/register';
import Header from './component/layout/header';
import CreatePost from './component/post/create_post';

import PrivateRoute from './other/private_route';
import { Provider } from './context/context';


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
								{/* <Route exact path="/post/new" component={CreatePost} /> */}
								<PrivateRoute exact path="/post/new" component={CreatePost} />
								<Route exact path="/post/:slug" component={Post} />
								<Route exact path="/" component={Posts} />
								{/* <Route exact path="/post/:slug/edit" component={EditPost} /> */}
							</Switch>
						</div>
					</div>
				</Router>
			</Provider>
		)
	}
}

export default App;