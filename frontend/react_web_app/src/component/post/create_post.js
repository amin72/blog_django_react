import React, { Component } from 'react';
import axios from 'axios';

import { Consumer } from '../../context/context';
import { CREATE_POST_URL, FETCH_TAGS_URL } from '../../other/urls';


class CreatePost extends Component {
    signal = axios.CancelToken.source();

    state = {
        title: '',
        image: '',
        content: '',
        tags: [],
        fetchedTags: [],
        tagsLoaded: false
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
    

    onFileChange = e => {
        const file = e.target.files[0];
        this.setState({
            [e.target.name] : file
        })
    }


    onSubmit = (dispatch) => e => {
        e.preventDefault()
        
        const access_token = localStorage.getItem('access');
        if (!access_token) {
            console.log("access token doesn't exists");
            return;
        };

        var formData = new FormData();
        formData.append("title", this.state.title);
        formData.append("image", this.state.image);
        formData.append("content", this.state.content);
        this.state.tags.map(tag => 
            formData.append("tags", tag)
        );

        axios.post(CREATE_POST_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${access_token}`
            }})
            .then(res => res.data)
            .then(data => {
                this.props.history.push('/');
            }).catch(err => console.log(err.response))
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


    componentDidMount() {
        this.loadTags();
    }


    componentWillUnmount() {
        this.signal.cancel('Api is being canceled');
    }


    render() {
        const {title, content, tags} = this.state;

        return (
            <Consumer>
                { value => {
                    const { dispatch, user } = value.state;

                    return !user.isAuthenticated ? (
                        // if user isn't the owner of post redirect to login
                        this.props.history.push('/user/login')
                    ) : (
                        <div className="col-md-8 m-auto">
                            <div className="card card-body mt-5">
                                <h2 className="text-center">Submit New Post</h2>

                                <form onSubmit={this.onSubmit(dispatch)}>
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
                                            onChange={this.onFileChange}
                                            required
                                        />
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
                                        <button type="submit" className="btn btn-primary">Create Post</button>
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


export default CreatePost;