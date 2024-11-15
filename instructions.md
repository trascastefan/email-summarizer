# Project overview
Your goal is to build a next.js app that allows users to easily summarize key aspects of their emails(that user decides) from their mailbox and summarize them in a nice table.
You will be using Next.js 14, tailwind and Lucid icon.

# Core functionality

## 1. Form that allows user to enter email addresses, 1 by one or in bulk 
- Users should be able to enter a single email address or a bulk list of email addresses
- Form should verify that the email addresses are valid
- Once email address has been added and verified as valid format, it should be displayed differently in the UI to show that it has been added
- There should be a visible error message if the email address is invalid
- There should be a max limit of 20 email addresses

## 2. Connect to the users email address using Gmail API
- Have a connect button that will allow users to connect to their email address
- Once connected, the app should be able to fetch the emails from the inbox
- There should be a loading screen while the emails are being fetched
- There should be a visible error message if the connection fails
- There should be a visible success message if the connection is successful

## 3. Email retrieval
- After the user has clicked on the connect button and the connection is successful the app should be able to retrieve emails from the inbox
- There should be a loading screen while the emails are being fetched
- There should be a visible error message if the emails are not being fetched
- There should be a visible success message if the emails are being fetched
- The app should only retrieve the emails from the given email addresses given by the user
- The app should only retrieve the emails from the past 30 days

## 4. Data parsing
- take the email content of each email and parse it into a JSON object that contains the following information:
- subject
- date
- sender
- body 

## 5. Harmonize common aspects of the emails from those particular addresses and offer as tags
- Use OpenAI structured output to find common tags
- use gpt 4o and zod for defining data structure
- create a prompt andask it to find a maximum of 10 common tags between the emails
- strictly follow OpenAI documentation as code implementation example
- if there are more than 10 tags, ask it to find the top 10
- if there are less than 10 tags it feels strongly about there can be less than 10 tags but more than 3
- show the common tags in the UI

## 6. ALlow users to select the tags or add more tags
- allow user to toggle the tags
- allow user to add more tags

## 7. Create structured data for each email
- use OpenAI structured output to define the data structure
- use gpt 4o and zod for defining data structure
- create a prompt and ask it to extract for each email the information pertaining only to each of the selected tags in a structured output
- most of the information should be extracted from the email body but some of the tagged aspects could be extracted from other metadata available in the email
- the output should be a JSON object that contains the following information:
- tag 1
- tag 2
- tag 3
- tag 4
- tag 5
- tag 6
- tag 7
- tag 8
- tag 9
- tag 10

-  within each tag the info should be concise but if there are exact informations those ex. IBAN, URLs , Addresses, Phone, those should be displayed as they are


## 8. Build a timeline table that shows in a structured manner the table subject, date, sender, and each of the selected tags
- Sort the table by sender, nesting multiple emails from the same sender
- Secondary sort by date
- Tertiary sort by subject
- Add a search bar that allows users to search for specific emails
- Add the selected tags to the table as columns
- add the structured data to the table as rows


# Doc

## Next.JS 15 AUTH Documentation
https://dev.to/shieldstring/nextjs-15-authentication-1al7
As of Next.js 15, handling authentication has become more robust and flexible, especially with its advanced server components, Actions API, and middleware capabilities. In this article, we'll explore the best practices for implementing authentication in a Next.js 15 application, covering essential topics such as server components, middleware, Actions, and session management.

Table of Contents
Overview of Authentication in Next.js 15
Setting Up Authentication
Using Server Components for Authentication
Handling Authentication with Actions
Implementing Middleware for Auth Guards
Session Management and Security Best Practices
Conclusion
Overview of Authentication in Next.js 15
Next.js 15 enhances the server-side rendering capabilities and introduces new tools for handling authentication, especially in the context of server components and the Actions API. With server components, you can securely manage authentication on the server without exposing sensitive data to the client, while the Actions API allows seamless server communication. Middleware can help protect routes and dynamically check user permissions, making authentication flow more secure and user-friendly.

Setting Up Authentication
To start, choose an authentication strategy suitable for your app. Common approaches include:

JWT (JSON Web Tokens): Ideal for stateless apps, where tokens are stored on the client.
Session-Based Authentication: Suitable for apps with session storage on the server.
OAuth: For integrations with third-party providers (Google, GitHub, etc.).
1. Install next-auth for Authentication
For applications requiring OAuth, Next.js integrates well with next-auth, which simplifies session and token management.

npm install next-auth
Configure it in the Next.js 15 setup using /app/api/auth/[...nextauth]/route.ts:

// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
Using Server Components for Authentication
In Next.js 15, server components allow you to render components on the server and control access to data securely.

Fetching User Session in Server Components: This reduces dependency on client-side state and avoids exposing sensitive data in the client. You can fetch user session data directly in a server component.

Example of Server-Side Authentication Check in Server Component:

   // /app/dashboard/page.tsx
   import { getServerSession } from "next-auth/next";
   import { authOptions } from "../api/auth/[...nextauth]/route";
   import { redirect } from "next/navigation";

   export default async function DashboardPage() {
     const session = await getServerSession(authOptions);

     if (!session) {
       redirect("/auth/signin");
     }

     return (
       <div>
         <h1>Welcome, {session.user?.name}</h1>
       </div>
     );
   }
