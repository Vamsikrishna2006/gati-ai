import React, { useState } from 'react';
import { Project, RouteOption, AIChatMessage } from '../types';
import { Bot, Send, Sparkles, User, RefreshCw, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

interface AIAssistantPageProps {
  activeProject: Project;
  selectedRoute: RouteOption;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ activeProject, selectedRoute }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I am your PM Gati Shakti AI Master Planner. I have cross-analyzed spatial GIS layers for "${activeProject.title}".\n\nRoute B is currently prioritized with a 96% AI confidence score because it avoids core eco-sensitive forests and lowers delay risk from 24% to 11%.\n\nHow can I help you refine this corridor?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Why is Route B recommended over Route A?',
    'How do we minimize forest clearing in tiger corridors?',
    'Explain the land acquisition complexity for this route.',
    'Compare freight transit time vs highway cost.',
    'Summarize inter-departmental clearance steps.',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          currentProject: activeProject,
          currentRoute: selectedRoute,
        }),
      });

      const data = await res.json();
      const botMsg: AIChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Analysis completed.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('AI Assistant Error', err);
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Temporary communication issue with GatiAI model. Please retry.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-6 max-w-5xl mx-auto flex flex-col space-y-4 bg-[#080b12]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#0c121d] p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl text-white font-bold shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white flex items-center gap-2">
              GatiAI Master Assistant <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">Gemini 3.6 Flash</span>
            </h1>
            <p className="text-xs text-slate-400">Context: {activeProject.title} ({selectedRoute.name})</p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Prompts:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-[#0c121d] hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors text-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Thread Container */}
      <div className="flex-1 bg-[#0c121d] border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-4 shadow-2xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-none'
                  : 'bg-[#080b12] border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold p-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> GatiAI reasoning across spatial datasets...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl p-2 flex items-center gap-2 shadow-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask GatiAI anything about route trade-offs, environmental risk, or cost optimization..."
          className="flex-1 bg-transparent border-0 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-900/30 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
