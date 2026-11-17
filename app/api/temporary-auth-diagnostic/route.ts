import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const providedToken = request.headers.get("x-diagnostic-token") ?? "";

  const expectedToken = process.env.AUTH_DIAGNOSTIC_TOKEN ?? "";

  if (!expectedToken || !providedToken) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const provided = Buffer.from(providedToken);
  const expected = Buffer.from(expectedToken);

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const email = process.env.INITIAL_ADMIN_EMAIL;
    const password = process.env.INITIAL_ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json({
        diagnostic: "INCOMPLETE",
        reason: "Administrator environment variables are missing.",
      });
    }

    const databaseRows = await prisma.$queryRaw<
      Array<{ databaseName: string }>
    >`SELECT DATABASE() AS databaseName`;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        diagnostic: "COMPLETED",
        databaseName: databaseRows[0]?.databaseName ?? null,
        userFound: false,
      });
    }

    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credential",
      },
    });

    if (!account?.password) {
      return NextResponse.json({
        diagnostic: "COMPLETED",
        databaseName: databaseRows[0]?.databaseName ?? null,
        userFound: true,
        credentialFound: false,
      });
    }

    const context = await auth.$context;

    const passwordMatches = await context.password.verify({
      hash: account.password,
      password,
    });

    return NextResponse.json({
      diagnostic: "COMPLETED",
      databaseName: databaseRows[0]?.databaseName ?? null,
      databaseHost: process.env.DATABASE_HOST ?? null,
      databaseUserConfigured: Boolean(process.env.DATABASE_USER),
      userFound: true,
      credentialFound: true,
      productionPasswordMatches: passwordMatches,
    });
  } catch {
    return NextResponse.json(
      {
        diagnostic: "FAILED",
        message: "The production diagnostic encountered an error.",
      },
      { status: 500 },
    );
  }
}
