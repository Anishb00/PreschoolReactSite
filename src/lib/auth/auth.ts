import { createPool } from "mysql2/promise";
import { username, admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import pool from "@/lib/db";

export const auth = betterAuth({
    emailAndPassword: {  
        enabled: true,
        minPasswordLength:4,
        maxPasswordLength:20,
    },
    database: pool,
    appName: "preschoolreactsite",
    plugins: [admin(), username(), nextCookies()],
});
