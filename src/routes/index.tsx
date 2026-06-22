import type { KeyboardEvent } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

import {
  ConversationScrollButton,
  ConversationEmptyState,
  ConversationContent,
  Conversation,
} from "@/components/ai-elements/conversation";
import {
  MessageResponse,
  MessageContent,
  Message,
} from "@/components/ai-elements/message";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }

      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  }

  return (
    <div className="flex size-full flex-col gap-y-3">
      <Conversation className="w-full overflow-y-auto">
        <ConversationContent className="mx-auto w-full max-w-4xl">
          {messages.length === 0 ? (
            <ConversationEmptyState
              description="Type a message below to begin chatting"
              icon={<MessageSquare className="size-12" />}
              title="Start a conversation"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <MessageResponse key={`${message.id}-${i}`}>
                            {part.text}
                          </MessageResponse>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage({ text: input });
          setInput("");
        }}
        className="mx-auto mb-3 w-full max-w-2xl overflow-hidden rounded-xl border bg-background shadow-sm"
      >
        <Textarea
          className="field-sizing-content max-h-[6lh] w-full resize-none rounded-none border-none bg-transparent p-3 shadow-none ring-0 outline-none focus-visible:ring-0 dark:bg-transparent"
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Say something..."
          onKeyDown={handleKeyDown}
          value={input}
        />
      </form>
    </div>
  );
}
