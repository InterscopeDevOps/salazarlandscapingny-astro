import React from 'react';
import type { ApiData } from '@/interfaces/dbData';

interface GalleryVideoProps {
    data: ApiData;
}

export const VideoPromo: React.FC<GalleryVideoProps> = ({ data }) => {

    return (
        <div className="relative mb-[200px] bg-cover bg-center bg-no-repeat rounded-b-[100%]" 
        style={{
            backgroundImage: `url("${data?.gallery[0]}")`,
        }}
        >
            <div>
                <iframe
                    src={
                        data.videoAnimado[0].urlVideo.includes('youtube.com')
                          ? `https://www.youtube.com/embed/${new URLSearchParams(data.videoAnimado[0].urlVideo.split('?')[1]).get('v')}`
                          : data.videoAnimado[0].urlVideo.includes('youtu.be')
                          ? `https://www.youtube.com/embed/${data.videoAnimado[0].urlVideo.split('youtu.be/')[1].split('?')[0]}`
                          : data.videoAnimado[0].urlVideo.includes('vimeo.com')
                          ? `https://player.vimeo.com/video/${data.videoAnimado[0].urlVideo.split('vimeo.com/')[1].split(/[?/]/)[0]}`
                          : ''
                      }
                    className="w-[90%] h-[280px] md:h-[360px] md:w-[50%] lg:h-[460px] lg:w-[60%] mx-auto rounded-3xl relative top-[80px] md:top-[150px]"
                    allowFullScreen
                    title="video"
                />
            </div>
        </div>
    );
 
}