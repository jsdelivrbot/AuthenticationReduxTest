/**
 * Created by dragos on 17/01/2017.
 */
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Signup extends Component {

    handleFormSubmit(formProps) {
        //call action creator to sign up the user
        this.props.signupUser(formProps);
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
        const {handleSubmit, fields:{email, password, passwordConfirm}} = this.props;

        const renderField = ({ input, label, type, meta: { touched, error } }) => (
            <div>
                <label>{label}</label>
                <div>
                    <input {...input} placeholder={label} type={type} className="form-control"/>
                    {touched && error && <div className="error">{error}</div>}
                </div>
            </div>
        )

        return (
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                <fieldset className="form-group">
                    <label>Email:</label>
                    <Field name="email" component={renderField} type="text"
                           label="Your email"/>
                </fieldset>
                <fieldset className="form-group">
                    <label>Password:</label>
                    <Field name="password" component={renderField} type="password"
                           label="Your password"/>
                </fieldset>
                <fieldset className="form-group">
                    <label>Confirm Password:</label>
                    <Field name="passwordConfirm" component={renderField} type="password"
                           label="Your password"/>
                </fieldset>
                {this.renderAlert()}
                <button action="submit" className="btn btn-primary">Sign up</button>
            </form>
        );
    }
}

function validate(formProps) {
    const errors = {};
    if (!formProps.email)
    {
        errors.email = "Please enter an email"
    }
    if (!formProps.password)
    {
        errors.password = "Please enter a password"
    }
    if (!formProps.passwordConfirm)
    {
        errors.passwordConfirm = "Please enter a password confirm"
    }

    if (formProps.password !== formProps.passwordConfirm) {
        errors.password = 'Passwords must match';
    }

    return errors;
}


function mapStateToProps(state) {
    return {errorMessage: state.auth.error};
}

Signup = reduxForm({
    form: 'signup', //numele formei
    fields: ['email', 'password', 'passwordConfirm'], //numele astea trebuie sa fie excat ca cele de pe server side
    validate
}, null, actions)(Signup);

export default Signup = connect(mapStateToProps, actions)(Signup)