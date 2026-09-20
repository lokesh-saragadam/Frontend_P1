import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../../components/headers/AuthHeader.jsx';
import FeedbackDialog from '../../components/FeedbackDialog.jsx';
import { apiRequest } from '../../utils/api.js';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);
    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        const form = event.currentTarget;
        try {
            const sessionResponse = await apiRequest('/login', {
                method: 'POST', body: { email: form.email.value.trim(), password: form.password.value }
            });
            if (typeof sessionResponse.token !== 'string' || !Number.isSafeInteger(sessionResponse.userId)) {
                throw new Error('Unable to sign in. Please try again.');
            }
            localStorage.setItem('token', sessionResponse.token);
            navigate(`/dashboard/${sessionResponse.userId}`);
        } catch (failure) {
            setErrorMessage(failure.message);
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    }
    return (
        <div className="login-page">
            <AuthHeader />
            <div className="login-welcome"><h1>Welcome back</h1><p>Continue your practice journey.</p></div>
            <div className="login-container">
                <h2>Sign in</h2>
                <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
                    <label htmlFor="login-email">Email</label>
                    <input id="login-email" name="email" type="email" autoComplete="email" maxLength={225} required />
                    <label htmlFor="login-password">Password</label>
                    <input id="login-password" name="password" type="password" autoComplete="current-password" required />
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
                </form>
                <p>Need an account? <Link to="/register">Register</Link></p>
            </div>
            <FeedbackDialog message={errorMessage} onClose={() => setErrorMessage('')} />
        </div>
    );
}
