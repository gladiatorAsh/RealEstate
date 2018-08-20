var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Login page', function() {
	it('should open Login and registration page on / GET', function(done) {
		  chai.request(server)
		    .get('/')
		    .end(function(err, res){
		      res.should.have.status(200);
		      done();
		 });
	});
});

describe('Home', function() {
	it('should open Home page on / GET', function(done) {
		  chai.request(server)
		    .get('/Home')
		    .end(function(err, res){
		      res.should.have.status(200);
		      done();
		 });
	});
});

