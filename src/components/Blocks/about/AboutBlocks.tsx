import LazyImage from "@/components/LazyImage";
import ButtonContent_2 from "@/components/button/ButtonContent_2";
import type { Phone, SectionsHomeAbout } from "@/interfaces/dbData";

interface AboutsBlocksProps {
    dataAbout: SectionsHomeAbout[];
    dbPhone: Phone[];
}

const AboutsBlocks: React.FC<AboutsBlocksProps> = ({ dataAbout,dbPhone }) => {
    const primaryPhone = dbPhone[0].number;
    return (
        <div className="relative w-full h-full">
            <div className="w-full h-full">
                <LazyImage
                    src={dataAbout[1].additionalImages[0]}
                    alt={dataAbout[1].additionalImages[0]}
                    className="w-full md:w-[70%] h-[350px] md:h-[700px] object-cover object-center shadow border-none md:border-r-[30px] border-btnHover"
                />
            </div>
            <div className="md:absolute right-0 -bottom-10 bg-primary w-full  md:w-[60%]  flex items-center px-5 md:pr-0 md:pl-20 py-10 md:py-32">
                <div className="w-4/5 mx-auto md:ml-0 md:mr-auto h-full">
                    <h2 className="text-3xl font-bold text-white mb-5 capitalize text-center md:text-start">
                        {dataAbout[1].title}
                    </h2>
                    <p className="text-center md:text-justify pb-3 text-white"> {dataAbout[1].text} </p>
                    {
                        dataAbout[1].list.length > 0 && (
                            <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 md:hidden">
                                {dataAbout[1].list.map((item, index) => (
                                    <li key={index} className="text-lg pb-3 font-semibold text-white">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )
                    }
                    <div className="flex flex-col md:flex-row justify-center items-center md:justify-start gap-10 py-5">
                        <ButtonContent_2 btnstyle="btnStyle3 hidden md:block"/>
                        <ButtonContent_2 btnstyle="btnStyle3" titleBtn="Call us now" linkBtn={`tel:+1${primaryPhone}`}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutsBlocks;
