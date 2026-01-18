// src/pages/posts/view.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useServerContext, useToastContext } from "../../contexts";
import Post from "../../components/post";
import PageLayout from "../_layout";

// src/pages/posts/view.jsx
export default function ViewPostPage() {
    const { id } = useParams();
    const { api } = useServerContext();
    const { showToast } = useToastContext();

    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/api/posts/${id}`);
                setPost(res?.data?.post);
            } catch (err) {
                showToast('Error fetching post', true);
            }
        };

        fetchPost();
    }, [id]);

    return (
        <PageLayout>
            <div className="flex flex-col w-full items-center justify-center gap-4 py-6">
                <Post post={post} />
            </div>
        </PageLayout>
    )
}
