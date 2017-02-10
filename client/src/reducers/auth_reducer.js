/**
 * Created by dragos on 17/01/2017.
 */
import {
    AUTH_USER,
    UNAUTH_USER,
    AUTH_ERROR,
    FETCH_MESSAGE
} from '../actions/types'

export default function (state = {}, action) {
    switch (action.type) {
        case AUTH_USER:
            return {...state, authenticated: true, error: ''};
        case UNAUTH_USER:
            console.log("signing out");
            return {...state, authenticated: false, error: ''};
        case AUTH_ERROR:
            return {...state, error: action.payload};
        case FETCH_MESSAGE:
            return {...state, message: action.payload};
    }

    return state;
}