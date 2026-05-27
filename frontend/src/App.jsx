import PaymentCallback from './pages/PaymentCallback';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Airtime from './pages/Airtime';
import Data from './pages/Data';
import Transactions from './pages/Transactions';
import FundWallet from './pages/FundWallet';
import Cable from './pages/Cable';
import Electricity from './pages/Electricity';
import Landing from './pages/Landing';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />

            <Route path="/electricity" element={
    <ProtectedRoute><Electricity /></ProtectedRoute>
} />
            <Route path="/cable" element={
    <ProtectedRoute><Cable /></ProtectedRoute>
} />
            <Route path="/airtime" element={
                <ProtectedRoute><Airtime /></ProtectedRoute>
            } />
            <Route path="/data" element={
                <ProtectedRoute><Data /></ProtectedRoute>
            } />
            <Route path="/transactions" element={
                <ProtectedRoute><Transactions /></ProtectedRoute>
            } />
            <Route path="/fund" element={
                <ProtectedRoute><FundWallet /></ProtectedRoute>
            } />
            <Route path="/payment/callback" element={<PaymentCallback />} />
        </Routes>
    );
}