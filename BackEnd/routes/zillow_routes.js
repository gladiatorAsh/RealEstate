const ZillowController = require('../zillow/zillow');
const UsersController = require('../users/user');
const Permission = require('../common/auth.permission');
const Validation = require('../common/auth.validation');
const config = require('../config/config');
/*

const VerifyUser = require('../authorization/verifyUser');
const AuthorizationController = require('../authorization/authorizaton.controller');
*/

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {

    app.post('/zillow/getRentEstimate', [
        Validation.validJWTNeeded,
        Permission.minimumPermissionLevelRequired(FREE),
        Permission.onlySameUserOrAdminCanDoThisAction,
        ZillowController.getRentZestimate
    ]);

    app.post('/zillow/postUserEstimate', [
        Validation.validJWTNeeded,
        Permission.minimumPermissionLevelRequired(FREE),
        //Permission.onlySameUserOrAdminCanDoThisAction,
        ZillowController.postUserEstimate
    ]);

    app.patch('/zillow/users/:userId', [
        Validation.validJWTNeeded,
        Permission.minimumPermissionLevelRequired(FREE),
        Permission.onlySameUserOrAdminCanDoThisAction,
        UsersController.patchAddressById
    ]);
};