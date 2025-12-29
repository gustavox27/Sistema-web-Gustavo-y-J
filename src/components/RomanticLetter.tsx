import { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import NightSky from './NightSky';

interface RomanticLetterProps {
  onBack: () => void;
}

const letterContent = `Para la mujer que adoro con todo mi corazón:
Si pudiera elegir un lugar seguro, sería tu abrazo.
Cada día que te miro, te quiero un poco más: como un gatito que vuelve a la ventana y reconoce su casa.
Eres mi paz, y a veces mi tormenta;
Eres mi alegría, mi calma, mi felicidad. Me haces reír y, a veces, enojar;
pero en ese transcurso encuentro el equilibrio perfecto que necesito, la brújula que me devuelve a tu orilla.
Te quiero demasiado porque me inspiras a soñar, a seguir adelante, a creer que lo imposible solo está esperando que llegues. A tu lado, los sueños compartidos tienen más fuerza, tener metas a tu lado me hacen volver a soñar,
Contigo no tengo que fingir: me aceptas tal y como soy,
y me recuerdas que ser yo siempre es suficiente.
Cada instante contigo vale mil y un suspiros.
A tu lado encontré más de lo que pude pedir:
la puerta que se abre sin llave, el descanso de mis sombras,
la certeza de que amar es cuidar lo frágil hasta que se vuelve cielo.
Me tienes de rodillas a tus pies y guardado en el latido de tu corazon.
Si alguna vez la noche nos prueba, seré faro;
Si el día nos cansa, seré tu descanso;
Si tus días pierden color, seré pincel;
Si la aventura se vuelve montaña, yo llevo la mochila;
Si te cansas yo seré tus rodillas;
si la rutina se vuelve nube gris, yo traigo los globos;
si te caes, prometo ayudarte… después de terminar de reír un poquito.
Si las olas suben, seré tu barquito
si el mundo te mira raro, yo te mirare como si fueras mi regalo favorito.
si el mundo te dice que no puedes, yo canto desafinado hasta que te rías y vuelvas a creer en ti;
Si la gente critica tus 'alas', yo te enseño a volar
Si te pierdes, yo te sigo
si olvidas el camino, yo te lo recuerdo… o lo invento
y si la corriente cambia, nadamos juntos hasta donde haga falta.

Te adoro
Yo, Gustavo.`;

const pausePoints = [
  { position: 562, message: 'Pausa Activa?' },
  { position: 1185, message: 'Mas?' },
  { position: 1580, message: 'Continuar?' },
];

export default function RomanticLetter({ onBack }: RomanticLetterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseMessage, setPauseMessage] = useState('');
  const [showSky, setShowSky] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < letterContent.length && !isPaused) {
      const timer = setTimeout(() => {
        setDisplayedText(letterContent.substring(0, currentIndex + 1));

        const nextPausePoint = pausePoints.find(p => p.position === currentIndex + 1);
        if (nextPausePoint) {
          setIsPaused(true);
          setPauseMessage(nextPausePoint.message);
          setShowPauseModal(true);
        }

        setCurrentIndex(currentIndex + 1);
      }, 10);

      return () => clearTimeout(timer);
    }

    if (currentIndex === letterContent.length && displayedText === letterContent && !typingComplete) {
      setTypingComplete(true);
    }
  }, [currentIndex, isPaused, displayedText, typingComplete]);

  const handlePauseContinue = () => {
    setShowPauseModal(false);
    setIsPaused(false);
  };

  if (showSky) {
    return <NightSky onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 py-8 px-4 overflow-hidden relative">
      <div className="floating-hearts">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={`heart-${i}`}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
            fill="rgba(255, 182, 193, 0.4)"
            color="rgba(255, 105, 180, 0.6)"
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="bg-yellow-50/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border-4 border-rose-200 relative">
          <div className="absolute top-4 right-6 text-4xl opacity-30">❀</div>
          <div className="absolute bottom-4 left-6 text-4xl opacity-30">❀</div>

          <div className="text-center mb-8">
            <Heart className="w-10 h-10 text-rose-500 mx-auto mb-4 animate-pulse" fill="currentColor" />
            <h2 className="text-3xl font-bold text-rose-700 mb-2">Una Carta Para Ti</h2>
            <p className="text-rose-600">Jennifer</p>
          </div>

          <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap font-serif mb-8 min-h-96">
            {displayedText}
            {currentIndex < letterContent.length && (
              <span className="animate-pulse text-rose-500">|</span>
            )}
          </div>

          {typingComplete && !showSky && (
            <div className="text-center animate-fadeIn">
              <button
                onClick={() => setShowSky(true)}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      {showPauseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-4 border-rose-300 animate-fadeIn">
            <Heart className="w-16 h-16 text-rose-500 mx-auto mb-6 animate-pulse" fill="currentColor" />
            <h3 className="text-3xl font-bold text-rose-600 mb-6">{pauseMessage}</h3>
            <button
              onClick={handlePauseContinue}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
