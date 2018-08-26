import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import Logo from "./lockLogo.svg";
import AuthService from './AuthService';


class Login extends Component {
    constructor(props) {
        super(props);

        this.Auth = new AuthService();

        this.state = {
            email: "",
            password: ""
        };
    }

    componentWillMount() {
        document.body.style.backgroundColor = "black";

        if (this.Auth.loggedIn())
            this.props.history.replace('/User');
    }

    componentWillUnmount() {
        document.body.style.backgroundColor = null;
    }


    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 5;
    }

    postLogin() {
        console.log(this.state);

        this.Auth.login(this.state.email, this.state.password)
            .then(res => {
                this.props.history.replace('/User');
            })
            .catch(err => {
                alert('Invalid email or password');
            })


    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.postLogin();
    }

    render() {

        return (

            <div className = "Login" >
                <div className = "card" >
                
                <img src = { Logo } alt = "Login" />

                    <form onSubmit = { this.handleSubmit } className = "center" >

                    <FormGroup controlId = "email" bsSize = "large" > 
                    <ControlLabel > EMAIL ADDRESS </ControlLabel> 
                    <FormControl autoFocus type = "email" value = { this.state.email } onChange = { this.handleChange }/> 
                    </FormGroup> 
                    
                    <FormGroup controlId = "password" bsSize = "large" >
                    <ControlLabel > PASSWORD </ControlLabel> 
                    <FormControl value = { this.state.password } onChange = { this.handleChange } type = "password" />
                    </FormGroup> 
                    
                    <Button block bsSize = "large" disabled = {!this.validateForm() } type = "submit" > LOGIN </Button> 

                    </form> 
                    
                </div> 
            </div>
        );
    }
}

export default Login;