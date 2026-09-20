import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth/cookie-server";
import NewOfferPageClient from "./NewOfferPage.client";
import { copy as uiCopy } from "@/lib/uiResources";

export default async function NewOfferPage() {
  const session = await getServerAuthSession();
  if (!session?.id) return redirect('/auth');

  return <NewOfferPageClient copy={uiCopy.pt} />;
}
