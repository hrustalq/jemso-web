import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";
import { compare } from "bcryptjs";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roleId: string | null;
      subscriptionId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    roleId: string | null;
    subscriptionId: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            userRoles: {
              include: { role: true },
              where: {
                OR: [
                  { expiresAt: null },
                  { expiresAt: { gt: new Date() } },
                ],
              },
            },
            subscriptions: {
              where: { status: "active" },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        if (!user?.password) {
          return null;
        }

        const isValidPassword = await compare(
          credentials.password as string,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          roleId: user.userRoles[0]?.roleId ?? null,
          subscriptionId: user.subscriptions[0]?.id ?? null,
        };
      },
    }),
    YandexProvider,
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  // @ts-expect-error - Adapter type mismatch with custom User fields (roleId, subscriptionId)
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user, token }) => {
      // For credentials provider, use token. For database sessions, use user
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub!,
            roleId: token.roleId as string | null,
            subscriptionId: token.subscriptionId as string | null,
          },
        };
      }
      
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          roleId: user.roleId,
          subscriptionId: user.subscriptionId,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.roleId = user.roleId;
        token.subscriptionId = user.subscriptionId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt", // Use JWT for credentials provider
  },
} satisfies NextAuthConfig;
