import type { ApiData, SectionsHomeAbout } from "@/interfaces/dbData";
import LazyImage from "../LazyImage";
import UseTextHidden from "@/hook/UseTextHidden";

import { useEffect, useState } from "react";

interface SlidesShowProps {
    dataBlocks: SectionsHomeAbout[];
    dataGlobal: ApiData;
    useVideo?: boolean;
}

const SlidesShow: React.FC<SlidesShowProps> = ({ dataBlocks, dataGlobal, useVideo }) => {
    const [sendInput, setSendInput] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sloganIndex, setSloganIndex] = useState(0);
    const slogans = dataGlobal.slogan?.slice(0, 4) ?? [];
    const slides = dataBlocks[0]?.additionalImages ?? [];
    const totalSlides = slides.length;

    const nextSlide = () => {
        if (!totalSlides) return;
        setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        if (!totalSlides) return;
        setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const handleDotClick = (index: number) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        if (slogans.length <= 1) return;
        const timer = setInterval(() => {
            setSloganIndex((prev) => (prev + 1) % slogans.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [slogans.length]);

    useEffect(() => {
        if (totalSlides <= 1) return;

        const sliderTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5500);

        return () => clearInterval(sliderTimer);
    }, [totalSlides]);

    useEffect(() => {
        if (!totalSlides) {
            setCurrentSlide(0);
            return;
        }

        if (currentSlide > totalSlides - 1) {
            setCurrentSlide(0);
        }
    }, [currentSlide, totalSlides]);

    const sendWhatsapp = () => {
        const trimmedMessage = sendInput.trim();
        if (!trimmedMessage) return;

        const relmsg = encodeURIComponent(trimmedMessage);
        const phone = dataGlobal.dataGeneral.phones[0].number.replace(/\D/g, "");

        window.open(`https://wa.me/1${phone}?text=` + relmsg, "_blank");
        setSendInput("");
    };

    return (
        <div className="relative h-full md:h-[115vh] overflow-hidden">
            <div className="absolute w-full h-full top-0 left-0 z-10">
                {
                    useVideo ? (
                        <video
                            playsInline
                            autoPlay
                            muted
                            loop
                            className="w-full h-full md:h-full object-cover"
                        >
                            <source src={"/assets/videos/Stock Video.mp4"} type="video/mp4" />
                        </video>
                    ) : slides.length > 0 ? (
                        <div className="relative w-full h-full">
                            <style>{`
                                @keyframes bgZoomIn {
                                    from { transform: scale(1); }
                                    to   { transform: scale(1.12); }
                                }
                                .bg-slide-active {
                                    animation: bgZoomIn 6s ease-in-out forwards;
                                }
                            `}</style>
                            {slides.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Background slide ${index + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 bg-slide-active" : "opacity-0"}`}
                                />
                            ))}
                        </div>
                    ) : (
                        <img
                            src="/assets/images/stockWeb/PlaceholderBlur.webp"
                            alt="Background"
                            className="w-full h-full md:h-full object-cover"
                        />
                    )
                }

            </div>

            <div className="absolute w-full h-full top-0 left-0 z-20 bg-gradient-to-br from-black/60 via-black/40 to-black/30"></div>
            <div className="absolute top-[8%] -left-10 z-20 h-44 w-44 rounded-full bg-tertiary/35 blur-3xl"></div>
            <div className="absolute bottom-[12%] right-0 z-20 h-56 w-56 rounded-full bg-primary/30 blur-3xl"></div>

            <div className="relative z-30 w-full max-w-[1400px] mx-auto h-full flex flex-col-reverse md:flex-row justify-between items-center gap-8 pt-[180px] pb-10 md:pt-[260px] md:pb-20">
                <div className="text-center md:text-start w-full md:w-[52%] md:-mt-20 ml-0 md:ml-[5%] px-3 z-30">

                    <div className="fade-in-down inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-1 text-xs md:text-sm font-semibold text-white/90 backdrop-blur-md" style={{ animationDelay: '0.2s' }}>
                        <span className="h-2 w-2 rounded-full bg-tertiary"></span>
                        <UseTextHidden text="Reliable Landscaping Experts" />
                    </div>

                    <h1 key={sloganIndex} className="curtain-reveal text-white text-4xl md:text-5xl font-black uppercase pb-5 pt-4 leading-tight drop-shadow-[0_6px_24px_rgba(0,0,0,0.4)]">
                        {slogans[sloganIndex] ?? dataBlocks[0]?.title}
                    </h1>
                    <p className="fade-in-left text-white/90 text-base md:text-lg max-w-2xl" style={{ animationDelay: '0.6s' }}>
                        {(() => {
                            const text = dataBlocks[0]?.text ?? "";
                            const first = text.indexOf(".");
                            const second = text.indexOf(".", first + 1);
                            return second !== -1 ? text.slice(0, second + 1) : text;
                        })()}
                    </p>

                    <div className="fade-in-up w-full md:w-[92%] z-50 bg-white/15 border border-white/30 rounded-2xl py-2 px-2 flex items-start space-x-2 mt-6 backdrop-blur-xl shadow-[0_14px_38px_rgba(0,0,0,0.35)]" style={{ animationDelay: '0.8s' }}>
                        <div className="w-auto h-auto">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex justify-center items-center shadow-lg shadow-green-900/40">
                                <i className="fa-brands fa-whatsapp text-white text-lg"></i>
                            </div>
                        </div>
                        <div className="w-[90%] bg-white/95 rounded-xl overflow-hidden px-1 h-full">
                            <input
                                className="w-full h-full py-3 rounded-lg px-2 text-black outline-none"
                                type="text"
                                placeholder="Send Message..."
                                value={sendInput}
                                onChange={(e) => setSendInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendWhatsapp();
                                    }
                                }}
                            />
                        </div>
                        <div className="w-auto">
                            <button
                                className="w-12 h-12 rounded-full shadow-xl bg-white hover:bg-green-600 text-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 transition-all duration-300"
                                id="send_btn"
                                type="button"
                                onClick={() => sendWhatsapp()}
                                disabled={!sendInput.trim()}
                            >
                                <i className="fa-regular fa-paper-plane text-lg"></i>
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex justify-start px-1 md:px-4 mt-5 gap-2 md:gap-4">
                        <div className="fade-in-up flex-1 p-3 text-white rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm" style={{ animationDelay: '1.0s' }}>
                            <h1 className="text-3xl md:text-5xl font-extrabold ">{dataGlobal.yearsExperience} +</h1>
                            <p className="text-sm md:text-base font-semibold"><UseTextHidden text="Years Of Experience" /></p>
                        </div>
                        <div className="fade-in-up flex-1 p-3 text-white rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm hidden md:block" style={{ animationDelay: '1.1s' }}>
                            <h1 className="text-5xl font-extrabold ">100 %</h1>
                            <p className="text-base font-semibold"><UseTextHidden text="Professionals" /></p>
                        </div>
                        <div className="fade-in-up flex-1 p-3 text-white rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm" style={{ animationDelay: '1.3s' }}>
                            <h1 className="text-3xl md:text-5xl font-extrabold ">{dataGlobal.milesCover} +</h1>
                            <p className="text-sm md:text-base font-semibold"><UseTextHidden text="Miles Cover In" /> {dataGlobal.dataGeneral.location[0].city}</p>
                        </div>
                    </div>
                </div>

                <div className="fade-in-right w-full md:w-[44%] h-full flex  flex-col justify-center items-end -mt-20 md:mt-10 md:-mb-16 relative px-3 md:px-0 " style={{ animationDelay: '0.3s' }}>
                    <img
                        src={dataGlobal.logos.primary}
                        alt={dataGlobal.name}
                        className="fade-in-down w-full md:w-96 md:pr-20 mb-5 md:mb-0 mx-auto flex md:-mt-64  md:mx-0"
                        style={{ animationDelay: '0s' }}
                    />

                    <div className="w-full md:w-[88%] h-[430px] md:h-[700px] bg-white/15 backdrop-blur-md p-3 shadow-2xl rounded-[2.2rem] md:rounded-t-[11rem] md:rounded-b-[2.5rem] relative border border-white/30">
                        <div className="absolute top-5 right-5 z-30 rounded-full bg-white/20 border border-white/35 px-3 py-1 text-xs md:text-sm font-semibold text-white backdrop-blur-md">
                            <UseTextHidden text="Premium Finish" />
                        </div>

                        <div className="relative over w-full h-full rounded-[1.8rem] md:rounded-t-[10.5rem] md:rounded-b-[2rem] overflow-hidden border-[8px] border-white/60 shadow-xl">
                            {slides.map((imag, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-700 ease-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}
                                >
                                    <LazyImage
                                        src={imag}
                                        alt={"image slider" + index}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                                </div>
                            ))}

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] rounded-xl border border-white/35 bg-white/15 p-3 backdrop-blur-lg text-white shadow-lg">
                                <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
                                    <span><UseTextHidden text="Project Gallery" /></span>
                                    <span>{totalSlides ? `${currentSlide + 1}/${totalSlides}` : "0/0"}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2 justify-center">
                                    {slides.map((_, index) => (
                                        <button
                                            key={`dot-${index}`}
                                            onClick={() => handleDotClick(index)}
                                            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
                                            type="button"
                                            aria-label={`Go to slide ${index + 1}`}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full absolute mx-auto flex justify-between items-center gap-5 pt-16 pb-20 px-6 md:px-10">
                        <button
                            onClick={prevSlide}
                            className="text-white text-lg bg-secondary/80 border border-white/30 rounded-full py-2 px-3.5 transition-all duration-300 ease-in-out hover:bg-btnColor backdrop-blur-md shadow-lg"
                            type="button"
                            aria-label="Previous image"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="text-white text-lg bg-secondary/80 border border-white/30 rounded-full py-2 px-3.5 transition-all duration-300 ease-in-out hover:bg-btnColor backdrop-blur-md shadow-lg"
                            type="button"
                            aria-label="Next image"
                        >
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlidesShow;

