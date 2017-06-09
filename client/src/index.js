import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';

import App from './components/app';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import Feature from './components/feature';
import Users from './components/users';
import RequireAuth from './components/auth/require_authentication';
import Welcome from './components/welcome';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);
const token = localStorage.getItem('token');
if (token) {
    //we have to update the application state
    //dispatch e aceeasi metoda din redux thunk
    console.log(AUTH_USER);
    store.dispatch({type: AUTH_USER});
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Welcome}/>
                <Route path="signin" components={Signin}/>
                <Route path="signout" components={Signout}/>
                <Route path="signup" components={Signup}/>
                <Route path="feature" components={RequireAuth(Feature)}/>
                <Route path="users" components={RequireAuth(Users)}/>
            </Route>
        </Router>
    </Provider>
    , document.querySelector('.container'));
