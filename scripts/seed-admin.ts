import "dotenv/config";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

async function seedAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const name = process.env.INITIAL_ADMIN_NAME || "Ammanuel Tefera";

  if (!email || !password) {
    throw new Error(
      "INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD are required.",
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(
        "A user with this email already exists. No changes were made. Check the account before seeding again.",
      );
    }

    console.log(`Creating initial administrator account for ${email}...`);

    const context = await auth.$context;

    // Create the user through Better Auth's internal adapter.

    const user = await context.internalAdapter.createUser(
      {
        email,
        name,
        emailVerified: true,
        role: "ADMIN",
      },
      {
        method: "email-password",
      },
    );

    // Hash the password using Better Auth's own password hasher.
    const hashedPassword = await context.password.hash(password);

    // Link the credential account to the new user.
    await context.internalAdapter.linkAccount({
      userId: user.id,
      providerId: "credential",
      accountId: user.id,
      password: hashedPassword,
    });

    console.log("Administrator account created successfully.");
    console.log(`Email: ${user.email}`);
    console.log("Role: ADMIN");
  } catch (error) {
    console.error("Error seeding administrator account:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
