"use client";

import React, { useEffect, useMemo, useState } from "react";
import { deleteWish, fetchActiveWishes, fetchWishesByOwner, updateWish } from "@/lib/dal/wishes";

export default function WishlistModal({
  copy,
  user,
  wishlistOpen,
  setWishlistOpen,
  setAccountOpen,
  wishlistReturnTo,
  setWishlistReturnTo,
  setNewWishOpen,
  setNewOfferOpen,
  setHeroActive,
}) {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [editingId, setEditingId] = useState(null);

  const visibleWishes = useMemo(() => wishes, [wishes]);

  useEffect(() => {
    if (!wishlistOpen) return;

    let active = true;

    async function loadWishes() {
      setLoading(true);
      setError("");

      try {
        const rows = user?.id
          ? await fetchWishesByOwner(user.id)
          : await fetchActiveWishes();

        if (active) {
          setWishes(rows || []);
        }
      } catch (err) {
        console.error("Failed to load wishes", err);
        if (active) {
          setError(err?.message || "Не вдалося завантажити побажання.");
          setWishes([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWishes();
    setEditingId(null);
    setDraftTitle("");

    return () => {
      active = false;
    };
  }, [wishlistOpen, user?.id]);

  function startEdit(wish) {
    setEditingId(wish.id);
    setDraftTitle(wish.title);
  }

  async function saveEdit() {
    if (!editingId) return;

    if (!user?.id) {
      setError("Потрібно увійти, щоб змінювати побажання.");
      return;
    }

    setError("");

    try {
      const nextWish = await updateWish(editingId, { title: draftTitle.trim() || undefined }, user.id);
      setWishes((current) => current.map((wish) => (wish.id === editingId ? { ...wish, ...nextWish } : wish)));
    } catch (err) {
      console.error("Failed to update wish", err);
      setError(err?.message || "Не вдалося змінити побажання.");
    }

    setEditingId(null);
    setDraftTitle("");
  }

  async function hideWish(id) {
    if (!user?.id) {
      setError("Потрібно увійти, щоб приховати побажання.");
      return;
    }

    setError("");

    try {
      await updateWish(id, { status: "hidden" }, user.id);
      setWishes((current) => current.map((wish) => (wish.id === id ? { ...wish, status: "hidden" } : wish)));
    } catch (err) {
      console.error("Failed to hide wish", err);
      setError(err?.message || "Не вдалося приховати побажання.");
    }
  }

  async function unhideWish(id) {
    if (!user?.id) {
      setError("Потрібно увійти, щоб показати побажання.");
      return;
    }

    setError("");

    try {
      await updateWish(id, { status: "active" }, user.id);
      setWishes((current) => current.map((wish) => (wish.id === id ? { ...wish, status: "active" } : wish)));
    } catch (err) {
      console.error("Failed to unhide wish", err);
      setError(err?.message || "Не вдалося показати побажання.");
    }
  }

  async function removeWish(id) {
    if (!user?.id) {
      setError("Потрібно увійти, щоб видалити побажання.");
      return;
    }

    setError("");

    try {
      await deleteWish(id, user.id);
      setWishes((current) => current.filter((wish) => wish.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setDraftTitle("");
      }
    } catch (err) {
      console.error("Failed to delete wish", err);
      setError(err?.message || "Не вдалося видалити побажання.");
    }
  }

  if (!wishlistOpen) return null;

  return (
    <div className="panel modal-backdrop" onClick={() => { setWishlistOpen(false); setWishlistReturnTo?.(null); setHeroActive(null); }}>
      <aside className="drawer modal" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <h2>{copy?.wishlistTitle || "Lista de Desejos"}</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="close modal-close"
              onClick={() => {
                setWishlistOpen(false);
                if (wishlistReturnTo === "account") {
                  setAccountOpen(true);
                }
                setWishlistReturnTo?.(null);
                setHeroActive(null);
              }}
            >←</button>
            <button
              className="close modal-close"
              onClick={() => { setWishlistOpen(false); setWishlistReturnTo?.(null); setHeroActive(null); }}
            >×</button>
          </div>
        </div>

        <p style={{ color: "#7b8494" }}>{copy?.wishlistDescription || "Guarda aquilo que queres encontrar através de uma troca."}</p>
        {error && (
          <div style={{ margin: "10px 0 14px", padding: "10px 12px", borderRadius: 8, background: "#f8d7da", color: "#721c24" }}>
            {error}
          </div>
        )}
        {loading ? (
          <p style={{ color: "#7b8494" }}>A carregar...</p>
        ) : visibleWishes.length > 0 ? visibleWishes.map((wish) => {
          const isHidden = wish.status === "hidden";

          return (
          <div className="wish-item" key={wish.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", margin: "12px 0", paddingBottom: 12, borderBottom: "1px solid #e9dfcf" }}>
            <div className="wish-icon" style={{ opacity: isHidden ? 0.45 : 1, filter: isHidden ? "grayscale(35%)" : "none" }}>♡</div>
            <div style={{ flex: 1 }}>
              <div style={{ opacity: isHidden ? 0.45 : 1, filter: isHidden ? "grayscale(35%)" : "none" }}>
                <strong>{wish.title}</strong>
                <div className="meta">{wish.profiles?.area || wish.location || "—"} · Procurar troca{isHidden ? " · Приховано" : ""}</div>
                {isHidden && (
                  <div style={{ marginTop: 4, fontSize: 12, fontWeight: 700, color: "#8b6b2b" }}>
                    Приховане побажання
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => startEdit(wish)}
                >
                  Змінити
                </button>
                {isHidden ? (
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => unhideWish(wish.id)}
                  >
                    Показати
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => hideWish(wish.id)}
                  >
                    Приховати
                  </button>
                )}
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => removeWish(wish.id)}
                >
                  Видалити
                </button>
              </div>
            </div>
          </div>
          );
        }) : (
          <p style={{ color: "#7b8494" }}>Немає активних побажань.</p>
        )}

        {editingId && (
          <div style={{ marginTop: 14, padding: 12, border: "1px solid #eadfcf", borderRadius: 12, background: "#fffaf1" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Редагування побажання</label>
            <input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="gold-btn" onClick={saveEdit} style={{ flex: 1 }}>
                Зберегти
              </button>
              <button type="button" className="ghost-btn" onClick={() => { setEditingId(null); setDraftTitle(""); }} style={{ flex: 1 }}>
                Скасувати
              </button>
            </div>
          </div>
        )}

        <button className="gold-btn" style={{ marginTop: 22, width: "100%" }} onClick={() => { setWishlistOpen(false); setWishlistReturnTo?.(null); setNewWishOpen(true); setHeroActive(null); }}>
          {copy?.wishlistAddButton || "Adicionar desejo +"}
        </button>
      </aside>
    </div>
  );
}
