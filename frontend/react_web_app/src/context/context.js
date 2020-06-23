import React, { Component } from 'react'

import axios from 'axios'
import { GET_TOKEN, CREATE_USER, LOGOUT_USER, USER_DETAIL, FETCH_POSTS_SUCCESS } from './types'
import { USER_DETAIL_URL } from '../other/urls';


export const Context = React.createContext();


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
                
                this.state.dispatch({
                    type: USER_DETAIL,
                    payload: username
                });

                sessionStorage.user = JSON.stringify({name: username});
            }).catch(err => console.log(err.response))
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