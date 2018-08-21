const config = require('./config/config');
const express = require('express'); 
const helmet = require('helmet');
const bodyParser = require('body-parser');
const AuthorizationRouter = require('./routes/routes.config');
const UsersRouter = require('./routes/users_routes');
const ZillowRouter= require('./routes/zillow_routes');

const app=express();

app.use(helmet());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());

AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
ZillowRouter.routesConfig(app);

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
