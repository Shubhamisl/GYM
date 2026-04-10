import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import Settings from './components/Settings';
import Stats from './components/Stats';
import Builder from './components/Builder';
import PartyMode from './components/PartyMode';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="text-on-surface antialiased overflow-x-hidden min-h-screen bg-surface font-body">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/*" element={
              <PrivateRoute>
                <Sidebar />
                <BottomNav />
                <main className="lg:ml-[250px] min-h-screen pb-24 lg:pb-12">
                  <Routes>
                    <Route path="/" element={<><TopBar title="Dashboard Overview" /><Dashboard /></>} />
                    <Route path="/tracker" element={<><TopBar title="Active Session" /><WorkoutTracker /></>} />
                    <Route path="/stats" element={<><TopBar title="Stats & Calendar" /><Stats /></>} />
                    <Route path="/builder" element={<><TopBar title="Program Builder" /><Builder /></>} />
                    <Route path="/party" element={<><TopBar title="Iron Fellowship" /><PartyMode /></>} />
                    <Route path="/settings" element={<><TopBar title="Configuration" /><Settings /></>} />
                  </Routes>
                </main>
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
