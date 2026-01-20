This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

1. unlock the sign-up endpoint so it can be used without authentication:

comment the following like in src/lib/auth.ts in the emailAndPassword object
#disableSignUp: true

2. docker compose up -d

3. When you docker containers are created your /auth/sign-up/emil endpoint will be open so you can create your first user. Run the following command:

```bash
curl -X POST http://localhost/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example User",
    "email": "example@example.com",
    "password": "pass",
    "username": "example"
  }'
```
This creates a user in better-auth with "user" priveleges

4. Now enter you mysql database with the following command:

```bash
# uses host shell env vars (DB_USER/DB_PASSWORD/DB_NAME)
docker compose exec db mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME"
```

5. upgrade user to admin:

```sql
UPDATE `user` SET role = 'admin' WHERE email = 'example@example.com';
```


6. lock the sign-up endpoint so it cannot be used without authentication:

uncomment the following like in src/lib/auth.ts
#disableSignUp: true,


7. Rebuild and recreate web container to reflect change in /auth/sign-up/email endpoint

``` bash
docker compose up --build web
```






### Other Useful commands:

- docker compose down -v                  # stop containers and remove volumes (DB data wiped)
- docker compose down                     # only stops containers
- docker compose up --build               # recreates all containers
- docker compose up --build <servicename> # recreates specific service







### Duplicate Child Behavior:
Exact duplicate (same child + DOB + same parent contact)

Treat it as idempotent success, not an error.

Message: “✅ {Child} is already on the waitlist. We’ll be in touch—no need to resubmit.”

 show Child and parent information


### On successful Waitlist Registration:
Show a clear confirmation message
“Thanks! {Child} is on the waitlist. We’ll reach out soon.”

--possibly email confirmation


### On invalid


# Tests

## Waitlist Registration
- Try add child with invalid child age
- Try to add duplicate child
- Try to add child with 1 and 2 existing parents
- try to add child with mising required field



# API REs
So I wanted to create a structured method of getting reponses from all APIs from webserver so that I could both recieve data, perform conditional rendering, and do error handling in a regular method. The one issue with my API Res object is that data has to be open ended because each api will have a different shape to the data being passed and recieved so I need to make sure that I generate that data in a safe way with type script within the API route

I am wondering if I was necessary to do this because the main purpose was for structured error hanlding so it might have just been a better idea to just keep the API data response separate for error object and return both of them to client.(not just error handling though also helps with conditional rendering and redirect direction)

-Better way to do return page

-Check for advice on whether I am managing Error Codes is a good and readable way and if the way I have delivering error code from backend to front
 -Also When should you be making a specific Error class

-Also I want to know if my naming convention is good or bad

## ERROR Hanlding

So the API REs stores "caughtErrors" and "uncaughtErrors" these sets will hold either endpoint specific
or database specific errors. each of these error codes will be classified as either caught or uncaught
if the error is caught then it will be handled specifically based on the cause and a more specified error
message will be relayed to the user. If there are uncaught errors it will take the user to a more generalized
error page and the error will be logged and a notification will be sent to the system admin so they can handle
the issue



MY function:
export const mustString = (fd: FormData, key: string,errorState:EndpointErrorResponse) => {
    const v = fd.get(key);
    if (typeof v !== "string" || v.trim() === "") {
        errorState.add(API_ERROR_CODES.UNKOWN_API_ERROR);
        errorState.log(`Expected ${key} value from waitlist form but got none`);
        return "";
    }
    return v.trim();
};


returns a "" instead of aborting this does not seem like a clean way to do this even though it couldnt result in an issue


instead try constructing the object in try catch blow throw error

make error object work so that instead of .adding and .logging you just redefine throw and that way it will abort additional lines of code from running because Ideally after you caught an error you shouldn ever have to write additiona lines of code just to exit gracefully especially in a high level language like JS

--nvm Downside: you only catch the first error — you don’t know if childName, parentName, and dob were all wrong unless you re-run validation.


### logging errors:
Fire and forget
call async function without await so it run the code but without slowing the main response pipeline




# Waitlist Functionality Checklist
[x] prevents duplicate entities
    [x] doesn't create duplicate child entities
    [x] doesn't create duplicate parent entities if multiple children share parents
[x] When provides invalid data in form it should just stay to form page
    [x] invalid inputs should be highlighted in red
    [x] corrected inputs highlighting should be removes
[x] When there is an uncaughtError it should navigate use to error page
[x] When procedure goes through should take the user to the success page



## Set Allowed origins so that requests can only be run from website
https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions#allowedorigins

This isnt what your looking for you're looking for trusted origins which is a Next.js functionality

Allowed origins does the following:
ChatGPT said:

In Next.js, allowedOrigins doesn’t make Server Actions into public endpoints you can call from tools like Postman. Instead, it simply lets you specify extra trusted domains where your app is running (like other subdomains or a proxy) so that those frontends can still invoke your Server Actions. By default only the same origin is allowed, and with allowedOrigins you extend that protection to multiple app origins while keeping CSRF safety intact.


### Week of 9/7

[x] Setup Authentication
    [x]setup user signup
    [x]setup user signin
[] Setup Authorization
    [] Manually Create Admin Users
    [] Admin Users should be able to
        [] Should be able to add Organization Teachers
        [] Should be able to delete Organization Teachers
        [] Should be able to add children
        [] Should be able to remove children
        [] Should be able to edit children data
        [] Should be able to edit event calendar events
        [] Should be able to generate reciepts
    [] All organization members should be able to
        [] Visit the Admin Dashboard
        [] View Class Data
        [] View Children Data
        [] Print signin Sheet
        [] Print Emergency Roster
        [] Print Teacher Signin Sheet
[] Enforce Access Control

? What is the purpose of session: list revoke delete?

- Create organization
- delete users


### Blockers

What is the purpose of the API routes if you are just using serveractions?
How did he find out that you can get the user data from session

