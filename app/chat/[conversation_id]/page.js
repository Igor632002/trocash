import ChatView from "./ChatView.client";

export default async function ChatPage({ params }) {
    const { conversation_id } = await params;

    return (
        <ChatView
            conversationId={conversation_id}
        />
    );
}