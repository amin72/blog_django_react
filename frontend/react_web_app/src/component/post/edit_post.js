import React, { Component } from 'react';
import axios from 'axios';

import { Consumer } from '../../context/context';
import { FETCH_TAGS_URL } from '../../other/urls';


class EditPost extends Component {
    signal = axios.CancelToken.source();

    state = {
        title: '',
        image: '', // image address
        imgSrc: '', // image content
        content: '',
        tags: [],
        fetchedTags: [],
        tagsLoaded: false,
        post: null
    }

    
    fetchPost = async () => {
        // access token
        const access_token = localStorage.getItem('access');
        const { slug } = this.props.match.params;
        const url = `http://127.0.0.1:8000/api/v1/posts/${slug}/`;
        
        try {
            const response = await axios.get(url, {
                cancelToken: this.signal.token,
            });
            
            const post = response.data;

            this.setState({
                post: post,
                title: post.title,
                content: post.content,
                image: post.image,
                imgSrc: post.image,
                tags: post.tags
            });
        } catch(err) {
            console.log(err);
        }
    }


    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
    }


    onTagsChange = e => {
        var options = e.target.options;
        var tags = [];

        for (var i = 0; i < options.length; i++) {
            if (options[i].selected) {
                tags.push(options[i].value);
            }
        }

        this.setState({tags: tags});
    }
    

    onImageChange = e => {
        const file = e.target.files[0];
        
        // change image address to new file address
        this.setState({
            [e.target.name] : file
        });

        // read content of new file address and assign it to imgSrc
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = (e) => {
            this.setState({
                imgSrc : [reader.result]
            })
        };
    }


    arraysMatch = (arr1, arr2) => {
        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;
    
        // Check if all items exist and are in the same order
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
    
        // Otherwise, return true
        return true;
    }


    onSubmit = (slug, dispatch) => e => {
        e.preventDefault()

        const url = `http://127.0.0.1:8000/api/v1/posts/${slug}/`;
        
        const access_token = localStorage.getItem('access');
        if (!access_token) {
            console.log("access token doesn't exists");
            return;
        };

        var formData = new FormData();
        const { title, image, content, tags, post } = this.state;
        let sendPatchRequest = false;

        if (post.title !== title) {
            console.log('title', title);
            formData.append("title", title);
            sendPatchRequest = true;
        }

        if (post.image !== image) {
            console.log('image', image);
            formData.append("image", image);
            sendPatchRequest = true;
        }

        if (post.content !== content) {
            console.log('content', content);
            formData.append("content", content);
            sendPatchRequest = true;
        }

        if (!this.arraysMatch(post.tags, tags)) {
            console.log('tags', tags);
            tags.map(tag => 
                formData.append("tags", tag)
            );
            
            sendPatchRequest = true;
        }

        if (sendPatchRequest === true) {
            axios.patch(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${access_token}`
                }})
                .then(res => res.data)
                .then(data => {
                    this.props.history.push(`/post/${slug}`);
                }).catch(err => console.log(err.response));
        } else {
            console.log('no need to send patch request')
            // no need to send patch request
            this.props.history.push(`/post/${slug}`);
        }
    }


    loadTags = async () => {
        // since tags are paginated, we must load all tags for user
        // for now we keep it simple and return first page
        this.setState({ tagsLoaded: true });

        const response = await axios.get(FETCH_TAGS_URL, {
            cancelToken: this.signal.token,
        });

        try {
            this.setState({
                fetchedTags: response.data.results,
                tagsLoaded: true
            });
        } catch(err) {
            if (axios.isCancel(err)) {
                console.log('Error: ', err.message); // => prints: Api is being canceled
            } else {
                this.setState({ tagsLoaded: false });
            }
        }
    }


    async componentDidMount() {
        this.loadTags();
        this.fetchPost();
    }


    componentWillUnmount() {
        this.signal.cancel('Api is being canceled');
    }


    render() {
        const { title, content, tags, image, imgSrc } = this.state;
        const { slug } = this.props.match.params;

        return (
            <Consumer>
                { value => {
                    const { dispatch, user } = value.state;

                    return !user.isAuthenticated ? (
                        // if user isn't logged in, redirect to login
                        this.props.history.push('/user/login')
                    ) : (
                        <div className="col-md-8 m-auto">
                            <div className="card card-body mt-5">
                                <h2 className="text-center">Submit New Post</h2>

                                <form onSubmit={this.onSubmit(slug, dispatch)}>
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="title"
                                            onChange={this.onChange}
                                            value={title}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Content</label>
                                        <textarea
                                            className="form-control"
                                            name="content"
                                            rows="10"
                                            onChange={this.onChange}
                                            value={content}
                                            required />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Image</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            name="image"
                                            onChange={this.onImageChange}
                                        />
                                    </div>

                                    <div>
                                        {/* preview image */}
                                        <img src={imgSrc} className="img-fluid img-thumbnail" />
                                    </div>

                                    <div className="form-group">
                                        <label>Tags</label>
                                        <select
                                            multiple
                                            value={tags}
                                            onChange={this.onTagsChange}
                                            className="form-control"
                                            name="tags">

                                            {/* if tags are loaded, list them in options, otherwise display `Loading tags...` message */}
                                            {this.state.tagsLoaded === true ? (
                                                this.state.fetchedTags.map(tag => (
                                                    <option key={tag.slug} value={tag.slug}>{tag.name}</option>
                                                ))) : (
                                                    <option value="" disabled>Loading tags...</option>
                                                )
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary">Edit Post</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }}
            </Consumer>
        )
    }
}


export default EditPost;