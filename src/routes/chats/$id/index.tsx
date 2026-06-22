import { createFileRoute } from "@tanstack/react-router";

import { listMessages } from "@/features/chat/operations/list-messages";
import { Chat } from "@/features/chat/components/chat";

export const Route = createFileRoute("/chats/$id/")({
  loader: ({ params }) => listMessages({ data: params }),
  component: ChatPage,
});

function ChatPage() {
  const { id } = Route.useParams();
  const listMessagesResult = Route.useLoaderData();

  if (!listMessagesResult.success) {
    return <p>{listMessagesResult.error.message}</p>;
  }

  return <Chat initialMessages={listMessagesResult.data} id={id} />;
}
