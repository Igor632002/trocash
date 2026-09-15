"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { copy as UI_COPY } from "@/lib/uiResources";

function detectLocale(preferred) {
  if (preferred) {
    return preferred === "ua" ? "uk" : preferred;
  }
  if (typeof navigator === "undefined") return "uk";
  const lang = (navigator.language || navigator.userLanguage || "").toLowerCase();
  if (lang.startsWith("pt")) return "pt";
  if (lang.startsWith("en")) return "en";
  if (lang.startsWith("uk") || lang.startsWith("ua")) return "uk";
  return "uk";
}

export default function InterestedButton({ offerId, copy: copyProp, lang }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sessionUser, setSessionUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [locale, setLocale] = useState("uk");

  useEffect(() => {
    setLocale(detectLocale(lang));
  }, [lang]);

  const ui = UI_COPY[locale] || UI_COPY.uk || {};
  const ib = ui.interestedButton || UI_COPY.interestedButton || {};
  const copy = { ...ib, ...(copyProp || {}) };

  useEffect(() => {
    let mounted = true;
    async function loadSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSessionUser(data?.session?.user || null);
      } catch (e) {
        console.warn("getSession error", e);
      }
    }
    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null);
    });
    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  async function handleClick() {
    setError("");
    if (!sessionUser) {
      setAuthModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const senderEmail = sessionUser?.email || "anonymous";
      const res = await fetch(`/api/offers/${offerId}/interested`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderEmail }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(body?.message || res.statusText);
      }
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  }
  if (sent) return <button disabled className="gold-btn light-btn large nav-btn">{copy.sent || "Message sent"}</button>;

  return (
    <>
      <button onClick={handleClick} disabled={loading} className="gold-btn large btn-centered">
        {loading ? (copy.sending || "Sending…") : (copy.interested || "Interested")}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

      {authModalOpen && (
        <div className="panel modal-backdrop" role="dialog" aria-modal="true" onClick={() => setAuthModalOpen(false)}>
          <aside className="drawer modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{copy.signInTitle}</h3>
              <button className="close" onClick={() => setAuthModalOpen(false)}>×</button>
            </div>
            <p style={{ marginTop: 10 }}>{copy.signInText}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                className="gold-btn large btn-centered"
                onClick={() => {
                  setAuthModalOpen(false);
                  if (typeof window !== "undefined") window.location.href = "/auth";
                }}
              >
                {copy.signInButton}
              </button>
              <button className="nav-btn ghost-btn" onClick={() => setAuthModalOpen(false)}>
                {copy.cancelButton}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}