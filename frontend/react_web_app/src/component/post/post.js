import React, {Component, Fragment} from 'react';

import { Consumer } from '../../context/context';
import { to_jalali } from '../../other/date_convertor';


class Post extends Component {

    // # TODO:
    // DELETE POST
    // EDIT POST

    render() {
        const { slug } = this.props.match.params;

        return (
            <Consumer>
                { value => {

                    const { dispatch, posts } = value;
                    const filter_posts = posts.filter(post => post.slug === slug);
                    let post;

                    if (filter_posts.length === 1) {
                        post = filter_posts[0];
                    }

                    return (
                        <Fragment>
                            {post ? (
                                <div className="my-5">
                                    <img className="post-img img-fluid d-block mx-auto" src={post.image} alt={post.title} />
                                    <h1 className="mt-5">{post.title}</h1>
                                    <span>Author: {post.author}</span>
                                    <p className="mt-3">{post.content}</p>
                                    <span>Created at: {to_jalali(post.created)}</span>
                                </div>
                                ):
                            null }
                        </Fragment>
                    )
                }}
            </Consumer>
        )
    }
}


export default Post;