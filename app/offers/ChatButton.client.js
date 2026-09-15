"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateConversation } from "@/lib/dal/chat";
import { supabase } from "@/lib/supabase";

export default function ChatButton({ offerId, ownerId }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleChat() {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            const result = await supabase.auth.getUser();
            const user = result?.data?.user;

            if (!user) {
                alert("Please sign in to send a message.");
                return;
            }

            if (user.id === ownerId) {
                alert("This is your own offer.");
                return;
            }

            const conversation = await getOrCreateConversation(
                offerId,
                ownerId,
                user.id
            );

            if (!conversation || !conversation.conversation_id) {
                throw new Error("Conversation was not created.");
            }

            const chatUrl =
                "/chat/" + conversation.conversation_id;

            router.push(chatUrl);
        } catch (error) {
            console.error("ChatButton error:", error);
            alert(error?.message || "Failed to open chat.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleChat}
            disabled={loading}
            className="gold-btn large btn-centered"
        >
            {loading ? "..." : "Escrever"}
        </button>
    );
}
