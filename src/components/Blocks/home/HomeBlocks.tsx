import ButtonContent_2 from "@/components/button/ButtonContent_2";
import type { ApiData, Phone, SectionsHomeAbout } from "@/interfaces/dbData";
import UseTextHidden from "@/hook/UseTextHidden";
import { useEffect, useRef, useState } from "react";

interface HomeBlocksProps {
    homeSection: SectionsHomeAbout[];
    dataPhone: Phone[];
    onePages: boolean;
    dataGeneral: ApiData;
}

const HomeBlocks: React.FC<HomeBlocksProps> = ({ homeSection, dataPhone, onePages, dataGeneral }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full relative overflow-hidden" ref={containerRef}>
            {/* Fondo decorativo */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}></div>
                <div className={`absolute bottom-0 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}></div>
            </div>

            <div className="relative w-full mx-auto flex flex-col-reverse md:flex-row gap-8 md:gap-12 py-16 md:py-32 px-4 md:px-12 lg:px-16 items-center">
                
                {/* SECCIÓN IZQUIERDA - CONTENIDO */}
                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
                    {/* Badge de experiencia */}
                    <div className={`inline-flex items-center gap-3 w-fit transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <i className="fa-regular fa-helmet-safety text-primary text-lg"></i>
                        </div>
                        <p className="text-tertiary font-semibold text-sm">
                            <UseTextHidden text={`${dataGeneral.yearsExperience}+ Years of Excellence`} />
                        </p>
                    </div>

                    {/* Título principal */}
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent leading-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        {homeSection[0].title}
                    </h2>

                    {/* Descripción */}
                    <p className={`text-gray-600 text-lg leading-relaxed max-w-lg transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        {homeSection[0].text}
                    </p>

                    {/* CTA Button con efecto hover */}
                    <div className={`pt-2 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        {
                            onePages ? (
                                <ButtonContent_2 titleBtn="Contact Us" linkBtn={`tel:+1${dataPhone[0].number}`} />
                            ) : (
                                <ButtonContent_2 />
                            )
                        }
                    </div>

                    {/* Stats mini */}
                    <div className={`flex gap-8 pt-4 border-t border-gray-200 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <div className="group cursor-default">
                            <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">100%</p>
                            <p className="text-sm text-gray-600"><UseTextHidden text="Professional Team" /></p>
                        </div>
                        <div className="group cursor-default">
                            <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">500+</p>
                            <p className="text-sm text-gray-600"><UseTextHidden text="Projects Completed" /></p>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN DERECHA - IMÁGENES */}
                <div className="w-full md:w-1/2 relative h-[500px] md:h-[600px]">
                    <div className="relative w-full h-full">
                        
                        {/* Círculo decorativo con degradado */}
                        <div className={`absolute -top-20 -right-20 w-80 h-80 border-2 border-primary/30 rounded-full animate-spin-slow transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                        <div className={`absolute -top-16 -right-16 w-64 h-64 border-2 border-primary/20 rounded-full transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>

                        {/* Imagen principal - izquierda */}
                        <div className={`absolute left-0 top-0 w-[55%] h-[70%] rounded-3xl overflow-hidden shadow-2xl group transition-all duration-700 ${isVisible ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 -translate-x-10'}`}>
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{
                                    backgroundImage: `url("${homeSection[0].additionalImages[0]}")`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Imagen secundaria - derecha */}
                        <div className={`absolute right-0 bottom-12 w-[50%] h-[60%] rounded-3xl overflow-hidden shadow-2xl group transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-10'}`}>
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{
                                    backgroundImage: `url("${homeSection[0].additionalImages[1]}")`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Tarjeta flotante 1 - Superior */}
                        <div className={`absolute -bottom-6 left-0 md:left-8 w-72 p-6 bg-white rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-100 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-6'} hover:shadow-3xl hover:-translate-y-2 group cursor-default`}>
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-screwdriver-wrench text-primary text-2xl"></i>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 capitalize"><UseTextHidden text="Best Quality Services" /></p>
                                    <p className="text-xs text-gray-500"><UseTextHidden text="Certified & Experienced" /></p>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta flotante 2 - Inferior */}
                        <div className={`absolute bottom-24 md:bottom-40 -right-10 md:right-0 w-72 p-6 bg-white rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-100 hidden md:block transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-6'} hover:shadow-3xl hover:translate-y-2 group cursor-default`}>
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i className="fa-regular fa-medal text-secondary text-2xl"></i>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 capitalize"><UseTextHidden text="Professional Team" /></p>
                                    <p className="text-xs text-gray-500"><UseTextHidden text="Highly Skilled" /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animaciones y estilos */}
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                .delay-100 {
                    transition-delay: 100ms;
                }
                .delay-200 {
                    transition-delay: 200ms;
                }
                .delay-300 {
                    transition-delay: 300ms;
                }
                .delay-400 {
                    transition-delay: 400ms;
                }
                .delay-500 {
                    transition-delay: 500ms;
                }
                .delay-700 {
                    transition-delay: 700ms;
                }
            `}</style>
        </div>
    );
}

export default HomeBlocks;