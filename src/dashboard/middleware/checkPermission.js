"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
function checkPermission(req, res, next) {
    try {
        const _req = req;
        const { username, role } = _req.user;
        const rolePermissions = {
            company: ["read", "write", "delete", "update"],
            player: ["read"]
        };
        const requiredPermission = req.route.path;
        next();
    }
    catch (error) {
        next(error);
    }
}
exports.checkPermission = checkPermission;
