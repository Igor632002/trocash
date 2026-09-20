"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import React from "react";

export default function PublishButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const currentUrl = React.useMemo(() => {
    const search = searchParams?.toString();
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, searchParams]);

  function handleClick(e) {
    e.preventDefault();
    router.push(user ? `/offers/new?returnTo=${encodeURIComponent(currentUrl)}` : "/auth");
  }

  return (
    <button type="button" className="gold-btn" onClick={handleClick}>
      ＋ Publicar
    </button>
  );
}
