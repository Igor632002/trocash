import { supabase } from "@/lib/supabase";

/**
 * Отримати існуючу розмову або створити нову.
 *
 * user1_id = власник пропозиції
 * user2_id = користувач, який хоче зв'язатися
 *
 * item_id = ID пропозиції
 */
export async function getOrCreateConversation(
  offerId,
  ownerId,
  currentUserId
) {
  if (!offerId) {
    throw new Error("Missing offer id");
  }

  if (!ownerId) {
    throw new Error("Missing offer owner id");
  }

  if (!currentUserId) {
    throw new Error("Missing current user id");
  }

  // Власник не може створити чат сам із собою
  if (ownerId === currentUserId) {
    throw new Error("You cannot start a conversation with yourself");
  }

  // --------------------------------------------------
  // 1. Шукаємо існуючу conversation
  // --------------------------------------------------

  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("*")
    .eq("item_id", offerId)
    .eq("user1_id", ownerId)
    .eq("user2_id", currentUserId)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  if (existing) {
    return existing;
  }

  // --------------------------------------------------
  // 2. Conversation не існує — створюємо
  // --------------------------------------------------

  const { data: created, error: createError } = await supabase
    .from("conversations")
    .insert([
      {
        item_id: offerId,
        user1_id: ownerId,
        user2_id: currentUserId,
      },
    ])
    .select("*")
    .single();

  if (createError) {
    throw createError;
  }

  return created;
}
export async function fetchUserConversations(userId) {
  if (!userId) {
    throw new Error("Missing user id");
  }

  // 1. Отримуємо розмови користувача
  const { data: conversations, error: conversationsError } =
    await supabase
      .from("conversations")
      .select(`
        conversation_id,
        item_id,
        user1_id,
        user2_id,
        created_at,

        offers (
          id,
          title,
          image_url
        ),

        user1:profiles!conversations_user1_id_fkey (
          id,
          display_name
        ),

        user2:profiles!conversations_user2_id_fkey (
          id,
          display_name
        )
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order("created_at", {
        ascending: false
      });

  if (conversationsError) {
    console.error(
      "fetchUserConversations conversations error:",
      conversationsError
    );

    throw conversationsError;
  }

  if (!conversations || conversations.length === 0) {
    return [];
  }

  // 2. ID усіх розмов
  const conversationIds =
    conversations.map(
      (conversation) =>
        conversation.conversation_id
    );

  // 3. Отримуємо повідомлення
  const { data: messages, error: messagesError } =
    await supabase
      .from("messages")
      .select(`
        message_id,
        conversation_id,
        sender_id,
        message,
        created_at,
        is_read
      `)
      .in(
        "conversation_id",
        conversationIds
      )
      .order("created_at", {
        ascending: false
      });

  if (messagesError) {
    console.error(
      "fetchUserConversations messages error:",
      messagesError
    );

    throw messagesError;
  }

  // 4. Знаходимо останнє повідомлення
  //    та кількість непрочитаних
  const lastMessages = {};
  const unreadCounts = {};

  for (const message of messages || []) {
    const conversationId =
      message.conversation_id;

    // Останнє повідомлення
    if (!lastMessages[conversationId]) {
      lastMessages[conversationId] =
        message;
    }

    // Непрочитані повідомлення,
    // які надіслав НЕ поточний користувач
    if (
      !message.is_read &&
      message.sender_id !== userId
    ) {
      unreadCounts[conversationId] =
        (unreadCounts[conversationId] || 0) + 1;
    }
  }

  // 5. Формуємо результат
  return conversations.map(
    (conversation) => {
      const conversationId =
        conversation.conversation_id;

      return {
        ...conversation,

        lastMessage:
          lastMessages[conversationId] ||
          null,

        unreadCount:
          unreadCounts[conversationId] ||
          0
      };
    }
  );
}
