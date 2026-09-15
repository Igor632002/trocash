"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ChatView({ conversationId }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadChat();
    }, [conversationId]);


    useEffect(() => {
        if (!conversationId) {
            return;
        }

        const channel = supabase
            .channel("chat-" + conversationId)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter:
                        "conversation_id=eq." + conversationId
                },
                (payload) => {
                    console.log(
                        "Realtime message:",
                        payload.new
                    );

                    setMessages((prev) => {
                        const exists = prev.some(
                            (item) =>
                                item.message_id ===
                                payload.new.message_id
                        );

                        if (exists) {
                            return prev;
                        }

                        return [...prev, payload.new];
                    });
                }
            )
            .subscribe((status) => {
                console.log(
                    "Chat realtime status:",
                    status
                );
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);


    async function loadChat() {
        setLoading(true);
        setError("");

        try {
            // 1. Поточний користувач
            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                throw userError;
            }

            const currentUser = userData?.user;

            if (!currentUser) {
                setError("Please sign in.");
                return;
            }

            setUser(currentUser);

            // 2. Завантажуємо повідомлення
            const { data, error: messagesError } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", conversationId)
                .order("created_at", {
                    ascending: true
                });

            if (messagesError) {
                throw messagesError;
            }

            setMessages(data || []);

            const unreadMessages = (data || []).filter(
                (message) =>
                    message.sender_id !== currentUser.id &&
                    !message.is_read
            );

            for (const message of unreadMessages) {
                const marked = await markMessageAsRead(
                    message.message_id
                );

                if (marked) {
                    message.is_read = true;
                }
            }

        } catch (err) {
            console.error("Chat loading error:", err);
            setError(err?.message || "Failed to load chat.");
        } finally {
            setLoading(false);
        }
    }

    async function sendMessage() {
        const messageText = text.trim();

        if (!messageText) {
            return;
        }

        if (!user) {
            setError("Please sign in.");
            return;
        }

        if (sending) {
            return;
        }

        setSending(true);
        setError("");

        try {
            const { data, error: insertError } = await supabase
                .from("messages")
                .insert([
                    {
                        conversation_id: Number(conversationId),
                        sender_id: user.id,
                        message: messageText
                    }
                ])
                .select("*")
                .single();

            if (insertError) {
                throw insertError;
            }

            setMessages((prev) => [...prev, data]);
            setText("");
        } catch (err) {
            console.error("Send message error:", err);
            setError(err?.message || "Failed to send message.");
        } finally {
            setSending(false);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                Loading chat...
            </div>
        );
    }

    return (
        <main
            style={{
                maxWidth: "700px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <h1>Chat</h1>

            <p>
                Conversation: {conversationId}
            </p>

            <div
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    minHeight: "350px",
                    padding: "20px",
                    marginTop: "20px",
                    marginBottom: "15px"
                }}
            >
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((item) => {
                        const mine =
                            item.sender_id === user?.id;

                        return (
                            <div
                                key={item.message_id}
                                style={{
                                    display: "flex",
                                    justifyContent: mine
                                        ? "flex-end"
                                        : "flex-start",
                                    marginBottom: "10px"
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: "70%",
                                        padding: "10px 14px",
                                        borderRadius: "10px",
                                        background: mine
                                            ? "#e8f0ff"
                                            : "#f1f1f1"
                                    }}
                                >
                                    {item.message}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {error && (
                <div
                    style={{
                        color: "red",
                        marginBottom: "10px"
                    }}
                >
                    {error}
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    gap: "10px"
                }}
            >
                <textarea
                    value={text}
                    onChange={(event) =>
                        setText(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Escreva uma mensagem..."
                    rows={2}
                    style={{
                        flex: 1,
                        resize: "vertical",
                        padding: "10px"
                    }}
                />

                <button
                    type="button"
                    onClick={sendMessage}
                    disabled={sending || !text.trim()}
                    className="gold-btn large"
                >
                    {sending ? "..." : "Enviar"}
                </button>
            </div>
        </main>
    );
}

async function markMessageAsRead(messageId) {
    if (!messageId) {
        return false;
    }

    try {
        const { error } = await supabase.rpc(
            "mark_message_as_read",
            {
                p_message_id: messageId
            }
        );

        if (error) {
            console.error(
                "Mark message as read error:",
                error
            );

            return false;
        }

        return true;
    } catch (err) {
        console.error(
            "Mark message as read exception:",
            err
        );

        return false;
    }
}
