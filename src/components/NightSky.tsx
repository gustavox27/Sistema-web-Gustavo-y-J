import { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { supabase, TreeMessage } from '../lib/supabase';

interface NightSkyProps {
  onBack: () => void;
}

interface Star {
  id: string;
  message: string;
  x: number;
  y: number;
  size: number;
  created_at: string;
}

const MIN_STAR_DISTANCE = 120;
const CONTAINER_WIDTH = 1200;
const CONTAINER_HEIGHT = 700;

export default function NightSky({ onBack }: NightSkyProps) {
  const [messages, setMessages] = useState<TreeMessage[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [canAddMore, setCanAddMore] = useState(true);
  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const MAX_MESSAGES = 400;
  const MAX_CHAR_LENGTH = 150;

  const generateRandomPosition = (existingStars: Star[]): { x: number; y: number } => {
    let validPosition = false;
    let x = 0;
    let y = 0;
    let attempts = 0;
    const maxAttempts = 50;

    while (!validPosition && attempts < maxAttempts) {
      x = Math.random() * (CONTAINER_WIDTH - 120) + 60;
      y = Math.random() * (CONTAINER_HEIGHT - 120) + 60;

      validPosition = existingStars.every(star => {
        const distance = Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2);
        return distance >= MIN_STAR_DISTANCE;
      });

      attempts++;
    }

    return { x, y };
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    setCanAddMore(messages.length < MAX_MESSAGES);
  }, [messages.length]);

  useEffect(() => {
    const newStars: Star[] = [];
    messages.forEach((msg) => {
      const { x, y } = generateRandomPosition(newStars);
      const size = 16 + (msg.message.length % 3) * 2;

      newStars.push({
        id: msg.id,
        message: msg.message,
        x,
        y,
        size,
        created_at: msg.created_at,
      });
    });
    setStars(newStars);
  }, [messages]);

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

  const handleStarHover = (star: Star, event: React.MouseEvent<SVGCircleElement>) => {
    setHoveredStarId(star.id);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 py-8 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la Carta
        </button>

        <div className="bg-gradient-to-b from-slate-950/80 via-blue-950/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-blue-400/30">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent mb-2">
              Nuestro Cielo Nocturno
            </h2>
            <p className="text-lg text-blue-200">
              Cada mensaje es una estrella en el firmamento
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 relative bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-4 border-2 border-blue-400/30 min-h-[700px] overflow-hidden">
              <svg
                viewBox={`0 0 ${CONTAINER_WIDTH} ${CONTAINER_HEIGHT}`}
                className="w-full h-full absolute inset-0"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <g className="night-sky-content">
                  <path
                    d="M600 350 C550 300, 450 300, 450 350 C450 420, 550 500, 600 580 C650 500, 750 420, 750 350 C750 300, 650 300, 600 350 Z"
                    fill="rgb(79, 95, 114)"
                    opacity="0.15"
                  />

                  {stars.map((star, idx) => {
                    const maxChars = 20;
                    const displayText = star.message.length > maxChars
                      ? star.message.substring(0, maxChars) + '...'
                      : star.message;
                    const fontSize = Math.max(8, Math.min(12, 150 / star.message.length));

                    return (
                      <g
                        key={star.id}
                        className="star-group animate-starAppear"
                        style={{
                          animationDelay: `${idx * 0.05}s`,
                        }}
                      >
                        <circle
                          cx={star.x}
                          cy={star.y}
                          r={star.size}
                          fill="#fef3c7"
                          stroke="#3b82f6"
                          strokeWidth="0.8"
                          opacity="0.95"
                          className="hover:opacity-100 transition-all duration-200 cursor-pointer star-point"
                          filter="url(#glow)"
                          onMouseEnter={(e) => handleStarHover(star, e)}
                          onMouseLeave={() => setHoveredStarId(null)}
                          style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                          }}
                        />
                        <text
                          x={star.x}
                          y={star.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#1e3a8a"
                          fontSize={fontSize}
                          fontWeight="600"
                          pointerEvents="none"
                          className="select-none"
                          style={{
                            wordWrap: 'break-word',
                          }}
                        >
                          {displayText}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-2xl backdrop-blur-sm z-20">
                  <Heart className="w-12 h-12 text-blue-400 animate-pulse" fill="currentColor" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-gradient-to-br from-blue-950 to-slate-950 rounded-2xl p-6 border-2 border-blue-400/30">
                <h3 className="text-2xl font-bold text-blue-300 mb-2">{messages.length}</h3>
                <p className="text-blue-200 font-semibold">de {MAX_MESSAGES} estrellas</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(messages.length / MAX_MESSAGES) * 100}%` }}
                  />
                </div>
              </div>

              <form onSubmit={addMessage} className="flex flex-col gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value.slice(0, MAX_CHAR_LENGTH))}
                  placeholder="Escribe un mensaje especial..."
                  maxLength={MAX_CHAR_LENGTH}
                  disabled={!canAddMore || isSaving}
                  className="w-full p-3 border-2 border-blue-400/30 bg-slate-900 text-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none disabled:bg-slate-950 disabled:text-slate-600 placeholder-slate-500"
                  rows={4}
                />
                <div className="flex justify-between text-sm text-blue-300">
                  <span>{newMessage.length}/{MAX_CHAR_LENGTH}</span>
                  <span className="text-blue-400 font-semibold">
                    {MAX_MESSAGES - messages.length} disponibles
                  </span>
                </div>

                {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={!canAddMore || isSaving || !newMessage.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSaving ? 'Guardando...' : canAddMore ? 'Agregar Mensaje' : 'Límite alcanzado'}
                </button>
              </form>

              {canAddMore && (
                <p className="text-center text-sm text-blue-300 italic">
                  Cada mensaje brilla como una estrella
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {hoveredStarId && (
        <div
          className="fixed bg-slate-800 text-blue-100 px-4 py-3 rounded-lg shadow-lg border border-blue-400/50 max-w-xs z-50 pointer-events-none animate-fadeIn"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="text-sm font-semibold">
            {stars.find((s) => s.id === hoveredStarId)?.message}
          </p>
        </div>
      )}
    </div>
  );
}
