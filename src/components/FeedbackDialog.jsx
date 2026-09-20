import { useEffect, useRef } from 'react';

export default function FeedbackDialog({ message, onClose }) {
    const dialog = useRef(null);
    useEffect(() => {
        const element = dialog.current;
        if (message && !element.open) element.showModal();
        if (!message && element.open) element.close();
        return () => { if (element.open) element.close(); };
    }, [message]);
    return (
        <dialog ref={dialog} className="feedback-dialog" aria-labelledby="feedback-title"
            aria-describedby="feedback-message" onCancel={onClose} onClose={onClose}>
            <h2 id="feedback-title">Please try again</h2>
            <p id="feedback-message">{message}</p>
            <button type="button" onClick={onClose} autoFocus>Try again</button>
        </dialog>
    );
}
