import React, { Component } from 'react';
import "./tacit.min.css";

//import Projects from './components/Projects';
//import Login from './components/Login';
//import { createStackNavigator } from 'react-navigation';
//import {NavigationStack} from "./navigation/nav"
//import AuthService from './components/AuthService';
import withAuth from './components/withAuth';
//const Auth = new AuthService();
//import {logo} from './logo';

class App extends Component {
  /*
  constructor(){
    super();
    

    this.state={
      projects:[
       
    ]

    }
    
  }
*/
  componentWillMount(){
    
  
    
  }

 // handleLogout(){
   // Auth.logout()
   // this.props.history.replace('/login');
 //}


  render() {
    //<!--<button type="button" className="form-submit" onClick={this.handleLogout.bind(this)}>Logout</button>-->
    return(
      <div className="App">
          <div className="App-header">
              
     
          </div>
          <p className="App-intro">
              
          </p>
          
          </div>
  )
  
  }
}

export default withAuth(App);
