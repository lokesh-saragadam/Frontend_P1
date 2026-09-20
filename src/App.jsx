import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Register from './pages/register/Register.jsx';
import OnboardingPage from './pages/onboarding/OnboardingPage.jsx';

function ProtectedPage({ children }) {
    return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}
function ErrorFallback() {
    return <div className="app-message" role="alert">
        <h2>We could not display this page</h2>
        <p>Please reload and try again.</p>
        <button onClick={() => window.location.reload()}>Reload page</button>
    </div>;
}
export default function App() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/onboarding/:id" element={<ProtectedPage><div className="home-page"><OnboardingPage /></div></ProtectedPage>} />
                <Route path="/dashboard/:id" element={<ProtectedPage><div className="home-page"><Dashboard /></div></ProtectedPage>} />
                <Route path="/about" element={<div className="app-message"><h1>About CodeTrack</h1><p>Track your DSA practice across platforms as you prepare for placements.</p><Link to="/">Back home</Link></div>} />
                <Route path="*" element={<div className="app-message"><h1>Page not found</h1><Link to="/">Back home</Link></div>} />
            </Routes>
        </ErrorBoundary>
    );
}
