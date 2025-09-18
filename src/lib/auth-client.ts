import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth.js";
import { ac, admin, user } from "@/lib/roles";


import {
    inferAdditionalFields,
    usernameClient,
    adminClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(),
        usernameClient(),
        adminClient({
            ac,
            roles: {
                admin,
                user
            }
        })
    ],
});