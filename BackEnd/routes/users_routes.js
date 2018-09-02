const UsersController = require('../users/user');
const Permission = require('../common/auth.permission');
const Validation = require('../common/auth.validation');
const config = require('../config/config');
const VerifyUser = require('../authorization/verifyUser');
const AuthorizationController = require('../authorization/authorizaton.controller');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;


exports.routesConfig = function (app) {

    app.post('/users', [UsersController.insert]);

    app.get('/users/:userId', [
        // Validation.validJWTNeeded,
        //Permission.minimumPermissionLevelRequired(FREE),
        //Permission.onlySameUserOrAdminCanDoThisAction,
        UsersController.getById
    ]);


    app.get('/users', [
        //Validation.validJWTNeeded,
        //Permission.minimumPermissionLevelRequired(PAID),
        UsersController.list
    ]);


    app.post('/auth', [
        //VerifyUser.hasAuthValidFields,
        //VerifyUser.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);

    app.patch('/users/:userId', [
        //Validation.validJWTNeeded,
        //Permission.minimumPermissionLevelRequired(FREE),
        //Permission.onlySameUserOrAdminCanDoThisAction,
        UsersController.patchById
    ]);

    app.post('/users/:userId', [
        //Validation.validJWTNeeded,
        //Permission.minimumPermissionLevelRequired(FREE),
        //Permission.onlySameUserOrAdminCanDoThisAction,
        UsersController.patchById
    ]);

    app.delete('/users/:userId', [
        //Validation.validJWTNeeded,
        //Permission.minimumPermissionLevelRequired(ADMIN),
        UsersController.removeById
    ]);

};