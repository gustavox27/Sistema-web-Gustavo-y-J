import { useState, useEffect } from 'react';
import { Heart, Flower2 } from 'lucide-react';
import { supabase, LoveDocument as LoveDocumentType } from '../lib/supabase';
import RomanticLetter from './RomanticLetter';

export default function LoveDocument() {
  const [showCelebration, setShowCelebration] = useState(true);
  const [daysSince, setDaysSince] = useState(0);
  const [timeSinceSigned, setTimeSinceSigned] = useState('');
  const [document, setDocument] = useState<LoveDocumentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'document' | 'letter'>('document');

  const startDate = new Date('2025-09-27');

  useEffect(() => {
    loadDocument();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setDaysSince(days);

      if (document?.both_signed_at) {
        const signedDate = new Date(document.both_signed_at);
        const timeDiff = now.getTime() - signedDate.getTime();
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
          setTimeSinceSigned(`${days} días, ${hours % 24} horas, ${minutes % 60} minutos, ${seconds % 60} segundos`);
        } else if (hours > 0) {
          setTimeSinceSigned(`${hours} horas, ${minutes % 60} minutos, ${seconds % 60} segundos`);
        } else if (minutes > 0) {
          setTimeSinceSigned(`${minutes} minutos, ${seconds % 60} segundos`);
        } else {
          setTimeSinceSigned(`${seconds} segundos`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [document]);

  const loadDocument = async () => {
    try {
      const { data, error } = await supabase
        .from('love_document')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        const { data: newDoc, error: insertError } = await supabase
          .from('love_document')
          .insert({})
          .select()
          .single();

        if (insertError) throw insertError;
        setDocument(newDoc);
      } else {
        setDocument(data);
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (signer: 'gustavo' | 'jennifer') => {
    if (!document) return;

    try {
      const now = new Date().toISOString();
      const updates: Partial<LoveDocumentType> = {};

      if (signer === 'gustavo') {
        updates.gustavo_signed = true;
        updates.gustavo_signed_at = now;
      } else {
        updates.jennifer_signed = true;
        updates.jennifer_signed_at = now;
      }

      const willBothBeSigned =
        (signer === 'gustavo' && document.jennifer_signed) ||
        (signer === 'jennifer' && document.gustavo_signed);

      if (willBothBeSigned) {
        updates.both_signed_at = now;
      }

      const { data, error } = await supabase
        .from('love_document')
        .update(updates)
        .eq('id', document.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      setDocument(data);
    } catch (error) {
      console.error('Error signing document:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 flex items-center justify-center">
        <Heart className="w-16 h-16 text-red-500 animate-pulse" fill="currentColor" />
      </div>
    );
  }

  if (currentPage === 'letter') {
    return <RomanticLetter onBack={() => setCurrentPage('document')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 py-8 px-4 overflow-hidden relative">
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
            fill="rgba(255, 182, 193, 0.6)"
            color="rgba(255, 105, 180, 0.8)"
          />
        ))}
      </div>

      <div className="floating-flowers">
        {[...Array(15)].map((_, i) => (
          <Flower2
            key={`flower-${i}`}
            className="floating-flower"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
            }}
            color="rgba(236, 72, 153, 0.7)"
          />
        ))}
      </div>

      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="celebration-container">
            {[...Array(50)].map((_, i) => (
              <Heart
                key={`celeb-heart-${i}`}
                className="celebration-heart"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
                fill="rgba(239, 68, 68, 0.8)"
                color="rgba(220, 38, 38, 1)"
              />
            ))}
            {[...Array(30)].map((_, i) => (
              <Flower2
                key={`celeb-flower-${i}`}
                className="celebration-flower"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
                color="rgba(236, 72, 153, 1)"
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-pink-300">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Heart className="w-12 h-12 text-red-500 animate-pulse" fill="currentColor" />
              <h1 className="text-5xl font-bold text-pink-600">GUSTAVO Y JENNIFER</h1>
              <Heart className="w-12 h-12 text-red-500 animate-pulse" fill="currentColor" />
            </div>

            <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-6 mb-6 border-2 border-pink-300">
              <p className="text-4xl font-bold text-pink-600 mb-2">{daysSince}</p>
              <p className="text-lg text-gray-700">días desde que iniciamos nuestro amor</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-pink-300 pb-2">
              ACTA DE NOVIAZGO
            </h2>
          </div>

          <div className="space-y-4 text-gray-700 text-justify leading-relaxed mb-8">
            <p>
              Nosotros, plenamente conscientes de nuestras facultades físicas y mentales, declaramos de manera libre y voluntaria el cariño, respeto y compromiso que sentimos mutuamente.
            </p>
            <p>
              En este documento dejamos constancia de que nuestro amor crece cada día, y reconocemos que ambos somos dueños del corazón del otro. Nos entregamos nuestro afecto de manera sincera, pidiendo al otro que lo cuide con la misma dedicación y ternura con la que nosotros lo hacemos.
            </p>
            <p>
              Ambos expresamos nuestro deseo de construir una relación basada en la confianza, comprensión y felicidad compartida. Queremos caminar juntos, apoyándonos en cada etapa que la vida nos presente.
            </p>
            <p>
              Nos comprometemos a sernos <strong>FIELES y RESPETARNOS</strong>, estando juntos en los momentos buenos y en los difíciles, en la salud y en la enfermedad, sin alejarnos ni renunciar el uno al otro. Seremos apoyo, complemento, amigos fieles, enamorados y pareja, según lo necesitemos y lo demande nuestra relación.
            </p>
            <p>
              Aceptamos todo lo expresado en este documento y nos comprometemos a corresponder de manera recíproca, manteniendo nuestro amor con honestidad, dedicación y esfuerzo mutuo.
            </p>
            <p className="font-semibold">
              En señal de conformidad y compromiso, firmamos el presente documento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-300">
              {!document?.gustavo_signed ? (
                <button
                  onClick={() => handleSign('gustavo')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Firmar Él
                </button>
              ) : (
                <div className="text-center">
                  <div className="signature-text mb-2">
                    <p className="text-2xl font-bold text-blue-800">Gustavo Ernesto Corrales</p>
                  </div>
                  <p className="text-sm text-gray-600 italic">Firmado y aceptado</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border-2 border-pink-300">
              {!document?.jennifer_signed ? (
                <button
                  onClick={() => handleSign('jennifer')}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Firmar Ella
                </button>
              ) : (
                <div className="text-center">
                  <div className="signature-text mb-2">
                    <p className="text-2xl font-bold text-pink-800">Jennifer Corrales Granda</p>
                  </div>
                  <p className="text-sm text-gray-600 italic">Firmado y aceptado</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-gray-600 mb-6">
            <p className="font-semibold">Ciudad de Lima, 29 de Diciembre del 2025.</p>
          </div>

          {document?.both_signed_at && (
            <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 border-2 border-rose-300 animate-fadeIn">
              <div className="text-center">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" fill="currentColor" />
                <h3 className="text-2xl font-bold text-rose-700 mb-2">
                  Tiempo trasncurrido desde nuetro compromiso
                </h3>
                <p className="text-3xl font-bold text-rose-600 mb-6">{timeSinceSigned}</p>
                <button
                  onClick={() => setCurrentPage('letter')}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Siguiente..
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
