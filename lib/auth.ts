import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { headers } from "next/headers";
import { prisma } from "./prisma";

export const auth = betterAuth({
  appName: "Amanu Properties",

  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // Prevents client payloads from injecting or overriding user role
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },

  plugins: [twoFactor()],
});

/**
 * Server-side helper to retrieve the active session from request headers.
 */
export async function getSession() {
  const reqHeaders = await headers();
  return auth.api.getSession({
    headers: reqHeaders,
  });
}

/**
 * Server-side authorization check. Returns the session if the user is authenticated
 * and possesses ADMIN privileges, otherwise returns null.
 */
export async function requireAdminSession() {
  const session = await getSession();
  if (!session || !session.user) {
    return null;
  }

  // Check custom user role
  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    return null;
  }

  return session;
}
