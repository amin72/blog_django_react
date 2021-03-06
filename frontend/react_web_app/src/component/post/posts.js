import React, {Component, Fragment} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Context, Consumer } from '../../context/context';
import { to_jalali } from '../../other/date_convertor';
import { FETCH_POSTS_URL } from '../../other/urls';
import { FETCH_POSTS_SUCCESS, FETCH_POSTS_FAIL } from '../../context/types';


class Posts extends Component {
    // TODO: load next pages
    fetchPosts = async (dispatch, page=1) => {
        const response = await axios.get(FETCH_POSTS_URL);

        try {
            const posts = response.data.results;

            dispatch({
                type: FETCH_POSTS_SUCCESS,
                payload: posts
            })
        } catch(err) {
            dispatch({
                type: FETCH_POSTS_FAIL,
            });
        }
    }


    componentDidMount() {
        // get latest posts
        const { dispatch } = this.context.state;
        this.fetchPosts(dispatch);
    }


    render() {
        return (
            <Consumer>
            {
                value => {
                    const { posts, user } = value.state;

                    return (
                        <Fragment>
                            <h1 className="mt-4">All Posts</h1>
                            
                            { posts.map(post => (
                                <div key={post.slug} className="card rounded my-2">
                                    <div className="card-body">
                                        <Link to={`/post/${post.slug}`}>
                                            <img className="img-small d-inline" src={post.image} alt={post.title} />
                                            <span className="ml-2">{post.title}</span>
                                        </Link>
                                        <div className="col-12 mt-2">
                                            { post.author === user.username ? '* You are owner' : `Author: ${post.author}` }
                                        </div>
                                        <small className="d-block mt-2 ml-2 ml-3">Created at: {to_jalali(post.created)}</small>
                                    </div>
                                </div>
                            ))}
                        </Fragment>
                    )
                }
            }
            </Consumer>
        )
    }
}


Posts.contextType = Context;

export default Posts;