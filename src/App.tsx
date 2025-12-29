import { useState } from 'react';
import Login from './components/Login';
import LoveDocument from './components/LoveDocument';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <LoveDocument />
      )}
    </>
  );
}

export default App;
