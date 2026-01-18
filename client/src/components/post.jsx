// src/components/post.jsx
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { wrapText, formatDate, formatNumber } from '../utils';
import { useAuthContext, useServerContext, useToastContext } from '../contexts';;
import VideoPlayer from './video/player';
import {
    CloseIcon, SendIcon, MessagesIcon, HeartIcon,
    MoreOptionsIcon, HeartFilledIcon, DeleteIcon
} from '../assets/icons';

const avatarPlaceHolder = 'https://ui-avatars.com/api/?name=Friend+Link&background=ff9900&color=fff';

export default function Post({ post }) {
    const { api } = useServerContext();
    const { authUser } = useAuthContext();
    const { showToast } = useToastContext();

    const [commentData, setCommentData] = useState(null);
    const [addCmt, setAddCmt] = useState('');
    const [isPostLiked, setIsPostLiked] = useState(false);
    const [openCommentBox, setOpenCommentBox] = useState(false);
    const [showCaption, setShowCaption] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const captionLength = post?.caption?.length || 0;

    /* ---------------- CAPTION TOGGLE ---------------- */
    const handleShowCaption = () => {
        if (captionLength > 35) setShowCaption(prev => !prev);
    };

    /* ---------------- FETCH COMMENTS ---------------- */
    useEffect(() => {
        if (!post?.id) return;

        const fetchComments = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/comments/${post.id}`);
                setCommentData(res?.data.comments);
            } catch (err) {
                showToast('Error fetching comments', true);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [post?.id, refresh]);

    /* ---------------- LIKE HANDLER ---------------- */
    const handlePostLike = async () => {
        if (!post?.id) return;
        try {
            if (isPostLiked) {
                await api.delete(`/api/likes/${post.id}`);
                setIsPostLiked(false);
            } else {
                await api.post(`/api/likes/${post.id}`);
                setIsPostLiked(true);
            }
        } catch (err) {
            showToast('Error updating like', true);
        }
    };

    /* ---------------- ADD COMMENT ---------------- */
    const handleAddComment = async () => {
        if (!addCmt.trim() || !post?.id) return;
        try {
            await api.post(`/api/comments/${post?.id}`, { comment: addCmt.trim() });
            setAddCmt('');
            setRefresh(prev => !prev);
        } catch (err) {
            showToast('Error adding comment', true);
        }
    };

    /* ---------------- DELETE COMMENT ---------------- */
    const handleDeleteComment = async () => {
        if (!post?.id) return;
        try {
            await api.delete(`/comment/${post?.id}`);
            setRefresh(prev => !prev);
        } catch (err) {
            showToast('Error deleting comment', true);
        }
    };

    return (
        <div className="flex flex-col items-center bg-surface w-full max-w-96 relative rounded-2xl">

            {/* USER HEADER */}
            <div className="flex gap-2 items-center w-full p-2">
                <img
                    src={post?.avatar || avatarPlaceHolder}
                    className="size-8 rounded-full cursor-pointer"
                    alt="Profile"
                />
                <div className="flex flex-col cursor-pointer">
                    <p className="font-semibold text-sm">{post?.name}</p>
                    <p className="font-semibold text-xs text-subtext">@{post?.username || 'username'}</p>
                </div>

                <div className="flex gap-2 ml-auto items-center">
                    <MoreOptionsIcon className="size-5 cursor-pointer" />
                </div>
            </div>

            {/* MEDIA */}
            <div className='size-full min-h-96'>
                {
                    post?.media_type === 'video' ?
                        <VideoPlayer url={post?.media_url} />
                        :
                        <img
                            src={post?.media_url}
                            className="size-full max-size-96"
                            alt="Post Media"
                        />
                }
            </div>
            {/* ACTIONS */}
            <div className="flex gap-8 items-center w-full p-4 h-10">
                <div className="flex items-center cursor-pointer gap-2"
                    onClick={handlePostLike}
                >
                    {/* <HeartIcon className={`size-5 ${isPostLiked ? 'text-accent' : 'text-subtext'}`} /> */}
                    {
                        isPostLiked ?
                            <HeartFilledIcon className='size-5 text-accent' />
                            :
                            <HeartIcon className='size-5 text-subtext' />
                    }
                    <p className="text-subtext font-semibold">{formatNumber(post?.like_count)}</p>
                </div>

                <div className="flex items-center gap-2 text-subtext cursor-pointer"
                    onClick={() => setOpenCommentBox(prev => !prev)}
                >
                    <MessagesIcon className="size-5" />
                    <p className="font-semibold">{formatNumber(post?.comment_count)}</p>
                </div>

                <div className="flex gap-2 items-center ml-auto text-subtext">
                    <p className="text-xs font-semibold">{formatDate(post?.created)}</p>
                </div>
            </div>

            {/* CAPTION */}
            {post?.caption && (
                <div className="w-full px-2 pb-4">
                    <p className="px-2 text-sm cursor-pointer" onClick={handleShowCaption}>
                        {showCaption || captionLength <= 35
                            ? post.caption
                            : `${post.caption.slice(0, 35)}...`}
                        {captionLength > 35 && (
                            <span className="text-accent ml-1">
                                {showCaption ? 'less' : 'more'}
                            </span>
                        )}
                    </p>
                </div>
            )}

            {/* COMMENT BOX */}
            {openCommentBox && (
                <div className="flex flex-col w-full p-2 gap-2 rounded-2xl bg-surface absolute bottom-0">

                    <div className="flex items-center gap-2 px-2">
                        <p className='text-sm font-semibold text-subtext'>Comments</p>
                        <CloseIcon
                            className="size-6 ml-auto cursor-pointer text-subtext"
                            onClick={() => setOpenCommentBox(false)}
                        />
                    </div>

                    <div className="flex w-full gap-2 items-center">
                        <img
                            src={authUser?.avatar || avatarPlaceHolder}
                            className="size-8 rounded-full"
                            alt="Profile"
                        />
                        <input
                            type="text"
                            placeholder="Add a comment"
                            value={addCmt}
                            onChange={e => setAddCmt(e.target.value)}
                            className="flex-1 px-3 h-10 rounded-lg text-sm bg-background focus:outline-none focus:border-accent"
                        />
                        <SendIcon
                            className="size-6 mr-2 cursor-pointer text-accent"
                            onClick={handleAddComment}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        {commentData?.map((cmt, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <NavLink to={`/profile/${cmt?.user_id}`}>
                                    <img
                                        src={cmt?.avatar || avatarPlaceHolder}
                                        className="size-8 rounded-full"
                                        alt="Commenter"
                                    />
                                </NavLink>
                                <div className="flex flex-col">
                                    <NavLink to={`/profile/${cmt?.user_id}`} className="font-semibold text-xs text-subtext">
                                        {wrapText(cmt?.name)}
                                    </NavLink>
                                    <p className="text-sm">{cmt?.comment}</p>
                                </div>
                                {cmt.user_id === authUser?.id && (
                                    <DeleteIcon
                                        className="size-5 ml-auto cursor-pointer text-red-500"
                                        onClick={handleDeleteComment}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
