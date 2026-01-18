// src/pages/reels.jsx
import { useEffect, useState } from 'react';
import Post from '../components/post';
import PageLayout from './_layout';
import { useServerContext, useToastContext } from '../contexts';

export default function ReelsPage() {
    const { api } = useServerContext();
    const { showToast } = useToastContext();

    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const res = await api.get('/api/reels');
                setReels(res?.data.reels || []);
            } catch (err) {
                showToast('Failed to load reels', 'error');
                console.error("Reels faild", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReels();
    }, []);

    return (
        <PageLayout>
            <div className="flex flex-col items-center size-full p-2 gap-4 pb-12">

                {loading && (
                    <div className="text-subtext">Loading reels...</div>
                )}

                {reels.length === 0 && (
                    <p className="text-center text-subtext">
                        No reels available
                    </p>
                )}

                {reels.map((post, idx) => (
                    <Post key={idx} post={post} />
                ))}

            </div>
        </PageLayout>
    );
}

