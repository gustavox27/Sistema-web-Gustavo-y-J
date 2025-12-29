import { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { supabase, TreeMessage } from '../lib/supabase';

interface GrowingTreeProps {
  onBack: () => void;
}

export default function GrowingTree({ onBack }: GrowingTreeProps) {
  const [messages, setMessages] = useState<TreeMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [canAddMore, setCanAddMore] = useState(true);

  const MAX_MESSAGES = 400;
  const MAX_CHAR_LENGTH = 150;

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    setCanAddMore(messages.length < MAX_MESSAGES);
  }, [messages.length]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tree_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Error cargando los mensajes');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !canAddMore) return;

    try {
      setIsSaving(true);
      setError('');

      const { data, error: insertError } = await supabase
        .from('tree_messages')
        .insert({ message: newMessage.trim() })
        .select()
        .single();

      if (insertError) throw insertError;

      setMessages([...messages, data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error adding message:', err);
      setError('Error guardando el mensaje');
    } finally {
      setIsSaving(false);
    }
  };

  const getGrowthStage = (count: number) => {
    if (count <= 10) return 1;
    if (count <= 50) return 2;
    if (count <= 150) return 3;
    if (count <= 300) return 4;
    return 5;
  };

  const calculatePetalPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const stage = getGrowthStage(messages.length);
  const trunkHeight = Math.min(200, 50 + messages.length * 0.3);
  const branchCount = Math.min(8, 2 + Math.floor(messages.length / 50));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-pink-100 to-rose-100 py-8 px-4 overflow-hidden relative">
      <div className="floating-hearts">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={`heart-${i}`}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
            fill="rgba(255, 182, 193, 0.3)"
            color="rgba(255, 105, 180, 0.5)"
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la Carta
        </button>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-pink-300">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-rose-700 mb-2">
              Nuestras Metas, sueños y Todo el Amor
            </h2>
            <p className="text-lg text-gray-700">
              que nos tenemos haremos crecer juntos esta pequeña Flor
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 flex items-center justify-center bg-gradient-to-br from-green-50 to-pink-50 rounded-2xl p-8 border-2 border-green-200 min-h-96">
              <svg
                viewBox="0 0 400 500"
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <radialGradient id="flowerGradient" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="100%" stopColor="#f87171" />
                  </radialGradient>
                  <radialGradient id="trunkGradient" cx="30%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </radialGradient>
                </defs>

                <rect width="400" height="500" fill="none" />

                <ellipse cx="200" cy="450" rx="80" ry="30" fill="#86efac" opacity="0.6" />

                <line
                  x1="200"
                  y1="450"
                  x2="200"
                  y2={250 - trunkHeight}
                  stroke="url(#trunkGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className={`transition-all duration-500 tree-trunk stage-${stage}`}
                />

                {Array.from({ length: branchCount }).map((_, branchIdx) => {
                  const branchAngle = (branchIdx / branchCount) * Math.PI * 2;
                  const branchLength = 60 + (messages.length % 10) * 3;
                  const branchX = 200 + Math.cos(branchAngle) * branchLength;
                  const branchY = 250 - trunkHeight + Math.sin(branchAngle) * branchLength;

                  return (
                    <g key={`branch-${branchIdx}`} className="animate-sway">
                      <line
                        x1="200"
                        y1={250 - trunkHeight}
                        x2={branchX}
                        y2={branchY}
                        stroke="#22c55e"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}

                <circle
                  cx="200"
                  cy={250 - trunkHeight}
                  r="25"
                  fill="url(#flowerGradient)"
                  className="animate-bloom"
                />

                {messages.map((msg, idx) => {
                  const petalRadius = 45 + (stage - 1) * 10;
                  const pos = calculatePetalPosition(idx, messages.length, petalRadius);
                  const colors = [
                    '#fca5a5',
                    '#f87171',
                    '#dc2626',
                    '#991b1b',
                    '#fcadad',
                    '#f99999',
                  ];
                  const color = colors[idx % colors.length];

                  return (
                    <g key={`petal-${idx}`} className="animate-petalAppear">
                      <circle
                        cx={200 + pos.x}
                        cy={250 - trunkHeight + pos.y}
                        r="16"
                        fill={color}
                        opacity="0.8"
                        className="hover:opacity-100 transition-opacity cursor-pointer"
                      />
                      <text
                        x={200 + pos.x}
                        y={250 - trunkHeight + pos.y + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="white"
                        className="pointer-events-none text-xs"
                      >
                        {idx + 1}
                      </text>

                      <title className="text-sm">{msg.message}</title>
                    </g>
                  );
                })}
              </svg>

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-2xl backdrop-blur-sm">
                  <Heart className="w-12 h-12 text-rose-500 animate-pulse" fill="currentColor" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-300">
                <h3 className="text-2xl font-bold text-rose-700 mb-2">{messages.length}</h3>
                <p className="text-gray-700 font-semibold">de {MAX_MESSAGES} mensajes</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(messages.length / MAX_MESSAGES) * 100}%` }}
                  />
                </div>
              </div>

              <form onSubmit={addMessage} className="flex flex-col gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value.slice(0, MAX_CHAR_LENGTH))}
                  placeholder="Escribe un mensaje, frase o comentario especial..."
                  maxLength={MAX_CHAR_LENGTH}
                  disabled={!canAddMore || isSaving}
                  className="w-full p-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:text-gray-500"
                  rows={4}
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{newMessage.length}/{MAX_CHAR_LENGTH}</span>
                  <span className="text-rose-600 font-semibold">
                    {MAX_MESSAGES - messages.length} disponibles
                  </span>
                </div>

                {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={!canAddMore || isSaving || !newMessage.trim()}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 px-4 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSaving ? 'Guardando...' : canAddMore ? 'Agregar Mensaje' : 'Límite alcanzado'}
                </button>
              </form>

              {canAddMore && (
                <p className="text-center text-sm text-gray-600 italic">
                  Cada mensaje hace crecer el árbol
                </p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 border-2 border-rose-300">
            <h3 className="text-xl font-bold text-rose-700 mb-3">Mensajes del Árbol</h3>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-600 italic text-center py-8">
                  No hay mensajes aún. Sé el primero en hacerlo crecer...
                </p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className="bg-white rounded-lg p-3 border-l-4 border-rose-400 hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm font-semibold text-rose-600 mb-1">Mensaje {idx + 1}</p>
                    <p className="text-gray-800 text-sm">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
