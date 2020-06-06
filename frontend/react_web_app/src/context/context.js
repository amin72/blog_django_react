import React, { Component } from 'react'
// import { DELETE_POST, ADD_POST, EDIT_POST } from './types'

import axios from 'axios'


const Context = React.createContext()

const reducer = (state, action) => {
    switch(action.type) {
        default:
            return state
    }
}


export class Provider extends Component {
    state = {
        posts: [],
        dispatch: action => {
            this.setState(state => reducer(state, action))
        }
    }


    async componentDidMount() {
        const url = 'http://localhost:8000/api/v1/posts/'

        const response = await axios.get(url);
        this.setState({posts: response.data.results});
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
