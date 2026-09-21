"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import OfferActions from "./OfferActions.client";
import demoListings from "@/lib/data/demoListings";
import { useRouter } from "next/navigation";
import { copy as UI_COPY } from "@/lib/uiResources";
const L = UI_COPY.pt;

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
    <>
      <section className="content-section section" style={{ padding: 20 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ marginBottom: 8 }}>{L.ownerOffersHeading}</h1>

          <hr></hr>
          <section>
            {offers.length === 0 ? (
              <p>{L.noResults}</p>
            ) : (

              <ul className="listing-grid" style={{ listStyle: "none", padding: 0 }}>
                {offers.map(o => {
                  const img =
                    o.image_url ||
                    (o.photo_urls && o.photo_urls[0]) ||
                    demoListings[(o.id || "").toString().length % demoListings.length].image;

                  const isHidden = o.status && o.status !== "active";

                  return (
                    <li key={o.id} style={{ listStyle: 'none', padding: 0, marginBottom: 14 }}>
                      <article className="listing-card card">
                        <div
                          className="listing-image"
                          style={{
                            backgroundImage: `url(${img})`,
                            filter: isHidden ? "grayscale(40%) brightness(60%)" : undefined,
                            opacity: isHidden ? 0.6 : 1,
                          }}
                        >
                          {/* optional badge area kept empty to match main listing card */}
                        </div>

                        <div className="listing-body card-body">
                          <h3 style={{ margin: '6px 0 6px', color: '#1a73e8' }}>{o.title || `Oferta ${o.id}`}</h3>
                          <small style={{ marginBottom: 6 }}>{o.area} · {o.wish}</small>
                          <div className="swap-line meta">
                            <span>{L.descriptionLabel || 'Descrição'}</span>
                            <b>{(o.description || o.details || '').split('\n')[0] || o.wish || '—'}</b>
                          </div>

                          <OfferActions id={o.id} onDone={async () => {
                            setLoading(true);
                            const { data: rows = [], error } = await supabase
                              .from("offers")
                              .select("*")
                              .eq("owner_id", ownerId)
                              .order("created_at", { ascending: false });
                            if (error) console.error(error);
                            setOffers(rows || []);
                            setLoading(false);
                          }} />
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </section>
    </>
  );
}