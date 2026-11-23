"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OfferEditForm from "../../OfferEdit.client";
import { copy as UI_COPY, LANGUAGES } from "@/lib/uiResources";

export default function EditOfferPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [lang, setLang] = useState("pt");
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const L = UI_COPY[lang] ?? UI_COPY.pt;

  function handleLanguageChange(event) {
    const selectedLanguage = LANGUAGES.find(({ code }) => code === event.target.value);
    if (!selectedLanguage) return;
    window.localStorage.setItem("trocash-language", selectedLanguage.code);
    document.documentElement.lang = selectedLanguage.code;
    setLang(selectedLanguage.code);
  }

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("trocash-language");
    const language = LANGUAGES.find(({ code }) => code === storedLanguage)?.code ?? "pt";
    setLang(language);
  }, []);

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
        setNotFound(true);
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

  let pageContent;
  if (!id || notFound) {
    pageContent = <h1>{L.offerNotFound}</h1>;
  } else if (loading) {
    pageContent = <h1>{L.offerLoading}</h1>;
  } else if (!authorized) {
    pageContent = <h1>{L.offerUnauthorized}</h1>;
  } else {
    pageContent = (
      <>
        <h1>{L.offerEditTitle}</h1>
        <OfferEditForm offer={offer} lang={lang} />
      </>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <label style={{ display: "block", marginBottom: 16 }}>
        {L.languageLabel}
        <select value={lang} onChange={handleLanguageChange} style={{ marginLeft: 8 }}>
          {LANGUAGES.map(({ code, label }) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
      </label>
      {pageContent}
    </main>
  );
}