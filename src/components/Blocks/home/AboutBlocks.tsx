import { useEffect, useRef, useState } from "react";
import LazyImage from "@/components/LazyImage";
import ButtonContent_2 from "@/components/button/ButtonContent_2";
import UseTextHidden from "@/hook/UseTextHidden";
import type { ApiData, SectionsHomeAbout } from "@/interfaces/dbData";

interface AboutBlocksProps {
    dataGlobal: ApiData;
}

type RevealVariant = "fade" | "left" | "right" | "top" | "bottom" | "zoom";

interface RevealConfig {
    variant: RevealVariant;
    options?: IntersectionObserverInit;
    durationClass?: string;
    delayClass?: string;
}

const hiddenVariants: Record<RevealVariant, string> = {
    fade: "opacity-0",
    left: "opacity-0 -translate-x-10",
    right: "opacity-0 translate-x-10",
    top: "opacity-0 -translate-y-10",
    bottom: "opacity-0 translate-y-10",
    zoom: "opacity-0 scale-95",
};

const visibleVariants: Record<RevealVariant, string> = {
    fade: "opacity-100",
    left: "opacity-100 translate-x-0",
    right: "opacity-100 translate-x-0",
    top: "opacity-100 translate-y-0",
    bottom: "opacity-100 translate-y-0",
    zoom: "opacity-100 scale-100",
};

const useRevealOnIntersect = ({
    variant,
    options,
    durationClass = "duration-[1400ms]",
    delayClass = "delay-0",
}: RevealConfig) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const target = ref.current;
        if (!target || isVisible) return;

        const observer = new IntersectionObserver(
            ([entry], currentObserver) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    currentObserver.unobserve(entry.target);
                }
            },
            {
                threshold: 0.2,
                rootMargin: "0px 0px -60px 0px",
                ...options,
            },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [isVisible, options]);

    const classes = [
        "transition-all ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        durationClass,
        delayClass,
        isVisible ? visibleVariants[variant] : hiddenVariants[variant],
    ].join(" ");

    return { ref, classes, isVisible };
};

