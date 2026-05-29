import type { ApiData } from "@/interfaces/dbData";

interface ValuesContentProps {
    dataGlobal: ApiData;
}

const ValuesContent: React.FC<ValuesContentProps> = ({ dataGlobal }) => {
    return (
        <div className="bg-primary -mt-0 lg:-mt-20">

            <div className=" w-11/12 mx-auto flex justify-between">
                <picture>
                    <img
                        src="/assets/images/404Img/leaf-1.png"
                        alt="Leaf"
                        loading="lazy"
                        className="aspect-auto w-full h-[300px] object-contain object-center"
                        width={200}
                        height={300}
                    />
                </picture>
                <div className="flex justify-center items-center md:items-end ">
                    <div className="flex flex-col items-center justify-center gap-5">
                        <p className="text-2xl md:text-5xl font-medium text-tertiary capitalize flex gap-2">
                            <i className="fa-light fa-seedling"></i>
                            <span>Our Values</span>
                        </p>
                        <h3 className="text-lg md:text-3xl font-bold text-white capitalize text-center">
                            {dataGlobal.slogan[0]}
                        </h3>
                    </div>
                </div>
                <picture>
                    <img
                        src="/assets/images/404Img/leaf-2.png"
                        alt="Leaf"
                        loading="lazy"
                        className="aspect-auto w-full h-[300px] object-contain object-center"
                        width={200}
                        height={300}
                    />
                </picture>
            </div>
            <div className="w-[70%] mx-auto  pb-5 md:pb-14 grid grid-cols-1 lg:grid-cols-3 gap-5 relative mt-0 md:mt-10">
                <div className="bg-white rounded-2xl p-5 shadow-sm shadow-white text-center md:text-start">
                    <i className="fa-light fa-wreath-laurel text-5xl text-btnHover"></i>
                    <h4 className="text-2xl font-bold text-secondary capitalize px-2 pb-3">
                        mission
                    </h4>
                    <p>
                        {dataGlobal.valuesContent.mission}
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm shadow-white text-center md:text-start">
                    <i className="fa-light fa-hand-holding-seedling text-5xl text-btnHover"></i>

                    <h4 className="text-2xl font-bold text-secondary capitalize px-2 pb-3">
                        Vision
                    </h4>
                    <p>
                        {dataGlobal.valuesContent.vision}
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm shadow-white text-center md:text-start">
                    <i className="fa-light fa-handshake text-5xl text-btnHover"></i>

                    <h4 className="text-2xl font-bold text-secondary capitalize px-2 pb-3">
                        Why Choose Us
                    </h4>
                    <p>
                        {dataGlobal.valuesContent.whychooseUs}
                    </p>
                </div>
            </div>
            <div className="-mt-40">
                <picture>
                    <img
                        src="/assets/images/404Img/leaf-3.png"
                        alt="Leaf"
                        loading="lazy"
                        className="w-full h-[200px] md:h-full object-cover object-center aspect-auto"
                        width={500}
                        height={500}
                    />
                </picture>

            </div>
        </div>
    )
}

export default ValuesContent;