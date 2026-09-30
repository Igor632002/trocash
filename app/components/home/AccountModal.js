"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchUserConversations } from "@/lib/dal/chat";

export default function AccountModal({
  copy,
  user,
  offers = [],
  router,
  accountOpen,
  setAccountOpen,
  setWishlistOpen,
  setWishlistReturnTo,
  setHeroActive,
}) {
  const [chatStats, setChatStats] = useState({ totalChats: 0, unreadMessages: 0 });
  const [completedExchanges, setCompletedExchanges] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadChatStats() {
      if (!user?.id) {
        setChatStats({ totalChats: 0, unreadMessages: 0 });
        return;
      }

      try {
        const conversations = await fetchUserConversations(user.id);
        if (!active) return;

        setChatStats({
          totalChats: conversations.length,
          unreadMessages: conversations.reduce((total, conversation) => total + (conversation.unreadCount || 0), 0),
        });
      } catch (error) {
        console.error("Failed to load chat stats", error);
        if (active) {
          setChatStats({ totalChats: 0, unreadMessages: 0 });
        }
      }
    }

    loadChatStats();

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let active = true;

    async function loadCompletedExchanges() {
      if (!user?.id) {
        setCompletedExchanges(0);
        return;
      }

      try {
        const { count, error } = await supabase
          .from("offers")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", user.id)
          .eq("status", "done");

        if (error) throw error;
        if (active) setCompletedExchanges(count || 0);
      } catch (error) {
        console.error("Failed to load completed exchanges", error);
        if (active) setCompletedExchanges(0);
      }
    }

    loadCompletedExchanges();

    return () => {
      active = false;
    };
  }, [user?.id]);

  if (!accountOpen) return null;

  return (
    <div className="panel modal-backdrop" onClick={() => { setAccountOpen(false); setHeroActive(null); }}>
      <aside className="drawer modal" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>{copy?.accountModalTitle || "Meu perfil"}</h2>
          <button className="close modal-close" onClick={() => { setAccountOpen(false); setHeroActive(null); }}>×</button>
        </div>
        <div className="account-hero">
          <div className="avatar">{(user?.email || "T")[0].toUpperCase()}</div>
          <h3 style={{ margin: "12px 0 4px" }}>{copy?.accountTitle || "O teu espaço no troCASH"}</h3>
          <small>{user?.email || copy?.accountSubtitle || "Perfil, ofertas, trocas e preferências."}</small>
        </div>
        <div className="account-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
          <div className="account-card" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <strong>{offers.filter(o => o.owner_id === user?.id).length}</strong>
            <div>{copy?.currentOffersLabel || "Ofertas atuais"}</div>
            <div>
              <a
                href={user?.id ? `/offers?owner=${user.id}` : '#'}
                onClick={(e) => {
                  e.preventDefault();
                  setAccountOpen(false);
                  setHeroActive(null);
                  if (user?.id) {
                    if (router && router.push) router.push(`/offers?owner=${user.id}`);
                    else window.location.href = `/offers?owner=${user.id}`;
                  }
                }}
                style={{ color: '#1a73e8', textDecoration: 'underline' }}
              >
                {copy?.accountOffersLabel || "Ofertas publicadas"}
              </a>
            </div>
          </div>
          <div className="account-card" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <div style={{ marginTop: 8 }}>
              <strong>{chatStats.totalChats}</strong>
              <div>{copy?.accountChatCountLabel || "Total de chats"}</div>
              <div style={{ marginTop: 6 }}>
                {chatStats.unreadMessages} {copy?.accountNewMessagesLabel || "novas mensagens"}
              </div>
              <a
                href="/chat"
                onClick={(e) => {
                  e.preventDefault();
                  setAccountOpen(false);
                  setHeroActive(null);
                  if (router && router.push) router.push("/chat");
                  else window.location.href = "/chat";
                }}
                style={{ color: '#1a73e8', textDecoration: 'underline' }}
              >
                {copy?.accountChatLabel || "Chat"}
              </a>
            </div>
          </div>

          <div className="account-card" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <strong>{completedExchanges}</strong>
            <div>{copy?.accountExchangesLabel || "Trocas concluídas"}</div>
          </div>
        </div>
        <button className="nav-btn gold-btn" style={{ width: "100%", marginTop: 18 }} onClick={() => { setAccountOpen(false); setWishlistReturnTo?.("account"); setWishlistOpen(true); setHeroActive(null); }}>
          {copy?.accountOpenWishlist || "Abrir Desejos →"}
        </button>

        <button
          className="nav-btn ghost-btn"
          style={{ width: "100%", marginTop: 10 }}
          onClick={async () => {
            try {
              await supabase.auth.signOut();
            } catch (err) {
              console.error('Sign out error', err);
            } finally {
              setAccountOpen(false);
              setHeroActive(null);
              window.location.reload();
            }
          }}
        >
          {copy?.signOut || "Sair"}
        </button>
      </aside>
    </div>
  );
}
