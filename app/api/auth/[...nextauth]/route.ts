import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const { username, password } = credentials;

        try {
          const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || process.env.SITE_URL;
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error?.message || "Login failed");
          }

          const result = await response.json();

          if (result.data?.access_token) {
            const token = result.data.access_token;
            const refreshToken = result.data.refresh_token;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const userPayload = JSON.parse(jsonPayload);

            return {
              id: userPayload.user_id?.toString() || username,
              email: userPayload.email,
              accessToken: token,
              refreshToken,
              user: userPayload
            };
          }

          return null;
        } catch (error) {
          throw error;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      // Pertama kali login — simpan semua dari user
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiry: Date.now() + 55 * 60 * 1000,
          user: user.user,
        }
      }

      // Token masih valid
      if (Date.now() < (token.accessTokenExpiry as number)) {
        return token
      }

      // Token expired → refresh ke backend
      try {
        const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || ""
        const res = await fetch(`${apiUrl}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: token.refreshToken }),
        })
        if (!res.ok) throw new Error("Refresh failed")
        const data = await res.json()
        return {
          ...token,
          accessToken: data.data.access_token,
          refreshToken: data.data.refresh_token ?? token.refreshToken,
          accessTokenExpiry: Date.now() + 55 * 60 * 1000,
          error: undefined,
        }
      } catch {
        return { ...token, error: "RefreshTokenError" }
      }
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user = token.user;
      session.error = token.error;

      return session;
    }
  },

  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
