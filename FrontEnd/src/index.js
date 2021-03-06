import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login'
import User from './components/User';
import Contact from './components/Contact'

//ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
    <Router>
        <div>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/user" component={User} />
        <Route exact path="/contact" component={Contact} />
        </div>
    </Router>,
    document.getElementById('root'))
