"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import OfferActions from "./OfferActions.client";
import demoListings from "@/lib/data/demoListings";
import { useRouter } from "next/navigation";

export default function OwnerOffers({ ownerId }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    async function loadOffers() {
      if (!ownerId) return;
      const { data } = await supabase.auth.getSession();
      const sessUser = data?.session?.user ?? null;

      if (!mounted) return;
      if (!sessUser) {
        router.push("/auth");
        return;
      }
      if (sessUser.id !== ownerId) {
        setOffers([]);
        setLoading(false);
        return;
      }

      setUser(sessUser);
      setLoading(true);
      const { data: rows = [], error } = await supabase
        .from("offers")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      if (mounted) {
        setOffers(rows || []);
        setLoading(false);
      }
    }

    loadOffers();
    return () => { mounted = false; };
  }, [ownerId, router]);

  if (loading) return <div style={{ padding: 20 }}>Carregando...</div>;
  if (!user) return null;
  if (user.id !== ownerId) return (
    <main style={{ padding: 20 }}>
      <h1>Não autorizado</h1>
    </main>
  );

  return (
    <section style={{ padding: 20 }}>
      {offers.length === 0 ? (
        <p>Não há ofertas a mostrar.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {offers.map(o => {
            const img =
              o.image_url ||
              (o.photo_urls && o.photo_urls[0]) ||
              demoListings[(o.id || "").toString().length % demoListings.length].image;

            const isHidden = o.status && o.status !== "active";

            return (
              <li key={o.id} style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", gap: 12 }}>
                <div
                  className="listing-image"
                  style={{
                    width: 140,
                    minWidth: 140,
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 8,
                    filter: isHidden ? "grayscale(40%) brightness(60%)" : undefined,
                    opacity: isHidden ? 0.6 : 1,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <a href={`/offers/${o.id}`} style={{ color: "#1a73e8", textDecoration: "none" }}>
                    <strong>{o.title || `Oferta ${o.id}`}</strong>
                  </a>

                  {isHidden && (
                    <div style={{ color: "#b33", marginTop: 6, fontWeight: 600 }}>
                      Прихований
                    </div>
                  )}
                  <div style={{ color: "#666", marginTop: 6 }}>{o.area} · {o.wish}</div>
                  <div style={{ marginTop: 8 }}>
                    <OfferActions id={o.id} onDone={() => {
                      // reload the offers list after an action (delete/hide)
                      (async () => {
                        setLoading(true);
                        const { data: rows = [], error } = await supabase
                          .from("offers")
                          .select("*")
                          .eq("owner_id", ownerId)
                          .order("created_at", { ascending: false });
                        if (error) console.error(error);
                        setOffers(rows || []);
                        setLoading(false);
                      })();
                    }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}