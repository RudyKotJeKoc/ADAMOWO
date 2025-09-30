import { useEffect, useMemo, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { MessageList, type ConversationMessage } from './MessageList';
import { UserInput } from './UserInput';
import { AnalysisPanel } from './AnalysisPanel';
import { evaluateMessage, TechniqueId } from './engine/rules';

const createId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

export function SimulatorSection(): JSX.Element {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const createWelcomeMessage = useMemo(
    () => () => ({
      id: createId(),
      role: 'bot' as const,
      content: t('sim.responses.welcome') ?? ''
    }),
    [t]
  );
  const [messages, setMessages] = useState<ConversationMessage[]>(() => [createWelcomeMessage()]);
  const [detectedTechniques, setDetectedTechniques] = useState<TechniqueId[]>([]);

  useEffect(() => {
    setMessages((current) => {
      if (current.length === 0) {
        return [createWelcomeMessage()];
      }
      const [first, ...rest] = current;
      if (first.role !== 'bot') {
        return current;
      }
      return [{ ...first, content: t('sim.responses.welcome') ?? '' }, ...rest];
    });
  }, [i18n.language, createWelcomeMessage, t]);

  const appendMessage = (message: ConversationMessage) => {
    setMessages((current) => [...current, message]);
  };

  const resetConversation = () => {
    setMessages([createWelcomeMessage()]);
    setDetectedTechniques([]);
    setInput('');
  };

  const handleSend = (raw: string) => {
    const content = raw.trim();
    if (!content) return;
    const userMessage: ConversationMessage = {
      id: createId(),
      role: 'user',
      content
    };
    appendMessage(userMessage);

    const result = evaluateMessage(content);
    const botMessage: ConversationMessage = {
      id: createId(),
      role: 'bot',
      content: t(result.rule.responseKey)
    };
    appendMessage(botMessage);

    setDetectedTechniques((current) => {
      const unique = new Set<TechniqueId>([...current, ...result.techniques]);
      return Array.from(unique);
    });
    setInput('');
  };

  return (
    <section
      role="region"
      aria-labelledby="simulator-title"
      className="space-y-8"
    >
      <header className="space-y-3">
        <h2 id="simulator-title" className="text-2xl font-bold text-base-50">
          {t('sim.title')}
        </h2>
        <p className="text-sm text-base-200">{t('sim.subtitle')}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <MessageList
            messages={messages}
            userLabel={t('sim.userLabel')}
            botLabel={t('sim.botLabel')}
          />
          <UserInput value={input} onChange={setInput} onSubmit={handleSend} onReset={resetConversation} />
        </div>
        <AnalysisPanel techniques={detectedTechniques} />
      </div>
      <p className="rounded-lg border border-base-800 bg-base-900/40 p-4 text-xs text-base-300">
        {t('sim.disclaimer')}
      </p>
    </section>
  );
}
