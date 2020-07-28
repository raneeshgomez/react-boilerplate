import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({
 isAuthenticated,
 // component prop is renamed with uppercase 'C' because components have to start with an uppercase letter in JSX
 component: Component,
 // Destructures all other props that were not explicitly destructured (name (here it is 'rest') is flexible)
 ...rest
}) => (
    <Route {...rest} component={(props) => (
        isAuthenticated ? (
            <Redirect to="/dashboard" />
        ) : (
            <Component {...props} />
        )
    )} />
);

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid
});

export default connect(mapStateToProps)(PublicRoute);