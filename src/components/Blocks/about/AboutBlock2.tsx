import { useEffect, useRef, useState } from "react";
import LazyImage from "@/components/LazyImage";
import ButtonContent from "@/components/button/ButtonContent_2";

interface AboutBlock2Props {
    title: string;
    text: string;
    image: string;
    bgImages?: string;
    phone?: string;
    nameCompany?: string;
}

const AboutBlock2: React.FC<AboutBlock2Props> = ({ title, text, image, bgImages, phone, nameCompany }) => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section || isVisible) return;

        const observer = new IntersectionObserver(
            ([entry], currentObserver) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    currentObserver.unobserve(entry.target);
                }
            },
            {
                threshold: 0.25,
                rootMargin: "0px 0px -80px 0px",
            },
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    const revealBase = "transform-gpu transition-all ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform";
    const cardReveal = isVisible
        ? `${revealBase} translate-y-0 opacity-100 duration-[900ms]`
        : `${revealBase} translate-y-12 opacity-0 duration-700`;
    const badgeReveal = isVisible
        ? `${revealBase} translate-y-0 opacity-100 duration-[800ms] delay-100`
        : `${revealBase} translate-y-6 opacity-0 duration-700`;
    const titleReveal = isVisible
        ? `${revealBase} translate-y-0 opacity-100 duration-[950ms] delay-150`
        : `${revealBase} translate-y-8 opacity-0 duration-700`;
    const textReveal = isVisible
        ? `${revealBase} translate-y-0 opacity-100 duration-[1050ms] delay-200`
        : `${revealBase} translate-y-8 opacity-0 duration-700`;
    const ctaReveal = isVisible
        ? `${revealBase} translate-y-0 opacity-100 duration-[1100ms] delay-300`
        : `${revealBase} translate-y-8 opacity-0 duration-700`;
    const primaryImageReveal = isVisible
        ? `${revealBase} translate-x-0 translate-y-0 rotate-0 opacity-100 duration-[1200ms] delay-150`
        : `${revealBase} translate-x-10 translate-y-10 rotate-[1.5deg] opacity-0 duration-700`;
    const secondaryImageReveal = isVisible
        ? `${revealBase} translate-x-0 translate-y-0 rotate-0 opacity-100 duration-[1300ms] delay-300`
        : `${revealBase} translate-x-8 translate-y-14 rotate-[-2deg] opacity-0 duration-700`;

    return (
        <section ref={sectionRef} className="relative w-4/5 mx-auto overflow-hidden py-20 md:py-10">
            <div className={`absolute left-0 top-10 h-32 w-32 rounded-full bg-btnColor/10 blur-3xl transition-all duration-[1400ms] ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}></div>
            <div className={`absolute right-0 top-1/4 h-44 w-44 rounded-full bg-primary/10 blur-3xl transition-all duration-[1600ms] delay-200 ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}></div>

            <div className="relative flex flex-col-reverse items-center gap-12 lg:flex-row lg:gap-16">
                <div className="w-full lg:w-[48%]">
                    <div className={`rounded-[2rem] border border-btnColor/15 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-10 ${cardReveal}`}>
                        <div className={`flex flex-col items-center gap-4 pb-5 md:flex-row md:justify-start ${badgeReveal}`}>
                            {nameCompany && (
                                <span className="rounded-full bg-btnColor/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-btnColor">
                                    {nameCompany}
                                </span>
                            )}
                            <div className="h-px w-24 bg-gradient-to-r from-btnColor to-transparent"></div>
                        </div>

                        <h2 className={`text-center text-3xl font-bold leading-tight text-title md:text-start md:text-5xl ${titleReveal}`}>
                            {title}
                        </h2>

                        <p className={`mt-6 border-l-4 border-btnColor/80 pl-5 text-center text-base leading-8 text-text md:pl-6 md:text-start md:text-lg ${textReveal}`}>
                            {text}
                        </p>

                        <div className={`mt-8 flex items-center justify-center gap-4 md:justify-start ${ctaReveal}`}>
                            <div className="hidden h-12 w-12 rounded-full border border-btnColor/20 bg-btnColor/5 md:flex"></div>
                            <div className="flex justify-center md:justify-start">
                                <ButtonContent linkBtn={`${phone ? `tel:+1${phone}` : '/contact'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative w-full lg:w-[52%] lg:pl-4">
                    <div className="absolute inset-x-6 top-10 hidden h-[72%] rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-btnColor/10 to-transparent lg:block"></div>

                    <div className="relative mx-auto flex max-w-[640px] flex-col gap-5 sm:gap-6">
                        <div className={`relative overflow-hidden rounded-[2rem] shadow-[0_24px_70px_rgba(15,23,42,0.18)] ring-1 ring-white/60 ${primaryImageReveal}`}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-btnColor/15"></div>
                            <LazyImage
                                src={image}
                                alt={title}
                                className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
                            />
                        </div>

                        <div className={`relative self-end overflow-hidden rounded-[1.75rem] border-8 border-white bg-white sm:w-[78%] lg:-mt-28 lg:mr-[-1.5rem] lg:w-[68%] ${secondaryImageReveal}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary/10"></div>
                            <LazyImage
                                src={bgImages || "/assets/images/stockWeb/PlaceholderBlur.webp"}
                                alt={title}
                                className="h-[220px] w-full object-cover sm:h-[280px] lg:h-[320px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutBlock2;