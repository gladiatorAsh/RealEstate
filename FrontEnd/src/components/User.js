import React, { Component } from "react";
import "./User.css";
import $ from "jquery";
import AuthService from './AuthService';
import withAuth from './withAuth';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password:"",
      phone:"",
      permissionLevel:"",
      address:"",
      citystatezip:"",
      ip:""
    };

    
    this.domain ='http://localhost:3600' // API server domain
    this.Auth = new AuthService(this.domain);
    this.id="";

    this.handleChange=this.handleChange.bind(this);
    this.updateState=this.updateState.bind(this);
  }

  componentDidMount() {
    clearInterval();
       if(this.Auth.loggedIn())
            this.getDetails();
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

  fetch(url,headers, options) {
    
    return fetch(url, {
        headers,
        options
    })
        .then(this._checkStatus)
        .then(response => response.json())
}

_checkStatus(response) {
  console.log(response);
  // raises an error in case response status is not a success
  if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response;
  } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
  }
}
  updateState(newState){
    console.log(newState);
    this.setState({firstName:newState.firstName,lastName:newState.lastName,
      email:newState.email,password:newState.password,street:newState.street,
      city:newState.city,state:newState.state,phone:newState.phone
    });
  }

  getDetails(){
    this.id=localStorage.getItem('user_id');
    var updateState=this.updateState;

    const xhrHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization':'Bearer '+ this.Auth.getToken()
  }

  const loc=this.domain+"/Users/"+this.id;
  console.log("Loc",loc);

    $.ajax({
      url: loc,
      type: 'GET',
      dataType: 'json',
      headers: xhrHeaders,
      contentType: 'application/json; charset=utf-8',
      success: function (result) {
        updateState(result);
        console.log("data",result);
      },
      error: function (error) {
          console.log(error);
      }
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
      <form className="form-card">
      <fieldset className="form-fieldset">
          <div className="form-element form-input">
              <input id="firstname" class="form-element-field" placeholder="Please fill in your first name" type="input" required/>
              <div className="form-element-bar"></div>
              <label className="form-element-label" for="firstname">First Name</label>
          </div>
          <div className="form-element form-input">
              <input id="lastname" className="form-element-field" placeholder="Please fill in your last name" type="input" required/>
              <div className="form-element-bar"></div>
              <label className="form-element-label" for="lastname">Last Name</label>
          </div>
          <div className="form-element form-input">
              <input id="email" class="form-element-field" placeholder="Please fill in your email" type="email" required/>
              <div className="form-element-bar"></div>
              <label className="form-element-label" for="email">Name</label>
          </div>
          <div className="form-element form-input">
              <input id="phone" class="form-element-field" placeholder="Please fill in your phone" type="phone" required/>
              <div className="form-element-bar"></div>
              <label className="form-element-label" for="phone">Phone</label>
          </div>
          <div className="form-element form-input">
              <input id="address" class="form-element-field" placeholder="Please fill in your address" type="text" required/>
              <div className="form-element-bar"></div>
              <label className="form-element-label" for="address">Address</label>
          </div>
          <div className="form-element form-input">
              <input id="city" class="form-element-field" placeholder="Please fill in your city" type="text" required/>
              <div className="form-element-bar"></div>
              <label class="form-element-label" for="city">City</label>

          className</div>
          <div className="form-element form-input">
              <input id="state" className="form-element-field" placeholder="Please fill in your state" type="text" required/>
              <div class="form-element-bar"></div>
              <label class="form-element-label" for="state">City</label>
          </div>
          <div class="form-element form-input">
              <input id="zipcode" class="form-element-field" placeholder="Please fill in your zipcode" type="number" required/>
              <div class="form-element-bar"></div>
              <label class="form-element-label" for="state">zipcode</label>
          </div>
      </fieldset>
      <div class="form-actions">
          <button class="form-btn" type="submit">Send inquiry</button>
          <button class="form-btn-cancel -nooutline" type="reset">Cancel</button>
      </div>
  </form> 
    );
  }
}

export default withAuth(Login);