This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



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


### Week of 9/7