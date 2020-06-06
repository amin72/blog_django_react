import React, {Component, Fragment} from 'react';
import { Link } from 'react-router-dom';

import { Consumer } from '../../context/context';
import { to_jalali } from '../../other/date_convertor';


class Posts extends Component {
    render() {
        return (
            <Consumer>
            {
                value => {
                    const { posts } = value

                    return (
                        <Fragment>
                            <h1 className="mt-4">All Posts</h1>
                            
                            { posts.map(post => (
                                <div key={post.slug} className="card rounded my-2">
                                    <div class="card-body">
                                        <Link to={`/post/${post.slug}`}>
                                            <img className="img-small d-inline" src={post.image} />
                                            <span className="ml-2">{post.title}</span>
                                        </Link>
                                        <small className="d-block mt-2 ml-2">Created at: {to_jalali(post.created)}</small>
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


export default Posts;