import React, { Component } from 'react'

import axios from 'axios'

import {
    GET_TOKEN_SUCCESS,
    GET_TOKEN_FAIL,
    CREATE_USER_SUCCESS,
    CREATE_USER_FAIL,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    GET_USER_DETAIL_SUCCESS,
    GET_USER_DETAIL_FAIL,
    FETCH_POSTS_SUCCESS,
    FETCH_POSTS_FAIL,
} from './types'

import { USER_DETAIL_URL, FETCH_POSTS_URL } from '../other/urls';


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


    authenticate = async () => {
        const { dispatch } = this.state;

        // access token
        const access_token = localStorage.getItem('access');

        if (access_token) {
            await axios.post(USER_DETAIL_URL, {}, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            .then(res => {
                const username = res.data.user.username;
                
                dispatch({
                    type: GET_USER_DETAIL_SUCCESS,
                    payload: username
                });

                sessionStorage.user = JSON.stringify({name: username});
            }).catch(err => {
                dispatch({
                    type: GET_USER_DETAIL_FAIL
                })
            })
        }
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