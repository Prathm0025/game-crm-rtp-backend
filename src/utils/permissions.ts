import mongoose, { mongo } from "mongoose";
import { IAdmin } from "../dashboard/admin/adminType";
import { IPlayer, IUser } from "../dashboard/users/userType";

const rolesHierarchy: Record<string, string[]> = {
    admin: ["company", "master", "distributor", "subdistributor", "store"],
    company: ["master", "distributor", "subdistributor", "store"],
    master: ["distributor"],
    distributor: ["subdistributor"],
    subdistributor: ["store"],
    store: ["player"],
};

const permissions: Record<string, Record<string, string[]>> = {
    admin: {
        games: ["r", "w", "x"],
        users: ["r", "w", "x"],
        players: ["r", "w", "x"],
    },
    company: {
        games: ["r", "w"],
        users: ["r", "w"],
        players: ["r", "w", "x"],
    },
    master: {
        games: ["r"],
        users: ["r", "w"],
        players: [],
    },
    distributor: {
        games: ["r"],
        users: ["r"],
        players: [],
    },
    subdistributor: {
        games: ["r"],
        users: ["r"],
        players: [],
    },
    store: {
        games: ["r"],
        users: [],
        players: ['r', 'w', 'x'],
    },
};

function hasPermission(user: IUser | IAdmin | IPlayer, resource: string, action: string): boolean {
    if (user.role === "admin") return true;

    const userPermissions = permissions[user.role];
    if (!userPermissions || !userPermissions[resource]) return false;

    return userPermissions[resource].includes(action);
}

function isSubordinate(user: IAdmin | IUser, targetUser: IUser | IPlayer): boolean {
    if (user.role === "admin") return true;

    const allowedRoles = rolesHierarchy[user.role];
    if (!allowedRoles) return false;

    const isRoleAllowed = allowedRoles.includes(targetUser.role);
    const isDirectSubordinate = user.subordinates.some((id) => id.equals(targetUser._id as mongoose.Types.ObjectId));
    return isRoleAllowed && isDirectSubordinate;
}

function isAdmin(user: IUser | IAdmin | IPlayer): boolean {
    return user.role === "admin";
}

export { rolesHierarchy, permissions, hasPermission, isAdmin, isSubordinate };