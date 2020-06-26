import React, { Component } from 'react'

import axios from 'axios'

import {
    GET_TOKEN_SUCCESS,
    CREATE_USER_SUCCESS,
    LOGOUT_USER_SUCCESS,
    GET_USER_DETAIL_SUCCESS,
    GET_USER_DETAIL_FAIL,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_FAIL,
    FETCH_POSTS_SUCCESS,
} from './types'

import { USER_DETAIL_URL, REFRESH_TOKEN_URL } from '../other/urls';


export const Context = React.createContext();


const reducer = (state, action) => {
    switch(action.type) {
        case GET_TOKEN_SUCCESS:   // login
        case CREATE_USER_SUCCESS: // register
        case GET_USER_DETAIL_SUCCESS: // user detail
            return {
                ...state,
                user: {
                    isAuthenticated: true,
                    username: action.payload
                }
            }
        
        case LOGOUT_USER_SUCCESS:
            return {
                ...state,
                user: {
                    isAuthenticated: false,
                    username: null
                }
            }
        
        case FETCH_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.payload
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


    componentDidMount() {
        this.authenticate();
    }


    getUserDetail = async (access_token) => {
        const { dispatch } = this.state;

        if (access_token) {
            try {
                const response = await axios.post(USER_DETAIL_URL, {}, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                const username = response.data.user.username;

                dispatch({
                    type: GET_USER_DETAIL_SUCCESS,
                    payload: username
                });

                return true; // authentication was successfull
            } catch(err) {
                dispatch({
                    type: GET_USER_DETAIL_FAIL
                });
            };
        }

        return false;
    }


    refreshAccessToken = async (refresh_token) => {
        const { dispatch } = this.state;

        if (refresh_token) {
            const refresh_data = {
                refresh: refresh_token
            };

            try {
                const response = await axios.post(REFRESH_TOKEN_URL, refresh_data);
                const access_token = response.data.access;
                localStorage.setItem('access', access_token);
                
                dispatch({
                    type: REFRESH_TOKEN_SUCCESS
                });

                return access_token;
            } catch(err) {
                // TODO: diplay a message, and remove username from state
                dispatch({
                    type: REFRESH_TOKEN_FAIL
                });
            }
        }
        
        return null;
    }


    authenticate = async () => {
        // try to authenticate user
        let access_token = localStorage.getItem('access');

        if (await this.getUserDetail(access_token)) {
            return true;
        }

        // refresh token
        const refresh_token = localStorage.getItem('refresh');
        // get new access token
        access_token = await this.refreshAccessToken(refresh_token);

        // try to authenticate user with new access token
        await this.getUserDetail(access_token);
    }


    render() {
        const contextState = {
            state: this.state,
            authenticate: this.authenticate
        };

        return (
            <Context.Provider value={contextState}>
                { this.props.children }
            </Context.Provider>
        );
    }
}


export const Consumer = Context.Consumer;