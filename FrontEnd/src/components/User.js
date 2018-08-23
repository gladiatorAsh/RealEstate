import React, {
    Component
} from "react";
import "./User.css";
import $ from "jquery";
import AuthService from './AuthService';
import withAuth from './withAuth';

class User extends Component {
    constructor(props) {
        super(props);

        this.domain = 'http://localhost:3600' // API server domain
        this.Auth = new AuthService(this.domain);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            permissionLevel: "",
            address: "",
            citystatezip: "",
            ip: "",
            zipcode: "",
            state: "",
            city: "",
            expected: "",
            rentzestimate: "",
            lowrentzestimate: "",
            highrentzestimate: "",
            isEnquiryBtnDisabled:false,
            isSubmitBtnDisabled:true
        };

        this.id = "";

        this.handleChange = this.handleChange.bind(this);
        this.updateState = this.updateState.bind(this);
        this.postZillow = this.postZillow.bind(this);
        this.postExpected=this.postExpected.bind(this);
    }

    componentDidMount() {

        if (this.Auth.loggedIn()) {
            this.getDetails();
        }
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length >= 5;
    }

    validateAddress() {
        return true;
        /*
        return this.state.address.length>0 && this.state.zipcode.length>0
        && this.state.city.length>0 && this.setState.state.length>0
        */
    }

    postZillow() {

        if (!this.validateAddress()) {
            alert('Please fill all details before pressing Send');
            this.preventDefault();
            return;
        }

        
        //ToDo: currently directly using zip, can make zip optional if both city and state are present
        let tempObj = {
            "userId": this.id,
            "address": this.state.address,
            "citystatezip": this.state.zipcode
        }

        $.ajax({
            type: 'POST',
            url: this.domain + "/zillow/getRentEstimate",
            data: JSON.stringify(tempObj),
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: (result) => {
               
                if(result==null){
                    alert('Not a valid address');
                }else{
            
                    this.setState({
                        isEnquiryBtnDisabled:true,
                        isSubmitBtnDisabled:false
                    });
            
                    this.updateState(result);
                }
            },
            error: function (err) {
                //ToDO: Retry on failure for a certain no. of times
                console.log(err);
            }
        });

    }

    postUserData() {

        if (!this.validateForm()) {
            this.preventDefault();
            return;
        }

        console.log("current state", this.state);

        var id = localStorage.getItem('user_id');
        this.id = id;

        let ip = "";

        var promise = $.getJSON('https://api.ipify.org?format=json', function (data) {
            console.log("IP", data.ip);
            ip = data.ip;
        });

        promise.then(function (result) {
            var userObj = this.state;

            //Storing appropriate values in db     
            delete userObj["permissionLevel"];
            userObj.address = userObj["address"] + userObj["citystatezip"]
            userObj["ip"] = ip;
            delete userObj["citystatezip"];

            $.ajax({
                type: 'PATCH',
                url: this.domain + "/Users/" + id,
                data: userObj,
                dataType: 'json',
                success: function (result) {
                    console.log('Successfully saved');
                    console.log("Result", result);
                },
                error: function (err) {
                    //ToDO: Retry on failure for a certain no. of times
                    console.log(err);
                }
            });
        }, function (err) {
            //ToDo: Isolate this so that cascading failures due to external service is avoided
            console.log('iP address service failed');
        });


    }

    /*Remove this method if unused */
    fetch(url, headers, options) {

        return fetch(url, {
                headers,
                options
            })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    /*Remove this method if unused */
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
    updateState(newState) {

        this.setState({
            firstName: newState.firstName,
            lastName: newState.lastName,
            email: newState.email,
            password: newState.password,
            street: newState.street,
            city: newState.city,
            state: newState.state,
            phone: newState.phone,
            expected: newState.expected,
            ip: newState.ip,
            rentzestimate: newState.amount? newState.amount:0 ,
            lowrentzestimate: newState.valuationRange?newState.valuationRange.low:0,
            highrentzestimate: newState.valuationRange?newState.valuationRange.high:0
        });
    }

    getDetails() {
        this.id = localStorage.getItem('user_id');
        var updateState = this.updateState;

        const xhrHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }
        const loc = this.domain + "/Users/" + this.id;


        $.ajax({
            url: loc,
            type: 'GET',
            dataType: 'json',
            headers: xhrHeaders,
            contentType: "application/json",
            success: function (result) {
                updateState(result);
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

    postExpected() {
        const xhrHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }


        let obj={
            "userId":this.id,
            "userExpectation":this.state.userExpectation? this.state.userExpectation:0
        }

        $.ajax({
            url: this.domain + "/zillow/postUserEstimate",
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            headers: xhrHeaders,
            data:JSON.stringify(obj),
            success: function (result) {
                alert('You will be sent an email about this property!!');
                this.setState({
                    isSubmitBtnDisabled:true
                });
                this.props.history.replace('/Contact');
            },
            error: function (error) {
                console.log(error);
                this.props.history.replace('/Contact');
            }
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.postZillow();
    }


    render() {
        return ( 
        <form className = "form-card" onSubmit = { this.handleSubmit } >
            <fieldset className = "form-fieldset" >
                <div className = "form-element form-input" >
                <input id = "firstname" className = "form-element-field" value = {this.state.firstName} onChange = {this.handleChange}
                placeholder = "Please fill in your first name"  type = "input" required />
                <div className = "form-element-bar" > </div> <label className = "form-element-label" htmlFor = "firstname" > First Name </label> 
                </div > 

                <div className = "form-element form-input" ><input id = "lastname" className = "form-element-field" 
                value = {this.state.lastName} onChange = {this.handleChange} placeholder = "Please fill in your last name" type = "input" required />
                <div className = "form-element-bar" > </div> 
                <label className = "form-element-label"htmlFor = "lastname" > Last Name </label> 
                </div >
            
                <div className = "form-element form-input" >
                <input id = "email" className = "form-element-field" value = {this.state.email} onChange = {this.handleChange}
                placeholder = "Please fill in your email"  type = "email" required />
                <div className = "form-element-bar" > </div> 
                <label className = "form-element-label" htmlFor = "email" > Email </label> 
                </div > 

                <div className = "form-element form-input" >
                <input id = "phone" className = "form-element-field" value = { this.state.phone} onChange = {this.handleChange}
                placeholder = "Please fill in your phone" type = "phone"  required />
                <div className = "form-element-bar" > </div> 
                <label className = "form-element-label" htmlFor = "phone" > Phone </label> 
                </div > 

                <div className = "form-element form-input" >
                <input id = "address" className = "form-element-field" value = {this.state.address} onChange = {this.handleChange}
                placeholder = "Please fill in your address" type = "text" required />
                <div className = "form-element-bar" > </div> 
                <label className = "form-element-label" htmlFor = "address" > Address </label> 
                </div > 
            
                <div className = "form-element form-input" >
                <input id = "city" className = "form-element-field" value = {this.state.city}
                onChange = {this.handleChange} placeholder = "Please fill in your city" type = "text" required />
                <div className = "form-element-bar" > </div> 
                <label className = "form-element-label" htmlFor = "city" > City </label> </div> 
                
                <div className = "form-element form-input" >
                <input id = "state" className = "form-element-field" value = {this.state.state}
                onChange = {this.handleChange} placeholder = "Please fill in your state" type = "text" required />
                <div className = "form-element-bar" > </div> 
                <label className = "form-element-label" htmlFor = "state" > State </label> 
                </div > 
                
                <div className = "form-element form-input" >
                <input id = "zipcode" className = "form-element-field" value = {this.state.zipcode}
                onChange = { this.handleChange } placeholder = "Please fill in your zipcode" type = "number" required />
                <div className = "form-element-bar" > </div> 
                <label className = "form-element-label" htmlFor = "zipcode" > Zip </label> 
                </div >
                
            </fieldset> 
            
            <div className = "form-actions" >
            <button className = "form-btn" type = "submit" disabled={this.state.isEnquiryBtnDisabled}> Send inquiry </button> 
            </div > 
            
            <div>
                <div >
                <span> Rent Zestimate: $ </span> <span id="rentzestimate">{this.state.rentzestimate}</span >
                </div> 
                
                <div>
                <span> Low: $ </span> <span id="lowrentzestimate">{this.state.lowrentzestimate}</span>
                </div>  
            
                <div>
                <span> High: $ </span> <span id="highrentzestimate">{this.state.highrentzestimate}</span>
                </div>  
            
                <div>
                <span> Expected Rent: $ </span> <input type="number" id="expected" value={this.state.expected}  />
                <button className = "form-btn" type = "button" disabled={this.state.isSubmitBtnDisabled} onClick={this.postExpected}> Submit </button> 
                </div>  
            </div >

        </form>

        );
    }
}

export default withAuth(User);