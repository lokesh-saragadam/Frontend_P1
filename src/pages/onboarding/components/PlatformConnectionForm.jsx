import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackDialog from '../../../components/FeedbackDialog.jsx';
import { apiRequest } from '../../../utils/api.js';
import '../../login/Auth.css';

export default function PlatformConnectionForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);
    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmittingRef.current) return;
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const form = event.currentTarget;
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        try {
            const result = await apiRequest(`/users/${id}`, {
                method: 'POST', token,
                body: { platforms: { Leetcode: form.leetcode.value.trim(), Codeforces: form.codeforces.value.trim() } }
            });
            if (!result.success) throw new Error('Import did not complete. Please try again.');
            navigate(`/dashboard/${id}`);
        } catch (failure) {
            if (failure.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            setErrorMessage(failure.message);
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    }
    return (
        <div className="login-page">
            <div className="login-welcome"><h1>Connect your practice profiles</h1></div>
            <div className="login-container">
                <h2>Platform handles</h2>
                <p>The current importer needs both handles. Importing may take a few minutes.</p>
                <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
                    <label htmlFor="leetcode">LeetCode handle</label>
                    <input id="leetcode" name="leetcode" maxLength={100} required />
                    <label htmlFor="codeforces">Codeforces handle</label>
                    <input id="codeforces" name="codeforces" maxLength={100} required />
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Importing…' : 'Connect profiles'}</button>
                </form>
            </div>
            <FeedbackDialog message={errorMessage} onClose={() => setErrorMessage('')} />
        </div>
    );
}
