import React, { useEffect, useRef, useState } from 'react';
import type { DataGeneral, Service } from "@/interfaces/dbData";
import { motion } from 'framer-motion';
import LazyImage from '../LazyImage';
import EliminarCaracteresEspeciales from '@/hook/EliminarCaracteresEspeciales';

interface SliderServicesProps {
    dbServices: Service[];
    landingServices: boolean;
    slidesPerView?: number;
    slidesPerViewMobile?: number; // Aquí agregamos esta prop
    onePage?: boolean;
    dataGeneral?: DataGeneral;
    logoCompany: string;
}

interface ServiceCardProps {
    service: Service;
    logoCompany: string;
    onePage?: boolean;
    dataGeneral?: DataGeneral;
    landingServices: boolean;
    isCompact?: boolean;
}

const getServiceHref = (service: Service, onePage?: boolean, dataGeneral?: DataGeneral, landingServices?: boolean) => {
    if (onePage) {
        return `tel:${dataGeneral?.phones[0].number}`;
    }

    return landingServices ? `/services/${EliminarCaracteresEspeciales(service.title)}` : '/services';
};

const getServiceExcerpt = (service: Service) => {
    const text = service?.description?.[0]?.text || '';
    if (text.length <= 110) {
        return text;
    }

    return `${text.slice(0, 107)}...`;
};

const containerMotion = {
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.65 },
};

