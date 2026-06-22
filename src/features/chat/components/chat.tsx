import type { KeyboardEvent } from "react";

import {
  MessageSquare,
  Loader2Icon,
  SquareIcon,
  SendIcon,
  XIcon,
  File,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

import type { SelectedMessage } from "@/db/types/inferred";

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
import { Button } from "@/components/ui/button";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: SelectedMessage[];
}) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    id,
    messages: initialMessages,
  });

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

  let Icon = <SendIcon className="size-4" />;

  if (status === "submitted") {
    Icon = <Loader2Icon className="size-4 animate-spin" />;
  } else if (status === "streaming") {
    Icon = <SquareIcon className="size-4" />;
  } else if (status === "error") {
    Icon = <XIcon className="size-4" />;
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
        className="mx-auto mb-3 w-full max-w-2xl divide-y-2 overflow-hidden rounded-xl border bg-background shadow-sm"
      >
        <Textarea
          className="field-sizing-content max-h-[6lh] w-full resize-none rounded-none border-none bg-transparent p-3 shadow-none ring-0 outline-none focus-visible:ring-0 dark:bg-transparent"
          disabled={status === "submitted" || status === "streaming"}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Say something..."
          onKeyDown={handleKeyDown}
          value={input}
        />
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center gap-1 [&_button:first-child]:rounded-bl-xl">
            <Button variant="outline" size="icon" disabled>
              <File />
            </Button>
          </div>
          <Button
            disabled={
              !input || status === "submitted" || status === "streaming"
            }
            className="gap-1.5 rounded-lg"
            type="submit"
            size="icon"
          >
            {Icon}
          </Button>
        </div>
      </form>
    </div>
  );
}
