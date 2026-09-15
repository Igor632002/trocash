"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchUserConversations } from "@/lib/dal/chat";

export default function ChatTestPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        testChat();
    }, []);

    async function testChat() {
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
                setError("Користувач не авторизований.");
                return;
            }

            setUser(currentUser);

            const result =
                await fetchUserConversations(currentUser.id);

            console.log("TEST conversations:", result);

            setConversations(result);
        } catch (err) {
            console.error("Chat test error:", err);
            setError(err?.message || "Помилка завантаження.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <main style={{ padding: "30px" }}>
                <h1>Chat Test</h1>
                <p>Завантаження...</p>
            </main>
        );
    }

    return (
        <main
            style={{
                maxWidth: "900px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <h1>Chat Test</h1>

            {error && (
                <div
                    style={{
                        color: "red",
                        marginBottom: "20px"
                    }}
                >
                    {error}
                </div>
            )}

            {user && (
                <div style={{ marginBottom: "20px" }}>
                    <strong>User ID:</strong>
                    <br />
                    {user.id}
                </div>
            )}

            <h2>
                Conversations: {conversations.length}
            </h2>

            {conversations.length === 0 ? (
                <p>Розмов не знайдено.</p>
            ) : (
                <div>
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.conversation_id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "15px",
                                marginBottom: "15px"
                            }}
                        >
                            <p>
                                <strong>
                                    Conversation ID:
                                </strong>{" "}
                                {conversation.conversation_id}
                            </p>

                            <p>
                                <strong>Item ID:</strong>{" "}
                                {conversation.item_id}
                            </p>

                            <p>
                                <strong>User 1:</strong>{" "}
                                {conversation.user1_id}
                            </p>

                            <p>
                                <strong> User 2:</strong>{" "}
                                {conversation.user2_id}
                            </p>

                            <p>
                                <strong>Offer:</strong>{" "}
                                {conversation.offers?.title ||
                                    "—"}
                            </p>

                            <p>
                                <strong>Image:</strong>{" "}
                                {conversation.offers?.image_url ||
                                    "—"}
                            </p>

                            <p>
                                <strong>Created:</strong>{" "}
                                {conversation.created_at}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

