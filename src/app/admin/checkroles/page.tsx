
import {auth} from "@/lib/auth";
import {getUserID} from "@/lib/authentication";
import { string } from "better-auth";



export default async function CheckPermission(){

    var userId = await getUserID();
    // console.log(userId);
    // const permissioncheck = await authClient.admin.hasPermission({
    // userId,
    // permissions: {
    //     project: ["VIEW_DASHBOARD"],
    // },
    // });

    const data = await auth.api.userHasPermission({
        body: {
            userId,
            permission: { project: ["VIEW_DASHBOARD"] } /* Must use this, or permissions */,
        },
    });
    console.log(data);
    return(
        <div>Test</div>
    );
}