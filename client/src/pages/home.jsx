// src/pages/home.jsx
import { useEffect, useState } from "react";
import { useServerContext, useToastContext } from '../contexts';
import PageLayout from "./_layout";
import Post from "../components/post"

export default function HomePage() {
    const { api } = useServerContext();
    const { showToast } = useToastContext();
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeed();
    }, []);

    async function loadFeed() {
        try {
            const res = await api.get("/api/feed");
            setFeed(res.data.feed || []);
        } catch (err) {
            showToast('Faild to load feed', 'error');
            console.error("Feed failed", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageLayout>
            <div className="flex flex-col items-center gap-6 py-6">

                {loading && (
                    <div className="text-subtext">Loading feed...</div>
                )}

                {feed.length === 0 && (
                    <div className="text-subtext">No new feed from friends</div>
                )}

                {
                    feed.map((post, idx) => (
                        <Post key={idx} post={post} />
                    ))
                }

            </div>
        </PageLayout>
    )
}
