var nodemailer = require('nodemailer');
var secretConfig = require('../config/zillow');
var config = require('../config/config');

var transporter = nodemailer.createTransport({
    service: 'fastmail',
    auth: {
        user: config.email,
        pass: secretConfig.password
    }
});

var mailOptions = {
    from: config.email,
    to: '',
    subject: 'Thank you for using our service',
    html: ''
};

exports.sendEmail = (req, res) => {
    mailOptions.to = req.email;
    var msg = "Thank you for using our service.<p> Following are the details of your query :- </p> " +
        "<p><b>Property:</b>" + req.address + "</p>" +
        "<p><b>Rent Zestimate:</b>" + req.rentZestimate + "</p>" +
        "<p><b>Rent Zestimate Low:</b>" + req.monthlyLow + "</p>" +
        "<p><b>Rent Zestimate High:</b>" + req.monthlyHigh + "</p>" +
        "<p><b>Your Expected Rent:</b>" + req.userExpectation ? req.userExpectation : 0 + "</p>";

    mailOptions.html = msg;
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


}