"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OfferEditForm from "../../OfferEdit.client";

export default function EditOfferPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      // Get current user session
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user ?? null;

      if (cancelled) return;

      if (!user) {
        // not logged in -> redirect to auth
        router.push("/auth");
        return;
      }

      // fetch offer
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("id", id)
        .single();

      if (cancelled) return;

      if (error || !data) {
        setOffer(null);
        setLoading(false);
        return;
      }

      // check ownership
      if (data.owner_id !== user.id) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setOffer(data);
      setAuthorized(true);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (!id) return <main style={{ padding: 20 }}><h1>Oferta não encontrada</h1></main>;
  if (loading) return <main style={{ padding: 20 }}><h1>Carregando...</h1></main>;
  if (!authorized) return <main style={{ padding: 20 }}><h1>Não autorizado</h1></main>;
  if (!offer) return <main style={{ padding: 20 }}><h1>Oferta não encontrada</h1></main>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Editar Oferta</h1>
      <OfferEditForm offer={offer} />
    </main>
  );
}