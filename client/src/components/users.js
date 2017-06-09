/**
 * Created by dragos on 09/06/2017.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Users extends Component {
    componentWillMount() {
        this.props.getAllUsers();
    }

    render() {

        if (this.props.allUsers) {
            return (
                <ul className="list-group">
                    {
                        this.props.allUsers.map((user, i) => {
                            return <li className="list-group-item" key={i}> {user.email}</li>
                        })
                    }
                </ul>
            );
        }
        else {
            return (

                <div>Please wait Loading users...</div>
            );
        }

    }
}

function mapStateToProps(state) {
    return {allUsers: state.auth.allUsers};
}

export default connect(mapStateToProps, actions)(Users);