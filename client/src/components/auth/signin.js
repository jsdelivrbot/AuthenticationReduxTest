/**
 * Created by dragos on 17/01/2017.
 */
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Signin extends Component {
    handleFormSubmit({email, password}) {
        //this.props vine de jos de la export unde am pus ultimul parametru actions
        this.props.signinUser({email, password});
    }

    renderAlert() {
        if (this.props.errorMessage) {
            return (
                <div className="alert alert-danger">
                    <strong>Oops!</strong> {this.props.errorMessage}
                </div>
            )
        }
    }

    render() {
        const {handleSubmit, fields:{email, password}} = this.props;

        return (
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                <fieldset className="form-group">
                    <label>Email:</label>
                    <Field name="email" component="input" className="form-control" placeholder="Your email"/>
                </fieldset>
                <fieldset className="form-group">
                    <label>Password:</label>
                    <Field name="password" component="input" className="form-control" type="password"
                           placeholder="Your password"/>
                </fieldset>
                {this.renderAlert()}
                <button action="submit" className="btn btn-primary">Sign in</button>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {errorMessage: state.auth.error};

}

//primele paranteze sunt pentru configurarea reduxForm, urmatoarele paranteze sunt pentru component
Signin = reduxForm({
    form: 'signin', //numele formei
    fields: ['email', 'password'] //numele astea trebuie sa fie excat ca cele de pe server side
}, null, actions)(Signin);

export default Signin = connect(mapStateToProps, actions)(Signin)