import React from "react";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth/cookie-server";
import ProfilePageClient from "./ProfilePage.client";
import { copy as uiCopy } from "@/lib/uiResources";

export default async function ProfilePage(props) {
  const spRaw = props?.searchParams;
  const sp = spRaw && typeof spRaw.then === "function" ? await spRaw : spRaw;
  const returnTo = typeof sp === "string" ? (new URLSearchParams(sp).get("returnTo") ?? "/offers") : (sp?.returnTo ?? "/offers");

  const session = await getServerAuthSession();
  if (!session?.id) return redirect("/auth");

  return <ProfilePageClient copy={uiCopy.pt} sessionUser={session} returnTo={returnTo} />;
}
