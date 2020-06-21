import React, { Component } from 'react'

import axios from 'axios'
import { GET_TOKEN, CREATE_USER, LOGOUT_USER, USER_DETAIL } from './types'
import { FETCH_POSTS_URL, REFRESH_TOKEN_URL, USER_DETAIL_URL } from '../other/urls';
import { ACCESS_TOKEN } from '../other/constants';


const Context = React.createContext();


const reducer = (state, action) => {
    switch(action.type) {
        case GET_TOKEN:   // login
        case CREATE_USER: // register
        case USER_DETAIL:
            return {
                ...state,
                user: {
                    isAuthenticated: true,
                    username: action.payload
                }
            }
        
        case LOGOUT_USER:
            return {
                ...state,
                user: {
                    isAuthenticated: false,
                    username: null
                }
            }
        
        default:
            return state
    }
}


export class Provider extends Component {
    // initial state
    state = {
        // fetched posts
        posts: [],
        
        // user's attributes
        user: {
            isAuthenticated: false,
            username: null
        },

        // dispatch method
        dispatch: action => {
            this.setState(state => reducer(state, action))
        }
    }


    async componentDidMount() {
        // get latest posts
        let response = await axios.get(FETCH_POSTS_URL)
        this.setState({posts: response.data.results});

        // refresh token
        const refresh_token = {
            refresh: localStorage.getItem('refresh')
        };

        if (refresh_token.refresh) {
            try {
                response = await axios.post(REFRESH_TOKEN_URL, refresh_token);
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                this.state.dispatch({
                    type: GET_TOKEN
                });
            } catch(err) {
                // `refresh token` is invalid (401 error)
                // or it doesn't exist in localStorage (400 error)
                // user must login and get access, refresh tokens
                console.log(err.message);
            }
        }

        // access token
        const access_token = localStorage.getItem('access');

        if (access_token) {
            try {
                const headers = { Authorization: `Bearer ${access_token}` };
                response = await axios.post(USER_DETAIL_URL, {}, {
                    headers: {
                        authorization: `Bearer ${access_token}`
                    }
                });

                this.state.dispatch({
                    type: USER_DETAIL,
                    payload: response.data.user.username
                });
            } catch(err) {
                console.log(err.response);
            }
        }
    }


    render() {
        return (
            <Context.Provider value={this.state}>
                { this.props.children }
            </Context.Provider>
        )
    }
}


export const Consumer = Context.Consumer
