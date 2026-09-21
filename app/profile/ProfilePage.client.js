"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useOffers } from "@/lib/hooks/useOffers";
import AccountModal from "@/app/components/home/AccountModal";



export default function ProfilePageClient({ copy, sessionUser, returnTo = "/offers" }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const activeUser = user || sessionUser || null;
  const { offers } = useOffers({ user: activeUser, copy });
  const [accountOpen, setAccountOpen] = useState(true);

  useEffect(() => {
    if (!authLoading && !activeUser) {
      router.replace("/auth");
    }
  }, [authLoading, activeUser, router]);

  useEffect(() => {
    if (accountOpen === false) {
      router.push(returnTo);
    }
  }, [accountOpen, router, returnTo]);

  if (authLoading || !activeUser) {
    return <main className="site-shell tc-page" style={{ padding: 20 }}>Carregando...</main>;
  }

  return (
    <main className="site-shell tc-page">
      <AccountModal
        copy={copy}
        user={activeUser}
        offers={offers}
        router={router}
        accountOpen={accountOpen}
        setAccountOpen={setAccountOpen}
        setWishlistOpen={() => router.push(returnTo)}
        setHeroActive={() => {}}
      />
    </main>
  );
}
