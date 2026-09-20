import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../../components/headers/AuthHeader.jsx';
import FeedbackDialog from '../../components/FeedbackDialog.jsx';
import { apiRequest } from '../../utils/api.js';
import '../login/Auth.css';

export default function Register() {
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
            const sessionResponse = await apiRequest('/register', {
                method: 'POST',
                body: { username: form.username.value.trim(), email: form.email.value.trim(), password: form.password.value }
            });
            if (typeof sessionResponse.token !== 'string' || !Number.isSafeInteger(sessionResponse.userId)) {
                throw new Error('Unable to register. Please try again.');
            }
            localStorage.setItem('token', sessionResponse.token);
            navigate(`/onboarding/${sessionResponse.userId}`);
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
            <div className="login-welcome"><h1>Start your practice journey</h1><p>Create your CodeTrack account.</p></div>
            <div className="login-container">
                <h2>Register</h2>
                <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
                    <label htmlFor="register-username">Username</label>
                    <input id="register-username" name="username" autoComplete="username" maxLength={100} required />
                    <label htmlFor="register-email">Email</label>
                    <input id="register-email" name="email" type="email" autoComplete="email" maxLength={225} required />
                    <label htmlFor="register-password">Password</label>
                    <input id="register-password" name="password" type="password" autoComplete="new-password" required aria-describedby="password-hint" />
                    <small id="password-hint">At least 8 characters; no more than 72 bytes.</small>
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button>
                </form>
                <p>Already registered? <Link to="/login">Sign in</Link></p>
            </div>
            <FeedbackDialog message={errorMessage} onClose={() => setErrorMessage('')} />
        </div>
    );
}
