// scr/pages/explore.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useServerContext, useToastContext } from "../contexts";
import { SearchIcon, ForwardArrowIcon, HeartIcon, CommentIcon } from "../assets/icons";
import PageLayout from "./_layout";

export default function ExplorePage() {
    const { api } = useServerContext();
    const { showToast } = useToastContext();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [exploreData, setExploreData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load explore posts
    useEffect(() => {
        loadExplore();
    }, []);

    async function loadExplore() {
        try {
            const res = await api.get("/api/explore");
            setExploreData(res.data.explore || []);
        } catch (err) {
            showToast('Failed to load content', 'error');
            console.error("Explore load failed", err);
        } finally {
            setLoading(false);
        }
    }

    // Live user search
    useEffect(() => {
        if (!search.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                const res = await api.get(`/api/search/users?q=${search}`);
                setResults(res.data || []);
            } catch {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <PageLayout>
            {/* -------- Search Section -------- */}
            <div className="flex gap-2 p-2 flex-col items-center justify-center">

                <div className="flex gap-2 h-12 p-1 w-full max-w-96 items-center rounded-lg bg-surface">
                    <SearchIcon className="size-8 text-subtext" />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search new friends..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent outline-none"
                    />
                </div>

                {/* -------- Search Results -------- */}
                {results.map((user) => (
                    <NavLink
                        key={user.id}
                        to={`/profile/${user.username}`}
                        className="flex h-12 gap-2 p-1 w-full max-w-96 items-center rounded-lg bg-surface hover:bg-surface/90"
                    >
                        <img
                            src={user.avatar}
                            className="size-8 rounded-full object-cover"
                        />

                        <div className="flex flex-col">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-subtext">@{user.username}</p>
                        </div>

                        <ForwardArrowIcon className="ml-auto size-6 text-subtext" />
                    </NavLink>
                ))}
            </div>

            {/* -------- Explore Grid -------- */}
            <div className="grid-container">

                {loading && (
                    <div className="text-center text-subtext py-10">
                        Loading explore...
                    </div>
                )}

                {!loading && exploreData.length === 0 && (
                    <div className="text-center text-subtext py-10">
                        No moments to explore
                    </div>
                )}

                {exploreData.map((post) => (
                    <NavLink
                        to={`/post/${post.id}`}
                        key={post.id}
                        className="grid-item bg-surface overflow-hidden"
                    >
                        {post.media_type === "video" ? (
                            <video
                                src={post.media_url}
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                                onMouseEnter={(e) => e.currentTarget.play()}
                                onMouseLeave={(e) => e.currentTarget.pause()}
                            />
                        ) : (
                            <img
                                src={post.media_url}
                                alt="post"
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-sm gap-6">
                            <span><HeartIcon /> {post.like_count}</span>
                            <span><CommentIcon /> {post.comment_count}</span>
                        </div>
                    </NavLink>
                ))}

            </div>
        </PageLayout>
    );
}