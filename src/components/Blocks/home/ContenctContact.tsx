import type { ApiData } from "@/interfaces/dbData"
import EstimatePro from "../contact/EstimatePro";
import LazyImage from "@/components/LazyImage";
import UseTextHidden from "@/hook/UseTextHidden";
import { useEffect, useRef, useState } from "react";


interface ContentContactProps {
    dataGlobal: ApiData;
    bgImage: string;
}

const ContentContact: React.FC<ContentContactProps> = ({ dataGlobal, bgImage }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const primaryEmail = dataGlobal.dataGeneral.emails[0]?.email;
    const primaryPhone = dataGlobal.dataGeneral.phones[0]?.number;
    const services = dataGlobal.services.map((service) => service.title).filter(Boolean);

    return (
        <section id="contact-form-section" ref={sectionRef} className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-black via-slate-950 to-zinc-900">
            <LazyImage
                src={bgImage}
                alt="Contact us"
                className="absolute inset-0 z-0 h-full w-full object-cover opacity-20 mix-blend-screen"
                height={620}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/80 via-black/40 to-black/90"></div>

            <div className="relative z-10 w-11/12 md:w-[82%] xl:w-[78%] mx-auto">
                <div className="grid gap-12 xl:gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                    <div className="relative text-white">
                        <div className={`${isVisible ? 'animate-fade-slide-up' : 'opacity-0'} inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-white/80 px-4 py-2 text-secondary shadow-sm backdrop-blur-md`}>
                            <i className="fa-solid fa-envelopes text-sm"></i>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em]"><UseTextHidden text="Contact Us" /></p>
                        </div>

                        <div className={`${isVisible ? 'animate-fade-slide-up' : 'opacity-0'} mt-6 max-w-3xl rounded-[2rem] border border-white/10 bg-white/8 p-7 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.55)] backdrop-blur-md md:p-10 lg:p-12`}>
                            <p className={`${isVisible ? 'animate-fade-slide-up-delay-1' : 'opacity-0'} text-sm font-semibold uppercase tracking-[0.2em] text-white/70`}><UseTextHidden text="Let's start a conversation" /></p>
                            <h2 className={`${isVisible ? 'animate-fade-slide-up-delay-2' : 'opacity-0'} mt-4 text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl`}>
                                <UseTextHidden text="Get in touch with us" />
                            </h2>
                            <p className={`${isVisible ? 'animate-fade-slide-up-delay-3' : 'opacity-0'} mt-5 max-w-2xl text-base leading-7 text-white/78 md:text-lg lg:text-xl`}>
                                <UseTextHidden text="Tell us what you need and we will help you shape the next step with a clear plan, fast response times, and a clean process." />
                            </p>

                            <div className="mt-9 grid gap-4 sm:grid-cols-2">
                                <div className={`${isVisible ? 'animate-slide-in-left-delay-1' : 'opacity-0'} rounded-2xl border border-white/10 bg-white/8 p-5 shadow-sm`}>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55"><UseTextHidden text="Email" /></p>
                                    <p className="mt-2 break-all text-base font-medium text-white"><UseTextHidden text={primaryEmail ?? "hello@example.com"} /></p>
                                </div>
                                <div className={`${isVisible ? 'animate-slide-in-left-delay-2' : 'opacity-0'} rounded-2xl border border-white/10 bg-white/8 p-5 shadow-sm`}>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55"><UseTextHidden text="Phone" /></p>
                                    <p className="mt-2 text-base font-medium text-white"><UseTextHidden text={primaryPhone ?? "(000) 000-0000"} /></p>
                                </div>
                            </div>
                        </div>



                    </div>

                    <div className={`${isVisible ? 'animate-slide-in-right-delay' : 'opacity-0'} lg:sticky lg:top-24`}>
                        <div className="w-full max-w-[560px] mx-auto rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-[0_28px_90px_-42px_rgba(15,23,42,0.5)] backdrop-blur-md md:p-5 lg:p-6">
                            <EstimatePro
                                recipientEmail={dataGlobal.dataGeneral.emails}
                                companyName={dataGlobal.name}
                                logo={dataGlobal.logos.primary}
                                services={services}
                                data={dataGlobal}
                                embedded
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default ContentContact;