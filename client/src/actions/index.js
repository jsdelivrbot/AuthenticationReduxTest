import axios from 'axios';
import { browserHistory } from 'react-router';
import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, FETCH_MESSAGE, FETCH_USERS } from './types';

const ROOT_URL = "http://localhost:3090";

export function signinUser({email, password}) {
    //folosesc redux-thunk ca sa intorc o functie
    return function (dispatch) {
        //Submit email/password to server
        axios.post(`${ROOT_URL}/signin`, {email, password})
            .then(response => {
                //If request is good:
                //-update state to indicate user is authenticated
                dispatch({type: AUTH_USER});

                //-save the JWT token
                localStorage.setItem('token', response.data.token);

                //-redirect to route '/feature'
                browserHistory.push('/feature');
            })
            .catch(() => {
                //If request is bad...
                //-show an error to user
                dispatch(authError('Bad login info'));
            });
    }
}

export function signupUser({email, password}) {
    //folosesc redux-thunk ca sa intorc o functie
    return function (dispatch) {
        //Submit email/password to server
        axios.post(`${ROOT_URL}/signup`, {email, password})
            .then(response => {
                //If request is good:
                //-update state to indicate user is authenticated
                dispatch({type: AUTH_USER});

                //-save the JWT token
                localStorage.setItem('token', response.data.token);

                //-redirect to route '/feature'
                browserHistory.push('/feature');
            })
            .catch(() => {
                //If request is bad...
                //-show an error to user
                dispatch(authError('Bad login info'));
            });
    }
}

export function authError(error) {
    return {type: AUTH_ERROR, payload: error};

}

export function signoutUser() {
    localStorage.removeItem('token');
    return {type: UNAUTH_USER};

}

export function fetchMessage(){
    return function(dispatch){
        axios.get(ROOT_URL,{
            headers:{authorization: localStorage.getItem('token')}
        })
            .then(response=>{
                dispatch({
                    type:FETCH_MESSAGE,
                    payload: response.data.message
                })
            })
    }
}

export function getAllUsers(){
    return function(dispatch){
        axios.get(`${ROOT_URL}/users`,{
            headers:{authorization: localStorage.getItem('token')}
        })
            .then(response=>{
                dispatch({
                    type:FETCH_USERS,
                    payload: response.data.result
                })
            })
    }
}