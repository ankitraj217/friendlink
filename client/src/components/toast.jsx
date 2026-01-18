// src/components/toast.jsx
import { useToastContext } from '../contexts';

export default function Toast() {
    const { toast, isToastVisible } = useToastContext();

    if (!isToastVisible) return null;

    const base =
        'fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300';

    const variants = {
        success: 'bg-surface border-l-4 border-green-500',
        error: 'bg-surface border-l-4 border-red-500',
        warning: 'bg-surface border-l-4 border-yellow-500',
        info: 'bg-surface border-l-4 border-accent',
    };

    return (
        <div className={`${base} ${variants[toast.type] || variants.info}`}>
            {toast.message}
        </div>
    );
}
