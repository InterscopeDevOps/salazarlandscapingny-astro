import type { ApiData } from "@/interfaces/dbData";

interface GalleryVideoProps {
    dataGlobal: ApiData;
}

const GalleryVideo: React.FC<GalleryVideoProps> = ({ dataGlobal }) => {
    return (
        <>
            {
                dataGlobal.videoAnimado.map((video, index) => (
                    <div key={index} className="py-20 border-4">
                        {
                            video.titleVideo
                        }
                    </div>
                ))
            }
        </>
    );
}

export default GalleryVideo;