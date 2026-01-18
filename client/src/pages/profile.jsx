// src/pages/profile.jsx
import PageLayout from './_layout';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useServerContext, useToastContext, useAuthContext } from '../contexts';
import { formatDate, formatNumber } from '../utils';

import { CalenderIcon, BirthdayIcon } from '../assets/icons';

const avatarPlaceHolder = 'https://ui-avatars.com/api/?name=Friend+Link&background=ff9900&color=fff';

export default function ProfilePage() {
    const { api } = useServerContext();
    const { isAuth, authUser } = useAuthContext();
    const { showToast } = useToastContext();

    const { id: username } = useParams(); // optional param

    const [userData, setUserData] = useState(null);
    const [postData, setPostData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendStatus, setFriendStatus] = useState(null);

    useEffect(() => {
        if (!authUser && !username) return;

        const fetchProfile = async () => {
            try {
                const profileUserId = username || authUser?.id;
                if (!profileUserId) return;

                const profileEndpoint =
                    profileUserId === authUser?.id
                        ? '/api/users/profile'
                        : `/api/users/profile/${profileUserId}`;

                const requests = [
                    api.get(profileEndpoint),
                    api.get(`/api/users/posts/${profileUserId}`),
                ];

                if (isAuth) {
                    requests.push(api.get(`/api/friends/status/${profileUserId}`));
                }

                const [userRes, postRes, friendRes] = await Promise.all(requests);

                setUserData(userRes?.data.profile);
                setPostData(postRes?.data.posts);
                setFriendStatus(friendRes?.data.status);

            } catch (err) {
                showToast('Failed to load profile', 'error');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, authUser]);

    // Friend Status Handlers
    const handleAddFriend = async () => {
        if (!isAuth) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`/api/friends/request/${userData.id}`);
            setFriendStatus('requested');
            showToast('Friend request sent', 'success');
        } catch {
            showToast('Failed to send request', 'error');
        }
    };

    const handleAcceptFriend = async () => {
        try {
            await api.post(`/api/friends/accept/${userData?.id}`);
            setFriendStatus('friends');
            showToast('Friend added', 'success');
        } catch {
            showToast('Failed to accept request', 'error');
        }
    };

    if (!userData) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center h-full">
                    Profile not found.
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="flex flex-col size-full p-2">

                {loading && (
                    <div className="text-subtext">Loading profile...</div>
                )}

                {/* Header */}
                <div className="grid grid-cols-4 gap-2 items-center">
                    <div className="col-span-1">
                        <img
                            src={userData?.avatar || avatarPlaceHolder}
                            alt="avatar"
                            className="size-full max-w-40 max-h-40 rounded-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <p className="font-bold">{formatNumber(postData?.length)}</p>
                        <p className="text-sm text-subtext">moments</p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <p className="font-bold">{formatNumber(userData?.friend_count || 0)}</p>
                        <p className="text-sm text-subtext">friends</p>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="flex flex-col gap-2 p-2 mt-2">
                    <div className="flex items-center">
                        <p className="font-bold text-xl">{userData?.name}</p>

                        {/* OWN PROFILE */}
                        {userData.id === authUser?.id && (
                            <NavLink
                                to="/settings/profile"
                                className="btn btn-secondary ml-auto text-xs"
                            >
                                Edit Profile
                            </NavLink>
                        )}

                        {/* OTHER USER */}
                        {userData?.id !== authUser?.id && (
                            <>
                                {friendStatus === 'none' && (
                                    <button
                                        onClick={handleAddFriend}
                                        className="btn btn-primary ml-auto text-xs"
                                    >
                                        Add Friend
                                    </button>
                                )}

                                {friendStatus === 'requested' && (
                                    <button className="btn btn-secondary ml-auto text-xs" disabled>
                                        Requested
                                    </button>
                                )}

                                {friendStatus === 'pending' && (
                                    <button
                                        onClick={handleAcceptFriend}
                                        className="btn btn-primary ml-auto text-xs"
                                    >
                                        Accept
                                    </button>
                                )}

                                {friendStatus === 'friends' && (
                                    <button className="btn btn-secondary ml-auto text-xs">
                                        Friends
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    <p className="text-subtext">@{userData?.username || 'username'}</p>
                    <p>{userData?.bio}</p>

                    <div className="flex flex-col text-sm gap-1">
                        <p className="text-subtext flex gap-2 items-center">
                            <BirthdayIcon />
                            Born {formatDate(userData?.dob)}
                        </p>
                        <p className="text-subtext flex gap-2 items-center">
                            <CalenderIcon />
                            Joined {formatDate(userData?.joined)}
                        </p>
                    </div>
                </div>

                {/* Posts Section*/}
                {!isAuth ? (
                    <div className="text-center text-subtext py-12">
                        Login to see moments
                    </div>
                ) : postData.length ? (
                    <div className="grid-container mt-4">
                        {postData.map(post => (
                            <div key={post.id} className="grid-item relative">

                                {/* Click layer */}
                                <NavLink
                                    to={`/post/${post.id}`}
                                    className="absolute inset-0 z-10"
                                />

                                {post.media_type === 'video' ? (
                                    <video
                                        alt="post"
                                        src={post.media_url}
                                        muted
                                        loop
                                        autoPlay
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        alt="post"
                                        src={post.media_url}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-subtext py-12">
                        No moments yet
                    </div>
                )}

            </div>
        </PageLayout>
    );
}