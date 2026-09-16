import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Trainers from './pages/Trainers';
import Programs from './pages/Programs';
import Gallery from './pages/Gallery';
import Membership from './pages/Membership';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import QRCodePage from './pages/QRCodePage';

// A simple protected route wrapper
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// A placeholder for the dashboard until Phase 6
const DashboardPlaceholder = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl text-amber-500 font-bold mb-4">Legacy Fitness Lounge Dashboard</h1>
            <p>Welcome back, {user?.first_name || user?.username}!</p>
            <div className="mt-8">
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded hover:bg-zinc-700 text-amber-500"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/trainers" element={<Trainers />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/membership" element={<Membership />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/qr" element={<QRCodePage />} />
                    <Route path="/scanner" element={<QRCodePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPlaceholder />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
