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
import MemberDashboard from './pages/MemberDashboard';
import AdminPortal from './pages/AdminPortal';

// A simple protected route wrapper
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
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

                    {/* Member Dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <MemberDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Direct link demo access for review */}
                    <Route path="/member-dashboard" element={<MemberDashboard />} />

                    {/* Gym Admin / Trainer Portal */}
                    <Route path="/admin-portal" element={<AdminPortal />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
