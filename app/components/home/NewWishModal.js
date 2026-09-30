"use client";

import React, { useEffect, useState } from "react";
import { insertWish } from "@/lib/dal/wishes";

function emptyForm() {
  return {
    title: "",
    description: "",
    exampleUrlsText: "",
    notes: "",
  };
}

function parseExampleUrls(text) {
  return String(text || "")
    .split(/\r?\n|,/) 
    .map((value) => value.trim())
    .filter(Boolean);
}

export default function NewWishModal({
  copy,
  user,
  newWishOpen,
  setNewWishOpen,
  setWishlistOpen,
  setHeroActive,
}) {
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!newWishOpen) return;
    setForm(emptyForm());
    setError("");
  }, [newWishOpen]);

  if (!newWishOpen) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user?.id) {
      setError("Потрібно увійти, щоб створити побажання.");
      return;
    }

    if (!form.title.trim()) {
      setError("Вкажи назву побажання.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await insertWish(
        {
          title: form.title.trim(),
          description: form.description.trim() || null,
          example_urls: parseExampleUrls(form.exampleUrlsText),
          notes: form.notes.trim() || null,
        },
        user.id
      );

      setNewWishOpen(false);
      setWishlistOpen(true);
      setHeroActive(null);
    } catch (err) {
      console.error("Failed to create wish", err);
      setError(err?.message || "Не вдалося створити побажання.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel modal-backdrop" onClick={() => { setNewWishOpen(false); setHeroActive(null); }}>
      <aside className="drawer modal" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <h2>{copy?.newWishTitle || "Створити побажання"}</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="close modal-close" onClick={() => { setNewWishOpen(false); setWishlistOpen(true); setHeroActive(null); }}>
              ←
            </button>
            <button className="close modal-close" onClick={() => { setNewWishOpen(false); setHeroActive(null); }}>
              ×
            </button>
          </div>
        </div>

        <p style={{ color: "#7b8494" }}>
          {copy?.newWishDescription || "Опиши, що саме хочеш знайти через обмін."}
        </p>

        {error && (
          <div style={{ margin: "10px 0 14px", padding: "10px 12px", borderRadius: 8, background: "#f8d7da", color: "#721c24" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <div className="field">
            <label>{copy?.wishTitleLabel || "Назва побажання"}</label>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder={copy?.wishTitlePlaceholder || "Напр.: велосипед, килим, ноутбук..."}
              required
            />
          </div>

          <div className="field">
            <label>{copy?.descriptionLabel || "Опис"}</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder={copy?.wishDescriptionPlaceholder || "Що саме шукаєш і в якому стані..."}
            />
          </div>

          <div className="field">
            <label>{copy?.wishExamplesLabel || "Приклади посилань"}</label>
            <textarea
              value={form.exampleUrlsText}
              onChange={(event) => setForm((current) => ({ ...current, exampleUrlsText: event.target.value }))}
              placeholder={copy?.wishExamplesPlaceholder || "Один URL на рядок або через кому"}
            />
          </div>

          <div className="field">
            <label>{copy?.notesLabel || "Примітки"}</label>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder={copy?.wishNotesPlaceholder || "Додаткові побажання, бюджет, умови..."}
            />
          </div>

          <button className="gold-btn large" style={{ width: "100%", marginTop: 8 }} disabled={loading}>
            {loading ? (copy?.saving || "A guardar…") : (copy?.createWishButton || "Створити побажання")}
          </button>
        </form>
      </aside>
    </div>
  );
}
