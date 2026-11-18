import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [demoUser, setDemoUser] = useState(null);

  if (!demoUser) {
    return <Login onDemoLogin={(user) => setDemoUser(user)} />;
  }

  return <Dashboard />;
}

export default App;