Here, getServerSession fetches the user’s session data securely on the server. If there’s no valid session, the redirect function sends the user to the login page.

Handling Authentication with Actions
The Actions API in Next.js 15 provides a way to interact with server functions directly from the client. This is especially useful for login, logout, and registration actions.

Example: Creating a Login Action
// /app/actions/loginAction.ts
"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const loginAction = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    return { user: session.user };
  } else {
    throw new Error("Authentication failed");
  }
};
Usage of Login Action in a Component
// /app/components/LoginButton.tsx
"use client";

import { loginAction } from "../actions/loginAction";

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      const user = await loginAction();
      console.log("User logged in:", user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return <button onClick={handleLogin}>Log In</button>;
}
The loginAction is securely defined as a server action, and the client can trigger it without exposing sensitive data.

Implementing Middleware for Auth Guards
Middleware in Next.js 15 provides a powerful way to protect routes by verifying authentication status on the server before loading pages.

Example Middleware for Route Protection
To secure pages like /dashboard and /profile, create middleware in middleware.ts.

// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token");
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  if (!token && !isAuthPage) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (token && isAuthPage) {
    // Redirect to dashboard if authenticated and trying to access auth page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/auth/:path*"],
};
Session Management and Security Best Practices
Maintaining secure sessions and protecting user data are critical in any authentication flow.

Use HTTP-Only Cookies for Token Storage:

Avoid storing JWTs in localStorage or sessionStorage. Use HTTP-only cookies to prevent XSS attacks.
Session Expiry and Refresh Tokens:

Implement short-lived access tokens and refresh tokens to ensure sessions remain secure. You can use next-auth's session management features for this.
Role-Based Access Control (RBAC):

Assign roles to users and authorize actions based on their roles. In next-auth, this can be done using session objects or through middleware and actions.
Cross-Site Request Forgery (CSRF) Protection:

Use CSRF protection to prevent unauthorized requests from malicious sites. next-auth includes CSRF protection by default.
Secure Headers and HTTPS:

Always serve your application over HTTPS and set secure headers like Content-Security-Policy, Strict-Transport-Security, and X-Frame-Options.
Conclusion
Next.js 15 brings robust tools and components for managing authentication securely. Leveraging server components, Actions, and middleware ensures that sensitive data is protected on the server and reduces the risks of exposing information to the client.

## OpenAI structured output example
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const ResearchPaperExtraction = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  abstract: z.string(),
  keywords: z.array(z.string()),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure." },
    { role: "user", content: "..." },
  ],
  response_format: zodResponseFormat(ResearchPaperExtraction, "research_paper_extraction"),
});

const research_paper = completion.choices[0].message.parsed; 

# Important implementation details

## 0. Adding logs
- Always add server side logs to your code so we can debug any potential issues

## 1. Project setup
- All new components should go in /components at the root (not in the app folder) and be named like
example-component.tsx unless otherwise specified
- All new pages go in /app
- Use the Next.js 14 app router
- All data fetching should be done in a server component and pass the data down as props
- Client components (useState, hooks, etc) require that 'use client' is set at the top of the file

## 2. Server-Side API Calls:
- All interactions with external APIs (e.g., Reddit, OpenAI) should be performed server-side.^ Pull up for |
- Create dedicated API routes in the 'pages/api directory for each external API int
- Client-side components should fetch data through these API routes, not directly fi

## 3. Environment Variables:
- Store all sensitive information (API keys, credentials) in environment variables.
- Use a ''env. local' file for local development and ensure it's listed in ' gitigno
- For production, set environment variables in the deployment platform (e.g., Verce
- Access environment variables only in server-side code or API routes.

## 4. Error Handling and Logging:
- Implement comprehensive error handling in both client-side components and server-side API routes
- Log errors on the server-side for debugging purposes. Case study: Build F
- Display user-friendly error messages on the client-side. 

## 5. Type Safety:
- Use TypeScript interfaces for all data structures, especially API responses.
- Avoid using 'any type; instead, define proper types for all variables and function parameters.

## 6. API Client Initialization:
• Initialize API clients (e.g., Snoowrap for Reddit, OpenAI) in server-side code only.
- Implement checks to ensure API clients are properly initialized before use.

## 7. Data Fetching in Components:
- Use React hooks (e-g., 'useEffect) for data fetching in client-side components.
- Implement loading states and error handling for all data fetching operations.

## 8. Next.js Configuration:
- Utilize 'next.config.mjs' for environment-specific configurations.
- Use the 'env property in 'next.config.mjs' to make environment variables available to the application.

## 9. CORS and API houtes:
- Use Next.js API routes to avoid CORS issues when interacting with external APIs.
- Implement proper request validation in API routes.

## 10. Component Structure:
- Separate concerns between client and server components.
- Use server components for initial data fetching and pass data as props to client components.

## 11. Security:
- Never expose API keys, credentials, or other sensitive information in the client-side code.
