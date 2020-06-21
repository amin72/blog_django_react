import React, {Component} from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

import { Consumer } from '../../context/context';
import { GET_TOKEN } from '../../context/types';


class Register extends Component {
    state = {
        username: '',
        email: '',
        password1: '',
        password2: '',
    }
    
    
    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }
    

    onSubmit = (dispatch) => e => {
        e.preventDefault()

        if (this.state.username.length === 0 && this.state.email.length === 0 &&
            this.state.password1.length === 0 && this.state.password2.length === 0) {
            // empty fields
            console.log('Fields can not be empty!');
            return;
        }
        
        if (this.state.password1 !== this.state.password2) {
            console.log("Passwords do not match!");
            
            this.setState({
                password1: '',
                password2: ''
            })

            return;
        }

        const registerUrl = 'http://127.0.0.1:8000/api/v1/users/register/';
        const registerData = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password1,
        };

        axios.post(registerUrl, registerData)
            .then(res => res.data)
            .then(data => {
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);

                dispatch({
                    type: GET_TOKEN,
                })
            }).catch(err => {
                const messages = err.response.data;
                console.log(messages);
            });
    }


    render() {
        const {username, email, password1, password2} = this.state;

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
                                <h2 className="text-center">Register</h2>

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
                                        <label>Email</label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            name="email"
                                            onChange={this.onChange}
                                            value={email}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            className="form-control"
                                            type="password"
                                            name="password1"
                                            onChange={this.onChange}
                                            value={password1}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password (repeat)</label>
                                        <input
                                            className="form-control"
                                            type="password"
                                            name="password2"
                                            onChange={this.onChange}
                                            value={password2}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary">Register</button>
                                    </div>

                                    <p>Already have an account? <Link to="/user/register">Login</Link></p>
                                </form>
                            </div>
                        </div>
                    )
                }}
            </Consumer>
        )
    }
}


export default Register;