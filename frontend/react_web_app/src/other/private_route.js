import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { Consumer } from "../context/context";


class PrivateRoute extends Component {
    render() {
        const { component: Component, ...rest } = this.props;

        return (
            <Consumer>
                {value => {
                    const { user } = value.state;

                    return (
                        <Route {...rest} render={props => (
                            user.isAuthenticated ? ( 
                                <Component {...props}/>
                            ) : (
                                <Redirect to={{
                                    pathname: '/user/login', 
                                    state: {from: props.location}
                                }}/>
                            )
                        )}/>
                    );
                }}
            </Consumer>
        );
    }
}


export default PrivateRoute;