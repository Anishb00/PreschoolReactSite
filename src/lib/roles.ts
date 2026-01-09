import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";
import {ADMIN_PRIVILEGES, PROJECT_PERMISSIONS ,USER_PRIVILEGES} from "@/lib/permissions";

// Defines what priveleges are available for each key
export const statement = {
    ...defaultStatements,
    project: PROJECT_PERMISSIONS, // <-- Permissions available for created roles
} as const;
export const ac = createAccessControl(statement);

//Defines the the privileges of each role
export const user = ac.newRole({
    project: USER_PRIVILEGES,
    user: [],
    session:[]
});
export const admin = ac.newRole({
    project: ADMIN_PRIVILEGES,
    user: ["create","delete"],
    session:[]
});