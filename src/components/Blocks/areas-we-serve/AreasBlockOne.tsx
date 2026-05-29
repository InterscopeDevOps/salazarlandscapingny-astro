import LazyImage from "@/components/LazyImage";
import ButtonContent_2 from "@/components/button/ButtonContent_2";

interface AreasBlockOneProps {
    title: string;
    text: string;
    nameBtn: string;
    image: string;
    bgImages?: string;
}

const AreasBlockOne: React.FC<AreasBlockOneProps> = ({ title, text, nameBtn, image, bgImages }) => {

    return (
        <div className="flex w-full mb-10 md:-mb-10 pt-24 pb-56 px-5 md:px-10 bg-primary relative overflow-hidden" >
            <div className="absolute right-0 left-0 md:right-[10%] top-0 flex justify-center md:justify-end">
                <LazyImage
                    src={image}
                    alt={title}
                    className="w-[250px] h-[250px] md:w-96 md:h-96 object-cover border-t-[10px] border-btnHover rounded-b-full"
                />
            </div>
            <div className="w-4/5 mx-auto pt-[200px] md:pt-0">
                <div className="w-full md:w-8/12 mx-auto md:ml-0 md:mr-auto">
                    <h2 className="text-3xl font-bold text-white text-center md:text-start">{title}</h2>
                    <p className="text-white mt-5 text-center md:text-start">{text}</p>
                    <div className="flex justify-center md:justify-start mt-10">
                        <ButtonContent_2 titleBtn={nameBtn} linkBtn={`tel:+1`} />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 right-0 flex gap-5 md:gap-10">
                <LazyImage
                    src={"/assets/images/404Img/leaf-4.png"}
                    alt="leaft images"
                    className="w-28 h-28 md:w-52 md:h-52 object-contain"
                />
                <LazyImage
                    src={"/assets/images/404Img/leaf-4.png"}
                    alt="leaft images"
                    className="w-28 h-28 md:w-52 md:h-52 object-contain"
                />
                <LazyImage
                    src={"/assets/images/404Img/leaf-4.png"}
                    alt="leaft images"
                    className="w-28 h-28 md:w-52 md:h-52 object-contain"
                />
            </div>
        </div>
    );
};

export default AreasBlockOne;