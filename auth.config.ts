import type { NextAuthConfig, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProviders from "@auth/core/providers/credentials";
import ResendProvider from "@auth/core/providers/resend";
import prisma from "@/lib/prisma";
import { bcryptPasswordCompare } from "@/lib/bcrypt";
import { SESSION_MAX_AGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { SignInSchema } from "@/app/_schemas/auth.schema";

export const config = {
  adapter: PrismaAdapter(prisma), //This tells next-auth to use Prisma (a database ORM) to store and retrieve user and session data.
  useSecureCookies: false,
  trustHost: true,
  session: {
    strategy: "database",
    maxAge: SESSION_MAX_AGE / 1000,
  },
  providers: [
    CredentialsProviders({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          const validateFields = SignInSchema.safeParse(credentials);
          console.log({ credentials, validateFields });

          if (!validateFields.success) return null;

          const user = await prisma.user.findUnique({
            where: { email: validateFields.data.email },
            select: { id: true, hashedPassword: true },
          });

          console.log({ ...user });

          if (!user) return null;

          const match = await bcryptPasswordCompare(
            validateFields.data.password,
            user.hashedPassword,
          );

          console.log({
            hashedPassword: user.hashedPassword,
            password: validateFields.data.password,
            match,
          });

          if (!match) return null;

          // issue a challenge

          return { ...user, requires2FA: true };
        } catch (error) {
          console.log({ error });
          return null;
        }
      },
    }),
    ResendProvider({}),
  ],
  pages: {
    signIn: routes.signIn,
    signOut: "/auth/sign-out",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ user, token }) {
      console.log({
        expires: new Date(Date.now() + SESSION_MAX_AGE),
        sessionToken: crypto.randomUUID(),
        userId: user.id as string,
        requires2FA: user.requires2FA as boolean,
      });
      const session = await prisma.session.create({
        data: {
          expires: new Date(Date.now() + SESSION_MAX_AGE),
          sessionToken: crypto.randomUUID(),
          userId: user.id as string,
          requires2FA: user.requires2FA as boolean,
        },
      });

      console.log({ session });

      if (!session) return null;
      if (user) token.requires2FA = user.requires2FA;
      token.id = session.sessionToken;
      token.exp = session.expires.getTime();

      return token;
    },

    async session({ session, user }) {
      const newSession = {
        user,
        requires2FA: session.requires2FA,
        expires: session.expires,
      };

      return newSession;
    },
  },
  jwt: {
    encode: async ({ token }) => token?.id as string,
  },
} as NextAuthConfig;
