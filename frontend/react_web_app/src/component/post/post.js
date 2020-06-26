import React, {Component, Fragment} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Consumer } from '../../context/context';
import { to_jalali } from '../../other/date_convertor';

import {
    DELETE_POST_SUCCESS,
    DELETE_POST_FAIL
} from '../../context/types';


class Post extends Component {
    signal = axios.CancelToken.source();


    state = {
        post: null
    }

    
    deletePost = async (slug, dispatch, authenticate) => {
        // authenticate user
        await authenticate();
        
        // access token
        const access_token = localStorage.getItem('access');
        const url = `http://127.0.0.1:8000/api/v1/posts/${slug}/`;

        if (access_token) {
            try {
                await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });

                dispatch({
                    type: DELETE_POST_SUCCESS
                });

                // redirect to home page
                this.props.history.push('/');
            } catch(err) {
                dispatch({
                    type: DELETE_POST_FAIL
                });
            }
        }
    }


    fetchPost = async () => {
        // access token
        const { slug } = this.props.match.params;
        const url = `http://127.0.0.1:8000/api/v1/posts/${slug}/`;
        
        try {
            const response = await axios.get(url, {
                cancelToken: this.signal.token,
            });
            
            const post = response.data;

            this.setState({
                post: post,
            });
        } catch(err) {
            console.log(err);
        }
    }


    componentDidMount() {
        this.fetchPost();
    }


    componentWillUnmount() {
        this.signal.cancel('Api is being canceled');
    }


    render() {
        const { slug } = this.props.match.params;

        return (
            <Consumer>
                { value => {

                    const { user, dispatch } = value.state;
                    const { authenticate } = value;
                    const { post } = this.state;

                    return (
                        <Fragment>
                            {post ? (
                                <div>
                                    <div className="row mt-5 mb-3">
                                        <div className="col-12">
                                            <img className="post-img img-fluid d-block mx-auto" src={post.image} alt={post.title} />
                                            <h1 className="mt-5">{post.title}</h1>
                                            <span>Author: {post.author}</span>
                                            <p className="mt-3">{post.content}</p>
                                            <span>Created at: {to_jalali(post.created)}</span>
                                        </div>
                                    </div>
                                    
                                    {user.isAuthenticated && user.username === post.author && (
                                    // if user is logged in and owner of the post then
                                    // show edit and delete buttons
                                    <div className="row mb-5">
                                        <div className="col-12">
                                            <hr />
                                            <Link to={`/post/${post.slug}/edit`} className="btn btn-success mr-2">Edit Post</Link>
                                            <button onClick={() => this.deletePost(slug, dispatch, authenticate)} className="btn btn-danger">Delete Post</button>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            ) : null }
                        </Fragment>
                    )
                }}
            </Consumer>
        )
    }
}


export default Post;