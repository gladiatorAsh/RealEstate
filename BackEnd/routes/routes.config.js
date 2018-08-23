const VerifyUser = require('../authorization/verifyUser');
const AuthorizationController = require('../authorization/authorizaton.controller');
const AuthValidation = require('../common/auth.validation');

exports.routesConfig = function(app) {

    app.post('/auth', [
        VerifyUser.hasAuthValidFields,
        VerifyUser.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);

    app.post('/auth/refresh', [
        AuthValidation.validJWTNeeded,
        AuthValidation.verifyRefreshBodyField,
        AuthValidation.validRefreshNeeded,
        AuthorizationController.login
    ]);
};