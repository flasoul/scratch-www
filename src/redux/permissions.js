var keyMirror = require('keymirror');
var jar = require('../lib/jar.js');

var Types = keyMirror({
    SET_PERMISSIONS: null,
    SET_PERMISSIONS_ERROR: null
});

module.exports.permissionsReducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = '';
    }
    switch (action.type) {
    case Types.SET_PERMISSIONS:
        return action.permissions;
    case Types.SET_PERMISSIONS_ERROR:
        return state;
    default:
        return state;
    }
};

module.exports.storePermissions = function (permissions) {
    permissions = permissions || {};
    return function (dispatch) {
        jar.set('permissions', permissions, {
            encode: function (value) {
                return encodeURIComponent(JSON.stringify(value));
            }
        });
        return dispatch(module.exports.setPermissions(permissions));
    };
};

module.exports.getPermissions = function () {
    return function (dispatch) {
        jar.get('permissions', function (err, value) {
            if (err) return dispatch(module.exports.setPermissionsError(err));

            try {
                value = JSON.parse(decodeURIComponent(value)) || {};
            } catch (e) {
                value = {};
            }
            return dispatch(module.exports.setPermissions(value));
        });
    };
};

module.exports.setPermissions = function (permissions) {
    return {
        type: Types.SET_PERMISSIONS,
        permissions: permissions
    };
};

module.exports.setPermissionsError = function (error) {
    return {
        type: Types.SET_PERMISSIONS_ERROR,
        error: error
    };
};
