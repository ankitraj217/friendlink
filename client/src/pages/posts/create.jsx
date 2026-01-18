// src/pages/posts/create.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServerContext, useToastContext } from '../../contexts';
import { Input } from '../../components/input';
import PageLayout from '../_layout';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export default function CreatePage() {
    const navigate = useNavigate();
    const { api } = useServerContext();
    const { showToast } = useToastContext();

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
    const [isUploading, setIsUploading] = useState(false);

    const [postInfo, setPostInfo] = useState({
        caption: '',
        location: '',
    });

    // File select & preview
    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!selected.type.startsWith('image') && !selected.type.startsWith('video')) {
            showToast('Only image or video files allowed', "warning");
            return;
        }

        if (selected.size > MAX_FILE_SIZE) {
            showToast('File too large (max 20MB)', "warning");
            return;
        }

        setFile(selected);
        setMediaType(selected.type.startsWith('video') ? 'video' : 'image');

        const url = URL.createObjectURL(selected);
        setPreviewUrl(url);
    };

    // Cleanup preview URL
    useEffect(() => {
        return () => previewUrl && URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);


    // Submit post
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            showToast('Select media to post', "warning");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('media', file);
        formData.append('mediaType', mediaType);
        formData.append('caption', postInfo.caption.trim());
        formData.append('location', postInfo.location.trim());

        try {
            await api.post('/api/posts/create', formData);

            showToast('Posted successfully', "success");
            // reset
            setFile(null);
            setPreviewUrl(null);
            setPostInfo({ caption: '', location: '' });
            navigate('/profile');
        } catch (err) {
            showToast('Failed to post', "error");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <PageLayout>
            <div className="flex flex-col size-full items-center gap-2 p-2">

                {/* Preview */}
                <div className="w-full max-w-md h-96 rounded-lg bg-surface relative flex items-center justify-center overflow-hidden">

                    {previewUrl ? (
                        mediaType ? (
                            <video
                                src={previewUrl}
                                className="w-full h-full object-cover"
                                controls
                            />
                        ) : (
                            <img
                                src={previewUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <p className="bg-background p-2 rounded-lg">
                            Select image or video
                        </p>
                    )}

                    <input
                        type="file"
                        accept="image/*,video/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="w-full max-w-md flex flex-col gap-3 p-2">

                    <div className="flex flex-col gap-1">
                        <label>Caption</label>
                        <Input
                            type="text"
                            placeholder="Write a caption..."
                            value={postInfo.caption}
                            onChange={(e) =>
                                setPostInfo({ ...postInfo, caption: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label>Location</label>
                        <Input
                            type="text"
                            placeholder="@ Patna, Bihar"
                            value={postInfo.location}
                            onChange={(e) =>
                                setPostInfo({ ...postInfo, location: e.target.value })
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full btn btn-primary mt-4 flex items-center justify-center gap-2
                            ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>
        </PageLayout>
    );
}