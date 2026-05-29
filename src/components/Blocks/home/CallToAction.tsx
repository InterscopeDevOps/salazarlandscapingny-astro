import LazyImage from "@/components/LazyImage";
import type { Email, Phone, SectionsHomeAbout } from "@/interfaces/dbData";
import UseTextHidden from "@/hook/UseTextHidden";
import { useEffect, useRef, useState } from "react";

interface CallToActionProps {
    homeSection: SectionsHomeAbout[];
    nameCompany: string;
    dataPhone: Phone[];
    dataEmail: Email[];

}

const CallToAction: React.FC<CallToActionProps> = ({ homeSection, dataEmail, dataPhone }) => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = sectionRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.25,
                rootMargin: "0px 0px -10% 0px",
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={sectionRef}
            className="relative bg-cover bg-center w-full h-full py-20 md:py-28 flex justify-center items-center overflow-hidden"
        >
            <div className="absolute top-0 w-full h-full bg-black/50 z-10" />
            <img
                src={homeSection?.[1]?.additionalImages?.[1]}
                alt="Background"
                className={`absolute inset-0 w-full h-full object-cover ${isInView ? "animate-fade-in-out" : ""}`}
            />
            <div className="w-11/12 md:w-[88%] mx-auto relative z-10">
                <div className="w-full rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md shadow-2xl flex flex-col-reverse md:flex-row gap-6 md:gap-10 mt-6 px-5 py-8 md:px-10 md:py-10">
                    <div className="w-full md:w-[50%] h-full flex flex-col items-center md:items-start">
                        <div className="flex gap-5 items-center">

                            <span className={`font-semibold text-white bg-primary/85 border border-white/20 px-6 py-1 text-xl rounded-lg capitalize shadow-lg ${isInView ? "opacity-0 animate-fade-slide-down [animation-delay:120ms] [animation-fill-mode:forwards]" : "opacity-0"}`}>
                                <i className="fa-light fa-helmet-safety pr-2"></i><UseTextHidden text="Contact Us" />
                            </span>
                        </div>
                        <h3 className={`text-4xl md:text-6xl capitalize font-bold text-white mt-5 text-center pb-5 md:pb-2 md:text-start leading-tight ${isInView ? "opacity-0 animate-fade-slide-up [animation-delay:280ms] [animation-fill-mode:forwards]" : "opacity-0"}`}>
                            {homeSection?.[1]?.title}
                        </h3>
                        <p className={`text-center md:text-justify pt-0 md:pt-5 pb-8 text-slate-100/95 text-lg leading-relaxed max-w-2xl ${isInView ? "opacity-0 animate-fade-slide-up [animation-delay:460ms] [animation-fill-mode:forwards]" : "opacity-0"}`}>{homeSection?.[1]?.text}</p>

                        <div className={`w-full flex flex-col sm:flex-row gap-3 md:gap-4 ${isInView ? "opacity-0 animate-fade-slide-up [animation-delay:580ms] [animation-fill-mode:forwards]" : "opacity-0"}`}>
                            <a
                                href={`mailto:${dataEmail[0].email}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-semibold px-6 py-3 shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:brightness-110"
                            >
                                <i className="fa-regular fa-envelope"></i>
                                <UseTextHidden text="Send Email" />
                            </a>
                            <a
                                href={`tel:+1${dataPhone[0].number}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 text-white font-semibold px-6 py-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                            >
                                <i className="fa-regular fa-phone"></i>
                                <UseTextHidden text="Call Now" />
                            </a>
                        </div>


                    </div>
                    <div className="w-full md:w-[50%] h-[320px] md:h-[460px] rounded-xl aspect-auto px-0 md:px-2 flex space-x-3 justify-center">
                        <div className={`w-1/2 h-full border border-white/30 rounded-2xl overflow-hidden relative group shadow-xl ${isInView ? "opacity-0 animate-slide-in-left [animation-delay:650ms] [animation-fill-mode:forwards]" : "opacity-0"}`}>
                            <a href={`mailto:${dataEmail[0].email}`} className="w-full h-full relative">
                                <LazyImage
                                    src={homeSection?.[1]?.additionalImages[0]}
                                    alt="Imgen Call to action"
                                    className="w-full h-full object-cover rounded-xl scale-105 group-hover:scale-110 transition-transform ease-out duration-1000 z-10"
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/75 via-black/35 to-black/15"></div>
                                <div className="w-24 md:w-36 h-24 md:h-36 flex justify-center items-center border-tertiary scale-90 group-hover:scale-100 transition-transform ease-out duration-1000 border-4 border-dotted rounded-full absolute top-[28%] left-8 md:left-12 z-30">
                                    <div className="w-4/5 h-4/5 rounded-full bg-tertiary flex justify-center items-center">
                                        <i className="fa-regular fa-envelope text-4xl text-white "></i>
                                    </div>
                                </div>
                                <span className="absolute bottom-4 left-4 right-4 text-center text-white font-semibold tracking-wide bg-black/35 rounded-lg py-2 z-30">
                                    <UseTextHidden text="Email Support" />
                                </span>

                            </a>
                        </div>
                        <div className={`w-1/2 h-full border border-white/30 rounded-2xl overflow-hidden relative group shadow-xl ${isInView ? "opacity-0 animate-slide-in-right [animation-delay:820ms] [animation-fill-mode:forwards]" : "opacity-0"}`}>
                            <a href={`tel:+1${dataPhone[0].number}`} className="w-full h-full relative">
                                <LazyImage
                                    src={homeSection?.[1]?.additionalImages[1]}
                                    alt="Imgen Call to action"
                                    className="w-full h-full object-cover rounded-xl scale-105 group-hover:scale-110 transition-transform ease-out duration-1000 z-10"
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/75 via-black/35 to-black/15"></div>
                                <div className="w-24 md:w-36 h-24 md:h-36 flex justify-center items-center border-tertiary scale-90 group-hover:scale-100 transition-transform ease-out duration-1000 border-4 border-dotted rounded-full absolute top-[28%] left-8 md:left-12 z-30">
                                    <div className="w-4/5 h-4/5 rounded-full bg-tertiary flex justify-center items-center">
                                        <i className="fa-regular fa-phone text-2xl md:text-4xl text-white "></i>
                                    </div>
                                </div>
                                <span className="absolute bottom-4 left-4 right-4 text-center text-white font-semibold tracking-wide bg-black/35 rounded-lg py-2 z-30">
                                    <UseTextHidden text="Direct Call" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CallToAction;