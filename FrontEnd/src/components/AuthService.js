import decode from 'jwt-decode';
export default class AuthService {

    constructor(domain) {
        this.domain = domain || 'http://localhost:3600' // API server domain
        this.fetch = this.fetch.bind(this);
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    login(email, password) {

        var state = {
            email: email,
            password: password
        };

        console.log('state is', state);


        return this.fetch(`${this.domain}/auth`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state)
        }).then(res => {
            this.setToken(res) // Setting the token in localStorage
            return Promise.resolve(res);
        })
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            } else
                return false;
        } catch (err) {
            return false;
        }
    }


    getProfile() {	
        console.log('Token decoded' + this.getToken());	
       // Using jwt-decode npm package to decode the token	
       return decode(this.getToken());	
   }

    setToken(res) {
        console.log('Token set' + res);
        // Saves user token to localStorage
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        localStorage.setItem('user_id', res.userId);
    }

    getToken() {
        console.log('Token retrieved' + localStorage.getItem('token'));
        return localStorage.getItem('token');
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }

        return fetch(url, {
                headers,
                ...options
            })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }
}