"use server";

import { createAdminClient } from "@/lib/appwrite";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OAuthProvider } from "node-appwrite";

export async function signUpWithGithub(): Promise<never> {
  const { account } = await createAdminClient();

  const origin: string | null = (await headers()).get("origin");

  const redirectUrl: string = await account.createOAuth2Token(
    OAuthProvider.Github,
    `${origin}/oauth`,
    `${origin}/sign-up`
  );

  return redirect(redirectUrl);
}

export async function signUpWithGoogle(): Promise<never> {
  const { account } = await createAdminClient();

  const origin: string | null = (await headers()).get("origin");

  const redirectUrl: string = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${origin}/oauth`,
    `${origin}/sign-up`
  );

  return redirect(redirectUrl);
}
