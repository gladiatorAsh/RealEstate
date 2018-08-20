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
      username: "",
      password: ""
    };
  }

  componentWillMount(){
    document.body.style.backgroundColor = "black";

    if(this.Auth.loggedIn())
        this.props.history.replace('/Dashboard');
}

componentWillUnmount(){
  document.body.style.backgroundColor = null;
}


  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  postLogin(){
      console.log(this.state);

      this.Auth.login(this.state.username,this.state.password)
      .then(res =>{
         this.props.history.replace('/Dashboard');
      })
      .catch(err =>{
          alert(err);
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
        
      <div className="Login">
        <div className="card">
        <img src={Logo} alt=""/>
        <form onSubmit={this.handleSubmit} className="center">
        
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>EMAIL ADDRESS</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>PASSWORD</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            LOGIN
          </Button>
        </form>
      </div>
      </div>
    );
  }
}

export default Login;