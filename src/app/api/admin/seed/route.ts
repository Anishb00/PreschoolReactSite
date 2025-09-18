// // Run this script to manually create users
// import {auth} from "@/lib/auth";
// import { NextResponse } from "next/server";
// import { headers } from "next/headers";



// export async function POST(req:Request){
//     let newUser;
//     let error;
//     try{
//         const newUser = await auth.api.createUser({
//             body: {
//                 email: "test@example.com", // required
//                 password: "test-password", // required
//                 name: "Test User", // required
//                 role: "user",
//             },
//         });

//         const data = await auth.api.updateUser({
//             body: {
//                 username: "Test",
//             },
//         });
//     }catch(err){
//         error = err
//     }

//     return NextResponse.json({
//         newUser,
//         error
//     })
// }