const ServiceCard: React.FC<ServiceCardProps> = ({
    service,
    logoCompany,
    onePage,
    dataGeneral,
    landingServices,
    isCompact = false,
}) => {
    const href = getServiceHref(service, onePage, dataGeneral, landingServices);
    const excerpt = getServiceExcerpt(service);
    const serviceImage = service?.description?.[0]?.image;
    const category = service?.subtitle?.trim() || 'Featured Service';

    return (
        <motion.article
            {...containerMotion}
            whileHover={{ y: -10, scale: 1.01, boxShadow: '0 36px 90px rgba(3, 8, 20, 0.38)' }}
            className={`group relative overflow-hidden rounded-[2rem] border border-primary/60 bg-secondary  ${isCompact ? 'h-[620px]' : 'h-[650px] lg:h-[680px]'}`}
        >
            <div className="relative h-full">
                <LazyImage
                    alt={service.title}
                    src={serviceImage}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/55"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-secondary/30"></div>

                <motion.div
                    initial={{ opacity: 0, y: -14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className="absolute right-5 top-5"
                >
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/18 px-3 py-2 text-white shadow-lg backdrop-blur-md">
                        <div className="flex h-16  items-center justify-center overflow-hidden rounded-full bg-white/95 p-1">
                            <LazyImage
                                alt="Logo"
                                src={logoCompany}
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.58, delay: 0.16 }}
                    className={`absolute inset-x-5 bottom-5 rounded-[1.6rem] border border-white/10 bg-black/60 shadow-[0_10px_30px_rgba(2,6,23,0.34)] backdrop-blur-xl ${isCompact ? 'p-6' : 'p-7'}`}
                >
                    <p className="mb-3 text-[1.05rem] font-medium leading-none text-white/90">
                        {category}
                    </p>
                    <h2
                        className={`font-extrabold capitalize leading-[1.1] text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden ${isCompact ? 'text-[2.05rem]' : 'text-[2.2rem] lg:text-2xl'}`}
                    >
                        {service.title}
                    </h2>

                    {
                        !onePage && (
                            <p className="mt-4 min-h-[112px] text-[1.03rem] leading-8 text-white/90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                                {excerpt}
                            </p>
                        )
                    }

                    <motion.a
                        href={href}
                        aria-label={onePage ? `Call about ${service.title}` : `Learn more about ${service.title}`}
                        className="group/cta mt-6 inline-flex items-center gap-3 rounded-full bg-btnColor px-8 py-4 text-lg font-extrabold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-btnHover"
                        whileHover={{ y: -4, scale: 1.02, boxShadow: '0 18px 45px rgba(0, 180, 232, 0.35)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>{onePage ? 'Call Now' : 'Learn More'}</span>
                        <i className={`text-base transition-transform duration-300 group-hover/cta:translate-x-1 ${onePage ? 'fa-solid fa-phone' : 'fa-solid fa-arrow-right'}`}></i>
                    </motion.a>
                </motion.div>
            </div>
        </motion.article>
    );
};

const SliderServices: React.FC<SliderServicesProps> = ({ dbServices, landingServices, slidesPerView, slidesPerViewMobile, logoCompany, onePage, dataGeneral }) => {
    const [startIndex, setStartIndex] = useState(0);
    const [desktopSlides, setDesktopSlides] = useState(2);
    const [isMobileView, setIsMobileView] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const baseDesktopSlides = slidesPerView || 2;
    const baseMobileSlides = slidesPerViewMobile || 1;

    useEffect(() => {
        const updateDesktopSlides = () => {
            const mobileView = window.innerWidth < 768;
            setIsMobileView(mobileView);

            if (window.innerWidth >= 1536) {
                setDesktopSlides(3);
                return;
            }

            setDesktopSlides(baseDesktopSlides);
        };

        updateDesktopSlides();
        window.addEventListener('resize', updateDesktopSlides);

        return () => {
            window.removeEventListener('resize', updateDesktopSlides);
        };
    }, [baseDesktopSlides]);

    const visibleDesktopSlides = Math.min(desktopSlides, Math.max(dbServices.length, 1));
    const visibleMobileSlides = Math.min(baseMobileSlides, Math.max(dbServices.length, 1));
    const activeVisibleSlides = isMobileView ? visibleMobileSlides : visibleDesktopSlides;
    const maxDesktopStart = Math.max(dbServices.length - visibleDesktopSlides, 0);
    const maxMobileStart = Math.max(dbServices.length - visibleMobileSlides, 0);
    const activeMaxStart = isMobileView ? maxMobileStart : maxDesktopStart;

    const nextSlide = () => {
        setStartIndex((prevIndex) => (prevIndex >= activeMaxStart ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setStartIndex((prevIndex) => (prevIndex === 0 ? activeMaxStart : prevIndex - 1));
    };

    useEffect(() => {
        setStartIndex((prevIndex) => Math.min(prevIndex, Math.max(dbServices.length - activeVisibleSlides, 0)));
    }, [activeVisibleSlides, dbServices.length]);

    return (
        <motion.div
            ref={sliderRef}
            {...containerMotion}
            className="relative mx-auto w-full overflow-hidden py-4 md:py-6"
        >
            <div className={`hidden md:grid gap-7 py-5 transition-transform duration-500 ease-in-out ${visibleDesktopSlides === 3 ? '2xl:grid-cols-3 md:grid-cols-2' : 'md:grid-cols-2'}`}>
                {
                    dbServices.slice(startIndex, startIndex + visibleDesktopSlides).map((service, index) => (
                        <motion.div
                            key={`${service._id}-${index}`}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            style={{ transformOrigin: 'center center' }}
                        >
                            <ServiceCard
                                service={service}
                                logoCompany={logoCompany}
                                onePage={onePage}
                                dataGeneral={dataGeneral}
                                landingServices={landingServices}
                            />
                        </motion.div>
                    ))
                }
            </div>
            <div className="md:hidden flex justify-center transition-transform duration-500 ease-in-out py-5">
                {
                    dbServices.slice(Math.min(startIndex, maxMobileStart), Math.min(startIndex, maxMobileStart) + visibleMobileSlides).map((service, index) => (
                        <motion.div
                            key={`${service._id}-${index}`}
                            className={`w-full transform ${index === startIndex ? 'animate-slide-in-right transition-transform delay-300 ' : 'animate-none'}`}
                            style={{ transformOrigin: 'center center' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ServiceCard
                                service={service}
                                logoCompany={logoCompany}
                                onePage={onePage}
                                dataGeneral={dataGeneral}
                                landingServices={landingServices}
                                isCompact
                            />
                        </motion.div>
                    ))
                }
            </div>

            <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: 0.14 }}
                className='absolute right-0 top-0 z-20 flex w-full justify-end gap-2 text-white md:pr-0'
            >
                <motion.button
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary"
                    onClick={prevSlide}
                    aria-label="Previous service"
                    whileHover={{ y: -5, scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </motion.button>
                <motion.button
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary"
                    onClick={nextSlide}
                    aria-label="Next service"
                    whileHover={{ y: -5, scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </motion.button>
            </motion.div>

        </motion.div>
    );
}

export default SliderServices;
