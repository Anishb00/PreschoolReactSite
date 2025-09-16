import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth.js";

import {
    inferAdditionalFields,
    usernameClient,
    adminClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "/api/client",
    plugins: [
        inferAdditionalFields<typeof auth>(),
        usernameClient(),
        adminClient(),
    ],
});