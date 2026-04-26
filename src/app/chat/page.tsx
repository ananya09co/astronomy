'use client'
import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Sparkles, RotateCcw, Loader2, Trash2 } from 'lucide-react'
import api from '@/lib/api'
import { useUserSession } from '@/hooks/useUserSession'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_PROMPTS = [
  'What is a black hole?',
  'How far is the nearest star?',
  'What is dark matter?',
  'Tell me about the Big Bang',
  'How do neutron stars form?',
  'Can we travel to another galaxy?',
  'What is the Milky Way?',
  'How are exoplanets detected?',
]

function parseMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/•/g, '◆')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
}

let msgId = 0

export default function ChatPage() {
  const userId = useUserSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadHistory() {
      if (!userId) return
      try {
        const res = await api.getChatHistory(userId)
        if (res.success && res.data.length > 0) {
          const mapped = res.data.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.created_at)
          }))
          setMessages(mapped)
        } else {
          setMessages([
            {
              id: Date.now(),
              role: 'assistant',
              content: "🌌 **Greetings, cosmic explorer!**\n\nI'm your AI astronomy guide. Ask me anything about the universe — from black holes and nebulae to exoplanets and the Big Bang.\n\nTry one of the suggested topics below, or ask anything on your mind!",
              timestamp: new Date(),
            }
          ])
        }
      } catch (err) {
        console.error('Failed to load chat history:', err)
      } finally {
        setInitializing(false)
      }
    }
    loadHistory()
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { id: msgId++, role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Simulate streaming delay
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800))
      const res = await api.chat(text, userId || undefined)
      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data?.message || "I'd be delighted to help! Try asking me about black holes, galaxies, or specific planets.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: msgId++,
        role: 'assistant',
        content: '⚠️ Connection to the cosmic brain interrupted. Please ensure the backend server is running on port 5000.',
        timestamp: new Date(),
      }])
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  async function handleReset() {
    if (userId && window.confirm('Permanently clear cosmic chat history?')) {
      try {
        await fetch(`/api/chat/history`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
      } catch (err) {
        console.error('Failed to clear history:', err)
      }
    }
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: "🌌 Fresh start! What cosmic wonder can I help you explore today?",
      timestamp: new Date(),
    }])
  }

  return (
    <div className="page-section" style={{ paddingTop: '100px' }}>
      <div className="container-cosmic">
        <div className="section-header">
          <div className="section-tag">
            <Bot size={12} style={{ display: 'inline', marginRight: 6 }} />
            Powered by Astronomy AI
          </div>
          <h1 className="section-title">AI <span className="gradient-text">Astronomy</span> Assistant</h1>
          <p className="section-subtitle">Ask anything about the cosmos. Powered by an extensive astronomy knowledge base.</p>
        </div>

        {/* Chat Container */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Suggested Prompts */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={12} /> Suggested Topics
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SUGGESTED_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 100,
                    color: '#a5b4fc',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                  onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(99,102,241,0.2)'); (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)') }}
                  onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(99,102,241,0.1)'); (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)') }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="glass" style={{ padding: '1rem', marginBottom: '1rem', maxHeight: 520, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                }}>
                  {msg.role === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
                </div>

                {/* Bubble */}
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(255,255,255,0.05)',
                  border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--text-primary)',
                }}>
                  <div dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
                  <div style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.5rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={16} color="white" />
                </div>
                <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-cyan)',
                      animation: `pulse-glow 1s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={handleReset} title="Reset conversation" style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px',
              color: 'var(--text-muted)', padding: '12px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center',
              transition: 'all 0.2s',
            }}>
              <RotateCcw size={18} />
            </button>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                className="cosmic-input"
                placeholder="Ask about stars, galaxies, black holes..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                disabled={loading}
                style={{ paddingRight: '3.5rem' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  position: 'absolute', right: '0.5rem',
                  background: input.trim() && !loading ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                  border: 'none', borderRadius: '8px', padding: '8px', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  color: 'white',
                }}
              >
                {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
            Responses powered by built-in astronomy knowledge base · No external AI API required
          </p>
        </div>
      </div>
    </div>
  )
}
