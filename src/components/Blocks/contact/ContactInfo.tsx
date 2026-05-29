import { useEffect, useRef, useState } from "react";
import type { ApiData, DataGeneral, SectionsHomeAbout, SocialMedia } from "@/interfaces/dbData";
import UseTextHidden from "@/hook/UseTextHidden";

interface ContactInfoProps {
    dataGeneral: DataGeneral;
    dataBlocks: SectionsHomeAbout[];
    dataRedes: SocialMedia[];
    data: ApiData;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ dataGeneral, dataBlocks, dataRedes, data }) => {
    const [isVisible, setIsVisible] = useState({
        left: false,
        right: false,
        up: false,
        down: false
    });

    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const upRef = useRef<HTMLDivElement>(null);
    const downRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observers = [];

        // Observer for left section
        const leftObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, left: true }));
                        leftObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        // Observer for right section
        const rightObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, right: true }));
                        rightObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        // Observer for up animation
        const upObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, up: true }));
                        upObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        // Observer for down animation
        const downObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, down: true }));
                        downObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (leftRef.current) leftObserver.observe(leftRef.current);
        if (rightRef.current) rightObserver.observe(rightRef.current);
        if (upRef.current) upObserver.observe(upRef.current);
        if (downRef.current) downObserver.observe(downRef.current);

        return () => {
            leftObserver.disconnect();
            rightObserver.disconnect();
            upObserver.disconnect();
            downObserver.disconnect();
        };
    }, []);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
                {/* Left Column - Contact Information (Fade Left) */}
                <div
                    ref={leftRef}
                    className={`flex flex-col justify-center space-y-8 transition-all duration-1000 ease-out transform ${isVisible.left
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-12"
                        }`}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center">
                        <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full animate-pulse">
                            <UseTextHidden text={"📞 Get in Touch"} />
                        </span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {data.slogan[1]}
                    </h1>

                    <p className="text-gray-600 text-lg leading-relaxed">
                        {dataBlocks[4]?.text}
                    </p>

                    <div className="space-y-6">
                        {/* Address - Fade Down */}
                        <div
                            ref={downRef}
                            className={`flex items-start space-x-4 group transition-all duration-700 delay-300 ease-out transform ${isVisible.down
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-8"
                                }`}
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider"><UseTextHidden text="Address" /></h3>
                                <p className="text-gray-900 text-lg font-medium mt-1">{data.dataGeneral.location[0]?.city}</p>
                            </div>
                        </div>

                        {/* Phones - Fade Up */}
                        {dataGeneral.phones && dataGeneral.phones.map((phone, idx) => (
                            <div
                                key={phone.number + idx}
                                ref={idx === 0 ? upRef : undefined}
                                className={`flex items-start space-x-4 group transition-all duration-700 delay-500 ease-out transform ${isVisible.up
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 -translate-y-8"
                                    }`}
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider"><UseTextHidden text="Phone" /></h3>
                                    <p className="text-gray-900 text-lg font-medium mt-1">
                                        {phone.number}
                                        <span className="text-gray-500 text-sm ml-2">{phone.title}</span>
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Emails - Fade Down */}
                        {dataGeneral.emails && dataGeneral.emails.map((email, idx) => (
                            <div
                                key={email.email + idx}
                                className={`flex items-start space-x-4 group transition-all duration-700 delay-700 ease-out transform ${isVisible.down
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                    }`}
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider"><UseTextHidden text="Email" /></h3>
                                    <p className="text-gray-900 text-lg font-medium mt-1">
                                        {email.email}
                                        <span className="text-gray-500 text-sm ml-2">{email.title}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button - Fade Up */}
                    <button
                        className={`mt-4 px-8 py-4 bg-gradient-to-r from-primary to-tertiary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full lg:w-auto ${isVisible.up
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                        style={{ transitionDelay: '900ms' }}
                        type="button"
                        onClick={() => {
                            const el = document.getElementById('contact-form-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <UseTextHidden text="Get a Free Quote →" />
                    </button>
                </div>

                {/* Right Column - Social Media (Fade Right) */}
                <div
                    ref={rightRef}
                    className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-1000 ease-out transform ${isVisible.right
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-12"
                        }`}
                >
                    <div className="bg-gradient-to-r from-secondary to-primary px-6 py-4">
                        <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <UseTextHidden text="Connect With Us" />
                        </h2>
                        <p className="text-white/80 text-sm mt-1"><UseTextHidden text="Follow us on social media" /></p>
                    </div>

                    <div className="p-6">
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                            {dataRedes.length > 0 && dataRedes.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    aria-label={`Visit ${item.name}`}
                                >
                                    <div className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="relative mb-4">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                                            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 border-2 border-gray-100 group-hover:border-primary/30">
                                                <i className={`fa-brands fa-${item.icon} text-3xl group-hover:text-primary transition-colors duration-300 text-secondary`}></i>
                                            </div>
                                        </div>
                                        <span className="text-gray-700 font-semibold capitalize group-hover:text-primary transition-colors duration-300">
                                            <UseTextHidden text={item.name} />
                                        </span>
                                        <span className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <UseTextHidden text="Follow →" />
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;