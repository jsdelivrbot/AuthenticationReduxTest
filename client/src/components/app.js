import React, { Component } from 'react';
import Header from './header';

export default class App extends Component {
    render() {
        return (
            <div>
                <Header/>
                {/*trebuie sa arat componentele de sub aplicatie*/}
                {this.props.children}
            </div>
        );
    }
}
