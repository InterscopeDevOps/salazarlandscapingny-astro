import { useEffect, useRef, useState } from "react";
import type { ApiData, Phone, SectionsHomeAbout } from "@/interfaces/dbData";

interface ValuesContentProps {
    dataGlobal: ApiData;
    homeSection: SectionsHomeAbout[];
    dataPhone: Phone[];
}

const ValuesContent: React.FC<ValuesContentProps> = ({ dataGlobal, homeSection, dataPhone }) => {
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
                threshold: 0.2,
                rootMargin: "0px 0px -70px 0px",
            },
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    const slogan = dataGlobal?.slogan?.[0] || "Building Trust, One Design at a Time";
    const testimonialSource = dataGlobal?.valuesContent?.whychooseUs || "";
    const testimonialText = testimonialSource.length > 170 ? `${testimonialSource.slice(0, 170)}...` : testimonialSource;
    const revealBase = "transform-gpu transition-all ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform";
    const sectionReveal = isVisible ? `${revealBase} translate-y-0 opacity-100` : `${revealBase} translate-y-10 opacity-0`;
    const imageReveal = isVisible ? `${revealBase} translate-x-0 opacity-100 delay-100` : `${revealBase} -translate-x-8 opacity-0`;
    const contentReveal = isVisible ? `${revealBase} translate-x-0 opacity-100 delay-150` : `${revealBase} translate-x-8 opacity-0`;

    const cards = [
        {
            icon: "fa-regular fa-drafting-compass",
            title: "Mission",
            text: dataGlobal?.valuesContent?.mission,
        },
        {
            icon: "fa-regular fa-helmet-safety",
            title: "Vision",
            text: dataGlobal?.valuesContent?.vision,
        },
        {
            icon: "fa-regular fa-seedling",
            title: "Why Choose Us",
            text: dataGlobal?.valuesContent?.whychooseUs,
        },
    ];

    return (
        <section ref={sectionRef} className="py-16 md:py-24">
            <div className={`w-11/12 md:w-7xl mx-auto rounded-[1.8rem] bg-[#0b0d11] p-4 md:p-8 lg:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.35)] ${sectionReveal}`}>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
                    <div className={`relative overflow-hidden rounded-[1.25rem] min-h-[420px] md:min-h-[620px] ${imageReveal}`}>
                        <img
                            src={dataGlobal?.valuesContent?.additionalImages?.[0] || "/assets/images/stockWeb/PlaceholderBlur.webp"}
                            alt="Why choose us"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"></div>
                    </div>

                    <div className={`text-white ${contentReveal}`}>
                        <p className="md:text-3xl uppercase font-bold text-md">Our Values</p>

                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-10">
                            {cards.map((card, index) => (
                                <article
                                    key={`${card.title}-${index}`}
                                    className={`rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5 ${index === 2 ? "sm:col-span-2" : ""} ${revealBase} ${isVisible ? `translate-y-0 opacity-100 ${index === 0 ? "duration-[700ms] delay-200" : index === 1 ? "duration-[950ms] delay-300" : "duration-[1200ms] delay-[400ms]"}` : "translate-y-8 opacity-0 duration-500"}`}
                                >
                                    <div className="h-12 w-12 rounded-full bg-primary/85 text-white flex items-center justify-center text-xl">
                                        <i className={card.icon}></i>
                                    </div>

                                    <h4 className="pt-5 text-3xl md:text-[2rem] font-semibold leading-[1.05]">{card.title}</h4>
                                    <p className="pt-3 text-sm md:text-base leading-relaxed text-white/70">{card.text}</p>
                                    <a
                                        href={dataPhone?.[0]?.number ? `tel:+1${dataPhone[0].number}` : "/contact"}
                                        className="inline-flex items-center gap-2 pt-4 text-base text-secondary hover:text-secondary/80 transition-colors"
                                    >
                                        Learn More <i className="fa-regular fa-arrow-right"></i>
                                    </a>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ValuesContent;