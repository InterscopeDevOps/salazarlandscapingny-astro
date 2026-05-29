import LazyImage from "@/components/LazyImage";
import type { BeforeAfter, } from "@/interfaces/dbData";
import { ImgComparisonSlider } from '@img-comparison-slider/react';


interface GalleryBAProps {
    BeforeAfter: BeforeAfter[];
}

const GalleryBA: React.FC<GalleryBAProps> = ({ BeforeAfter }) => {
    // Estado para controlar la visibilidad del modal y la imagen seleccionada


    // const LandImg = LandingsGallery.map((item)=> item)




    return (
        <>
            {
                BeforeAfter.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-5 py-20">
                        {
                            BeforeAfter.map((item, index) => (
                                <ImgComparisonSlider key={index}>
                                    <div slot="first">
                                        <LazyImage
                                            alt="Before"
                                            className="w-full h-full md:w-[400px] md:h-[400px] object-cover"
                                            src={item.beforeImg.images}
                                            height={400}
                                            imgLoading="lazy"
                                        />
                                    </div>
                                    <div slot="second">
                                        <LazyImage
                                            alt="After"
                                            className="w-full h-full md:w-[400px] md:h-[400px] object-cover"
                                            src={item.afterImg.images}
                                            height={400}
                                            imgLoading="lazy"
                                        />

                                    </div>
                                </ImgComparisonSlider>
                            ))
                        }

                    </div>
                ) : (
                    null
                )
            }
        </>
    );
};


export default GalleryBA;