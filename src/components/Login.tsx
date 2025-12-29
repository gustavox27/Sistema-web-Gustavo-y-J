import { useState } from 'react';
import { Heart, HeartCrack } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [date, setDate] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (date === '2025-09-27') {
      onLogin();
    } else {
      setShowError(true);
    }
  };

  const closeModal = () => {
    setShowError(false);
    setDate('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="floating-hearts">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
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

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full relative z-10 border-4 border-pink-300">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-20 h-20 text-red-500 animate-pulse" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold text-pink-600 mb-2">Nuestra Historia</h1>
          <p className="text-gray-600 text-lg">de Amor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-center text-lg">
              ¿Cuándo iniciamos nuestro noviazgo?
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
          >
            Si entras no hay vuelta atras.
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Gustavo & Jennifer</p>
        </div>
      </div>

      {showError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative animate-shake border-4 border-gray-400">
            <div className="broken-hearts-container">
              {[...Array(8)].map((_, i) => (
                <HeartCrack
                  key={i}
                  className="broken-heart"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                  color="#ef4444"
                  size={30 + Math.random() * 20}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="text-8xl mb-4">😢</div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">¡Sospechoso! 🤨</h2>
              <p className="text-gray-700 text-lg mb-6">
                Esa no es la fecha correcta Jennifer Corrales Granda 🤨...
                <br />
                ¿Cómo pudiste olvidar nuestra fecha especial? 💔
              </p>

              <button
                onClick={closeModal}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                Volver a Intentar :c
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
