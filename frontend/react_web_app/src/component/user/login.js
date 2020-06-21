import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

import { Consumer } from '../../context/context';
import { GET_TOKEN } from '../../context/types';


class Login extends Component {
    state = {
        username: '',
        password: '',
    }
    
    
    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }
    

    onSubmit = (dispatch) => e => {
        e.preventDefault()
        
        const url = 'http://127.0.0.1:8000/api/v1/token/';
        const data = {
            username: this.state.username,
            password: this.state.password,
        };

        axios.post(url, data)
            .then(res => res.data)
            .then(data => {
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);

                dispatch({
                    type: GET_TOKEN,
                    payload: this.state.username
                })
            }).catch(err => 
                console.log("Wrong username/password!")
            )
    }


    render() {
        const {username, password} = this.state;

        return (
            <Consumer>
                { value => {
                    const { dispatch, user } = value;

                    return user.isAuthenticated ? (
                        // if user is authenticated redirect to index
                        <Redirect to="/" />
                    ) : (
                        <div className="col-md-6 m-auto">
                            <div className="card card-body mt-5">
                                <h2 className="text-center">Login</h2>

                                <form onSubmit={this.onSubmit(dispatch)}>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="username"
                                            onChange={this.onChange}
                                            value={username}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            className="form-control"
                                            type="password"
                                            name="password"
                                            onChange={this.onChange}
                                            value={password}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary">Login</button>
                                    </div>

                                    <p>Don't have an account? <Link to="/user/register">Register</Link></p>
                                </form>
                            </div>
                        </div>
                    )
                }}
            </Consumer>
        )
    }
}


export default Login;