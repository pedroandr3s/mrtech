import React, { useState } from 'react';
import Header from './components/Header';
import Propuesta1 from './components/Propuesta1';
import Propuesta2 from './components/Propuesta2';
import Propuesta3 from './components/Propuesta3';
import './App.css';

function App() {
  const [propuestaActiva, setPropuestaActiva] = useState(1);

  return (
    <div className="App">
      <Header 
        propuestaActiva={propuestaActiva} 
        setPropuestaActiva={setPropuestaActiva} 
      />
      {propuestaActiva === 1 && <Propuesta1 />}
      {propuestaActiva === 2 && <Propuesta2 />}
      {propuestaActiva === 3 && <Propuesta3 />}
    </div>
  );
}

export default App;