const AboutBlocks: React.FC<AboutBlocksProps> = ({ dataGlobal }) => {
    //filtrar para obtener la section de home
    const aboutSection = dataGlobal?.sectionsHomeAbout.filter(
        (section: SectionsHomeAbout) => section.section === "about",
    );

    const aboutData = aboutSection?.[0];

    const titleReveal = useRevealOnIntersect({ variant: "fade", durationClass: "duration-[1200ms]", delayClass: "delay-75" });
    const textReveal = useRevealOnIntersect({ variant: "fade", durationClass: "duration-[1800ms]", delayClass: "delay-150" });
    const listReveal = useRevealOnIntersect({ variant: "bottom", durationClass: "duration-[2100ms]", delayClass: "delay-300" });
    const ctaReveal = useRevealOnIntersect({ variant: "zoom", durationClass: "duration-[2400ms]", delayClass: "delay-500" });
    const cardReveal = useRevealOnIntersect({ variant: "top", durationClass: "duration-[1700ms]", delayClass: "delay-100" });
    const firstImageReveal = useRevealOnIntersect({ variant: "right", durationClass: "duration-[1900ms]", delayClass: "delay-200" });
    const secondImageReveal = useRevealOnIntersect({ variant: "bottom", durationClass: "duration-[2200ms]", delayClass: "delay-300" });
    const thirdImageReveal = useRevealOnIntersect({ variant: "zoom", durationClass: "duration-[2600ms]", delayClass: "delay-500" });

    if (!aboutData) return null;

    return (
        <section className="w-full mx-auto md:w-full h-full flex justify-center items-center relative z-20 overflow-hidden">
        
            <div className="w-[360px] md:w-[440px] h-[360px] md:h-[350px] absolute -top-28 -left-20 bg-primary/75 rounded-full z-10 blur-2xl"></div>
            <div className="absolute right-0 -bottom-20 w-52 h-52 md:w-80 md:h-80 rounded-full bg-secondary/15 blur-3xl z-0"></div>

            <div className="w-11/12 flex flex-col-reverse md:flex-row relative py-10 md:py-5 gap-6 md:gap-0 overflow-hidden">
                <div className="w-full md:w-1/2 px-4 md:px-6 lg:px-8 py-4 md:py-7 z-20">
                    <div className="rounded-[2rem] border border-white/80 bg-white/75 backdrop-blur-md shadow-[0_20px_60px_-32px_rgba(15,23,42,0.45)] px-5 py-7 md:px-8 md:py-10 lg:px-10 lg:py-12">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-primary text-xs md:text-sm font-semibold tracking-wide uppercase">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <UseTextHidden text="About Us" />
                        </div>

                        <div className="pb-8 md:pb-10">
                        <div ref={titleReveal.ref} className={`${titleReveal.classes} overflow-hidden mt-4 md:mt-5`}>
                            <div
                                className={titleReveal.isVisible ? "curtain-reveal" : ""}
                                style={!titleReveal.isVisible ? { clipPath: "inset(0 100% 0 0)" } : undefined}
                            >
                                <h2 className="text-4xl md:text-6xl font-black text-primary lg:text-6xl text-center md:text-start">
                                    {aboutData.title}
                                </h2>
                            </div>
                        </div>

                        <div ref={textReveal.ref} className={textReveal.classes}>
                            <p className="text-center md:text-justify mt-6 text-text/85 leading-relaxed text-[15px] md:text-base">
                                {aboutData.text}
                            </p>
                        </div>
                        </div>

                    <div className="flex flex-col lg:flex-row md:items-start">
                        <div className="w-full lg:w-[60%] pb-8 md:pb-0">
                            <div ref={listReveal.ref} className={listReveal.classes}>
                                <ul className="pb-5">
                                    {aboutData.list.map((item, index) => (
                                        <li
                                            key={index}
                                            className={`flex items-center gap-2 text-primary font-medium py-2 transition-all duration-[1500ms] ease-out ${listReveal.isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
                                            style={{ transitionDelay: `${300 + index * 80}ms` }}
                                        >
                                            <i className="fa-solid fa-check bg-secondary rounded-full text-white p-2 shadow-sm shadow-secondary/30"></i>
                                            <p>{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div
                                ref={ctaReveal.ref}
                                className={`${ctaReveal.classes} text-center md:text-start`}
                            >
                                {
                                    dataGlobal.widgets.onePages ? (
                                        <ButtonContent_2 titleBtn="Contact Us" linkBtn={`tel:+1${dataGlobal.dataGeneral.phones[0].number}`} />
                                    ) : (
                                        <ButtonContent_2 />
                                    )
                                }
                            </div>
                        </div>
                        <div className="w-full lg:w-[40%] h-full flex justify-center items-center">
                            <div className="w-full max-w-[220px] hidden lg:flex items-center justify-center rounded-2xl border border-primary/10 bg-gradient-to-b from-primary/5 to-transparent p-5">
                                <div className="text-center">
                                    <p className="text-sm text-primary/80 font-medium uppercase tracking-widest"><UseTextHidden text="Trusted quality" /></p>
                                    <p className="text-2xl font-black text-primary mt-2"><UseTextHidden text="Since Day One" /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

                <div className="aspect-auto h-[320px] md:h-[820px] lg:h-[700px] r-4 w-full md:w-1/2 flex md:justify-end z-20 justify-center px-0 md:px-0">
                    <div className="w-2/5 flex flex-col justify-center px-2 md:px-3">
                        <div
                            ref={cardReveal.ref}
                            className={`${cardReveal.classes} w-full h-[120px] md:h-1/4 rounded-tr-3xl rounded-bl-2xl mb-4 flex justify-center items-center p-4 md:p-5 shadow-xl border border-white/15 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700`}
                        >
                            <i className="fa-light fa-house text-white text-2xl md:text-6xl"></i>
                            <div className="w-full h-full flex justify-center items-center px-0 pl-2 md:pl-0 md:px-4">
                                <span className="text-white text-xl md:text-4xl font-extrabold"><UseTextHidden text="Best Services" /></span>
                            </div>
                        </div>

                        <div ref={firstImageReveal.ref} className={firstImageReveal.classes}>
                            <LazyImage
                                alt="about us img-1"
                                className="w-full md:h-56 object-cover rounded-2xl border-[6px] border-white shadow-lg"
                                src={aboutData.additionalImages[2]}
                            />
                        </div>
                    </div>

                    <div className="w-[55%]">
                        <div ref={secondImageReveal.ref} className={secondImageReveal.classes}>
                            <LazyImage
                                alt="about us img-1"
                                className="w-full md:h-60 h-44 object-cover border-8 border-white rounded-[1.75rem] shadow-xl"
                                src={aboutData.additionalImages[0]}
                            />
                        </div>

                        <div ref={thirdImageReveal.ref} className={thirdImageReveal.classes}>
                            <LazyImage
                                alt="about us img-2"
                                className="w-full md:h-60 h-44 object-cover border-8 border-white rounded-[1.75rem] mt-5 shadow-xl"
                                src={aboutData.additionalImages[1]}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default AboutBlocks;