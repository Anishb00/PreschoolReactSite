import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";
import {PROJECT_PERMISSIONS,USER_PRIVILEGES} from "@/lib/permissions";


export const statement = {
    ...defaultStatements, 
    project: PROJECT_PERMISSIONS, // <-- Permissions available for created roles
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({ 
    project: USER_PRIVILEGES, 
    user: [],
    session:[]
}); 

export const admin = ac.newRole({ 
    project: PROJECT_PERMISSIONS, 
    user: ["create","delete"],
    session:[]
}); 