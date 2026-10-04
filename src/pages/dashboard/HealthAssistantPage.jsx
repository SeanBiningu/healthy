import React, { useState, useEffect, useRef } from 'react';
import { healthAssistantApi } from '../../services/api';
import { EmergencyNotice, MedicalDisclaimer, Button } from '../../components/UI';
import { FiSend, FiHeart, FiAlertTriangle } from 'react-icons/fi';

const SUGGESTED = [
  'I have a headache, what might help?',
  'What is amoxicillin used for?',
  'What should I do for a minor burn?',
  'I have a fever. What can I do?',
  'How do I treat diarrhoea?',
  'What is paracetamol used for?',
];

const WELCOME = {
  role: 'assistant',
  content: `Hello! I'm the **Pathway Health Assistant**. 👋

I can help you with:
- General health information
- First-aid guidance
- Medicine information
- Guidance on when to seek professional care

Please note: I provide **general information only**. I am not a doctor, and I cannot diagnose conditions or prescribe medication. For medical decisions, always consult a qualified healthcare professional or pharmacist.

How can I help you today?`,
};

export default function HealthAssistantPage() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const data = await healthAssistantApi.chat(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response,
          disclaimer: data.disclaimer,
          type: data.type,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I'm having trouble responding right now. Please try again, or consult a healthcare professional directly.",
          type: 'error',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8 flex flex-col" style={{ minHeight: 'calc(100dvh - 4rem)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
          <FiHeart size={20} className="text-rose-600" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Pathway Health Assistant</h1>
          <p className="text-xs text-gray-500">General health information • Not a substitute for professional care</p>
        </div>
      </div>

      <EmergencyNotice />

      {/* Chat area */}
      <div className="mt-4 flex-1 min-h-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ minHeight: '380px' }}>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-green-900">Px</div>
              <div className="chat-bubble-assistant px-4 py-3 text-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-gray-400 mb-2">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:bg-green-50 hover:text-green-800 hover:border-green-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 p-4 flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms or health question..."
            rows={2}
            maxLength={500}
            disabled={loading}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="self-end"
          >
            <FiSend size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <MedicalDisclaimer compact />
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isEmergency = message.type === 'emergency';

  if (isUser) {
    return (
      <div className="flex justify-end gap-3">
        <div className="chat-bubble-user px-4 py-3 text-sm max-w-sm">
          {message.content}
        </div>
        <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white self-end">You</div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold self-start mt-0.5 ${isEmergency ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-900'}`}>
        Px
      </div>
      <div className="flex-1 min-w-0">
        <div className={`chat-bubble-assistant px-4 py-3 text-sm max-w-lg ${isEmergency ? 'border-red-300 bg-red-50' : ''}`}>
          <MarkdownText text={message.content} />
        </div>
        {message.disclaimer && (
          <p className="text-xs text-gray-400 mt-1 px-1 max-w-lg">{message.disclaimer}</p>
        )}
      </div>
    </div>
  );
}

// Minimal markdown renderer for bold and line breaks
function MarkdownText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </span>
  );
}
