import React, {Component} from 'react';
import { Link } from 'react-router-dom';


class Header extends Component {
    render() {
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
                    </ul>
                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link to="/user/login" className="nav-link">Login</Link>
                        </li>
                        <li className="nav-item">
                        <Link to="/user/register" className="nav-link">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/user/logout" className="nav-link">Logout</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}


export default Header;