import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './database/drizzle';
import { eq } from 'drizzle-orm';
import { usersTable } from './database/schema';
import { compare } from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }
        const user = await db.select().from(usersTable).where(eq(usersTable.email, credentials.email.toString())).limit(1);

        if (user.length === 0) return null;

        const isPasswordValid = await compare(credentials.password.toString(), user[0].password);

        if (!isPasswordValid) return null;

        return {
          id: user[0].id.toString(),
          email: user[0].email.toString(),
          name: user[0].fullName.toString(),
        } as User;
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
