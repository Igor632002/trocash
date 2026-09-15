"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { fetchUserConversations } from "@/lib/dal/chat";

export default function ChatList() {
    const router = useRouter();

    const [conversations, setConversations] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [user, setUser] =
        useState(null);

    useEffect(() => {
        loadConversations();
    }, []);

    async function loadConversations() {
        setLoading(true);
        setError("");

        try {
            const { data, error: authError } =
                await supabase.auth.getUser();

            if (authError) {
                throw authError;
            }

            const currentUser = data?.user;

            if (!currentUser) {
                setError("Please sign in.");
                return;
            }

            setUser(currentUser);

            const result =
                await fetchUserConversations(
                    currentUser.id
                );

            setConversations(result);
        } catch (err) {
            console.error(
                "Chat list error:",
                err
            );

            setError(
                err?.message ||
                "Failed to load conversations."
            );
        } finally {
            setLoading(false);
        }
    }

    function openConversation(
        conversationId
    ) {
        router.push(
            "/chat/" + conversationId
        );
    }

    function formatMessageDate(value) {
        if (!value) {
            return "";
        }

        return new Date(value).toLocaleString(
            "pt-PT",
            {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    if (loading) {
        return (
            <main className="chat-list-page">
                <h1 className="chat-list-title">
                    Mensagens
                </h1>

                <p>Carregando...</p>
            </main>
        );
    }

    return (
        <main className="chat-list-page">

            <h1 className="chat-list-title">
                Mensagens
            </h1>

            {error && (
                <div
                    className="chat-list-empty"
                    style={{ color: "red" }}
                >
                    {error}
                </div>
            )}

            {!error &&
                conversations.length === 0 && (
                    <div className="chat-list-empty">
                        Você ainda não tem conversas.
                    </div>
                )}

            {conversations.length > 0 && (
                <div className="chat-list">

                    {conversations.map(
                        (conversation) => {

                            const otherUser =
                                conversation.user1_id ===
                                user?.id
                                    ? conversation.user2
                                    : conversation.user1;

                            const lastMessage =
                                conversation.lastMessage;

                            const image =
                                conversation.offers
                                    ?.image_url ||
                                "/placeholder.png";

                            return (
                                <button
                                    key={
                                        conversation.conversation_id
                                    }
                                    type="button"
                                    className="chat-list-item"
                                    onClick={() =>
                                        openConversation(
                                            conversation.conversation_id
                                        )
                                    }
                                >

                                    <img
                                        src={image}
                                        alt=""
                                        className="chat-list-image"
                                    />

                                    <div className="chat-list-content">

                                        <div className="chat-list-top">

                                            <span className="chat-list-offer">
                                                {conversation
                                                    .offers
                                                    ?.title ||
                                                    "Oferta"}
                                            </span>

                                            {lastMessage && (
                                                <span className="chat-list-time">
                                                    {formatMessageDate(
                                                        lastMessage.created_at
                                                    )}
                                                </span>
                                            )}

                                        </div>

                                        <div className="chat-list-user">
                                            {otherUser
                                                ?.display_name ||
                                                "Utilizador"}
                                        </div>

                                        {lastMessage ? (
                                            <div className="chat-list-message">
                                                {
                                                    lastMessage.message
                                                }
                                            </div>
                                        ) : (
                                            <div className="chat-list-message">
                                                Ainda não há
                                                mensagens.
                                            </div>
                                        )}

                                    </div>

                                    {conversation.unreadCount >
                                        0 && (
                                            <span className="chat-list-unread">
                                                {
                                                    conversation.unreadCount
                                                }
                                            </span>
                                        )}

                                </button>
                            );
                        }
                    )}

                </div>
            )}
        </main>
    );
}
