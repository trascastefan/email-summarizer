import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
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
    async jwt({ token, account, profile }) {
      // Add additional information to the token if needed
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub;
      }
      return token;
    },
    async session({ session, token }) {
      // Add additional information to the session
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/auth/error' // Error code passed in query string as ?error=
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
