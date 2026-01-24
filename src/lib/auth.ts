import { createPool } from "mysql2/promise";
import { username, admin as adminPlugin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import pool from "@/lib/db";
import {ac,user,admin} from "@/lib/roles";

export const auth = betterAuth({
    session: {
        expiresIn: 60 * 60 * 24 * 2, // 2 days
        updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
    },
    emailAndPassword: {
        enabled: true,
        // disableSignUp: true,
        minPasswordLength:4,
        maxPasswordLength:20,
    },
    trustedOrigins: ["http://localhost:3000", "http://localhost"],
    database: pool,
    appName: "preschoolreactsite",
    plugins: [username(),
        adminPlugin({
        ac,
        roles:{
            admin,
            user
        }
    }),
    nextCookies()],
});
