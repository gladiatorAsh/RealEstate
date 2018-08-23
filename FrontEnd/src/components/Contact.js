import React, { Component } from "react";
import AuthService from './AuthService';
import withAuth from './withAuth';
class Contact extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <h3> You will be emailed the details.Thank you for using our service. </h3>
        )
    }

}

export default withAuth(Contact);