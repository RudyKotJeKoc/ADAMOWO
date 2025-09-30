import { useEffect, useRef, type JSX } from 'react';
import clsx from 'clsx';

export type ConversationMessage = {
  id: string;
  role: 'user' | 'bot';
  content: string;
};

type MessageListProps = {
  messages: ConversationMessage[];
  userLabel: string;
  botLabel: string;
};

export function MessageList({ messages, userLabel, botLabel }: MessageListProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={containerRef}
      role="log"
      aria-live="polite"
      className="h-80 overflow-y-auto rounded-xl border border-base-800 bg-base-900/70 p-4"
    >
      <ul className="space-y-4">
        {messages.map((message) => (
          <li key={message.id} className="flex">
            <div
              className={clsx(
                'max-w-[80%] rounded-lg px-4 py-3 text-sm shadow',
                message.role === 'user'
                  ? 'ml-auto bg-accent-500 text-base-950'
                  : 'mr-auto bg-base-800 text-base-100'
              )}
              aria-label={message.role === 'user' ? userLabel : botLabel}
            >
              <p className="whitespace-pre-line">{message.content}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
