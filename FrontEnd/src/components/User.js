import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./User.css";
import Logo from "./lockLogo.svg";
import $ from "jquery";
//import { createStackNavigator } from 'react-navigation';
//import "../navigation/nav";
import AuthService from './AuthService';
import withAuth from './withAuth';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fname: "",
      lname: "",
      email: "",
      password:"",
      street:"",
      city:"",
      state:"",
      phone:""   
    };

    this.Auth = new AuthService();
    this.domain ='http://localhost:8000' // API server domain
    this.id="";

    this.handleChange=this.handleChange.bind(this);
    this.updateState=this.updateState.bind(this);
  }

  componentDidMount() {
    clearInterval();
       if(this.Auth.loggedIn())
            this.getDetails()
    }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length >= 5;
  }

  postUserData(){
    
    if(this.state.email===""){
      return;
    }
      console.log("current state",this.state);
      var id=localStorage.getItem('user_id');
    $.ajax({
        type:'PUT',
        url:this.domain+"/users/"+id,
        data:this.state,
        dataType:'json',
        success:function(result){
            console.log("Result",result);
        },
        error:function(err){
            console.log(err);
        }
    });
  }

  updateState(newState){
    console.log(newState);
    this.setState({fname:newState.fname,lname:newState.lname,
      email:newState.email,password:newState.password,street:newState.street,
      city:newState.city,state:newState.state,phone:newState.phone
    });
  }

  getDetails(){
    this.id=localStorage.getItem('user_id');
    var updateState=this.updateState;
    $.get(`${this.domain}/users/${this.id}`, function( data) {
      updateState(data);
      console.log("data",data);
    });

  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.postUserData();
  }
  
  
  goDashboard = event => {
    event.preventDefault();
    this.postUserData();
    this.props.history.replace('/Dashboard');
  }

  render() {
    
    return (
        
      <div className="User ">
      
        <form onSubmit={this.goDashboard} className="flex-container">
        <img src={Logo} alt=""/>
        <FormGroup className="flex-item" controlId="fname" bsSize="small">
            <ControlLabel>First Name</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.fname}
              onChange={this.handleChange}
              onBlur={this.handleSubmit}
            />
          </FormGroup>
          <FormGroup className="flex-item" controlId="lname" bsSize="small">
            <ControlLabel>Last Name</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.lname}
              onChange={this.handleChange}
              onBlur={this.handleSubmit}            />
          </FormGroup>
          <FormGroup className="flex-item" controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              onBlur={this.handleSubmit}
            />
          </FormGroup>
          <FormGroup className="flex-item" controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              onBlur={this.handleSubmit}
              type="password"
            />
          </FormGroup>
          <FormGroup className="flex-item" controlId="street" bsSize="large">
            <ControlLabel>Street Address</ControlLabel>
            <FormControl
              value={this.state.street}
              onChange={this.handleChange}
              onBlur={this.handleSubmit}
              type="text"
            />
          </FormGroup>
          <FormGroup className="flex-item" controlId="city" bsSize="large">
            <ControlLabel>City</ControlLabel>
            <FormControl
              value={this.state.city}
              onChange={this.handleChange}
              onBlur={this.handleSubmit}
              type="text"
            />
          </FormGroup>
          <FormGroup className="flex-item" controlId="state" bsSize="large">
            <ControlLabel>State</ControlLabel>
            <FormControl
              value={this.state.state}
              onChange={this.handleChange}
              onBlur={this.handleSubmit}
              type="text"
            />
          </FormGroup>
          <FormGroup className="flex-item" controlId="phone" bsSize="large">
            <ControlLabel>Phone</ControlLabel>
            <FormControl
              value={this.state.phone}
              onChange={this.handleChange}
              onBlur={this.handleSubmit}
              type="text"
            />
            
          </FormGroup>
          <Button className="flex-item"
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Back to Home
          </Button>
        </form>
      </div>
    );
  }
}

export default withAuth(Login);