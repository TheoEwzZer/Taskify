import { AUTH_COOKIE } from "@/features/auth/constants";
import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<unknown>> {
  const userId: string | null = request.nextUrl.searchParams.get("userId");
  const secret: string | null = request.nextUrl.searchParams.get("secret");

  const { account } = await createAdminClient();

  if (!userId || !secret) {
    return new NextResponse("Missing userId or secret", { status: 400 });
  }

  const session = await account.createSession(userId, secret);

  cookies().set(AUTH_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
