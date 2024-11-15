import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthConfig } from "next-auth";
import { getServerSession } from "next-auth/next";

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/'
  }
};

const handler = NextAuth(authConfig);

export const { GET, POST } = handler;
export const auth = () => getServerSession(authConfig);
export const signIn = handler.signIn;
export const signOut = handler.signOut;