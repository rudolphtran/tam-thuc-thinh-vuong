import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isAuthRoute =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      const isProtectedRoute =
        nextUrl.pathname.startsWith("/today") ||
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/journal");

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
  providers: [],
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
