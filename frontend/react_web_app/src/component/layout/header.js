import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import { Consumer } from '../../context/context';
import { LOGOUT_USER } from '../../context/types';


class Header extends Component {
    
    logout = dispatch => e => {
        // remove access and refresh tokens from localStorage
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');

        dispatch({
            type: LOGOUT_USER
        });
    }


    render() {
        return (
            <Consumer>
                { value => {
                    const { dispatch, user } = value;

                    return (
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <Link to="/" className="navbar-brand">Blog</Link>

                            <div className="collapse navbar-collapse" id="navbarToggler">
                                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                                    <li className="nav-item active">
                                        <Link to="/" className="nav-link">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/post/new" className="nav-link">New Post</Link>
                                    </li>
                                </ul>

                                {/* show login, register links is user is unathenticated */}
                                { !user.isAuthenticated ? (
                                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                                        <li className="nav-item">
                                            <Link to="/user/login" className="nav-link">Login</Link>
                                        </li>
                                        <li className="nav-item">
                                        <Link to="/user/register" className="nav-link">Register</Link>
                                        </li>
                                    </ul>
                                ): (
                                    // show logout link if user is authenticated
                                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                                        <li className="nav-item">
                                            <Link to="#" className="nav-link" onClick={this.logout(dispatch)}>Logout</Link>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </nav>
                    )
                }}
            </Consumer>
        )
    }
}


export default Header;