import { useState } from "react";
import type { ApiData } from '@/interfaces/dbData';

interface Video {
    _id: string;
    stateVideo: boolean;
    typeCanal: string;
    urlVideo: string;
    titleVideo: string;
}


interface GalleryVideoProps {
    videos: Video[];
    data: ApiData | string;
}

const GalleryVideo: React.FC<GalleryVideoProps> = ({ videos, data }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const handleOpenModal = (url: string) => {
        if (!url) return;

        // Soporte para URLs de YouTube en formato embed
        if (url.includes('youtube.com/embed')) {
            setSelectedVideo(url);
            setShowModal(true);
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split("v=")[1]?.split("&")[0];
            setSelectedVideo(`https://www.youtube.com/embed/${videoId}`);
            setShowModal(true);
        } else if (url.includes('vimeo.com')) {
            const videoId = url.split("com/")[1];
            setSelectedVideo(`https://player.vimeo.com/video/${videoId}`);
            setShowModal(true);
        } else if (url.includes('facebook.com')) {
            // Facebook embed usa directamente la URL pública del post
            setSelectedVideo(`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`);
            setShowModal(true);
        }
    };

    return (
        <div className="py-10 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => {
                    const videoId = video.urlVideo.split("v=")[1]?.split("&")[0];
                    const isFacebook = video.urlVideo.includes('facebook.com');
                    return (
                        <div
                            key={video._id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300"
                            onClick={() => handleOpenModal(video.urlVideo)}
                        >
                            <div className="relative">
                                <img
                                    src={
                                        video.urlVideo.includes('youtube.com') || video.urlVideo.includes('youtu.be')
                                            ? `https://img.youtube.com/vi/${video.urlVideo.split("v=")[1]?.split("&")[0]}/hqdefault.jpg`
                                            : video.urlVideo.includes('vimeo.com')
                                                ? `https://www.newsshooter.com/wp-content/uploads/2023/04/vimeo_logo_background.jpeg`
                                                : video.urlVideo.includes('facebook.com')
                                                    ? `${data}`
                                                    : `${data}`
                                    }
                                    alt={video.titleVideo}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center">
                                    <i className="fa-solid fa-play text-5xl text-red-800 hover:text-red-500 transition-all duration-300"></i>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 🔹 MODAL PARA VER EL VIDEO */}
            {showModal && selectedVideo && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-lg overflow-hidden w- 11/12 md:w- 3/4 lg:w- 1/2 relative">
                        <button
                            className="absolute top-2 right-2 z-10 text-gray-600 hover:text-red-500 text-2xl transition-all duration-300"
                            onClick={() => setShowModal(false)}
                        >
                            ✖
                        </button>

                        {/* Contenedor específico para los videos de Facebook */}
                        {selectedVideo.includes('facebook.com') ? (
                            <div className="relative w-[320px] h-[480px] md:h-[560px] " >
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={selectedVideo}
                                    title="Facebook Video"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            // Contenedor normal para YouTube, Vimeo u otros
                            <div className="relative w-[400px] md:w-[600px]" style={{ paddingTop: '56.25%' }}>
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={selectedVideo}
                                    title="Video"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};



export default GalleryVideo;
