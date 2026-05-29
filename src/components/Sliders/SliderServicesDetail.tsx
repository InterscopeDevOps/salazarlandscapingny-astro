import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from "swiper/modules";



// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import type { Service } from '@/interfaces/dbData';
import LazyImage from '../LazyImage';
import EliminarCaracteresEspeciales from '@/hook/EliminarCaracteresEspeciales';

interface SliderServicesDetailProps {
    dataServices: Service[];
    logoCompany: string;
}


const SliderServicesDetail: React.FC<SliderServicesDetailProps> = ({ dataServices }) => {
    // Íconos FontAwesome para cada card
    const icons = [
        <span key="icon1" className="bg-primary/10 rounded-lg p-3 text-3xl text-primary">
            <i className="fa-solid fa-chart-line"></i>
        </span>,
        <span key="icon2" className="bg-secondary/10 rounded-lg p-3 text-3xl text-secondary">
            <i className="fa-solid fa-lightbulb"></i>
        </span>,
        <span key="icon3" className="bg-primary/10 rounded-lg p-3 text-3xl text-primary">
            <i className="fa-solid fa-scale-balanced"></i>
        </span>
    ];
        return (
            <section className="w-full flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 mt-2 text-gray-900">More Service</h2>
                <div className="w-full max-w-7xl px-4">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={32}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                    >
                        {dataServices.slice(0, 10).map((service, idx) => (
                            <SwiperSlide key={service.title}>
                                <div
                                    className={`flex-1 min-w-[260px] max-w-[400px] rounded-2xl px-8 py-8 transition-all flex flex-col items-start justify-between m-2 shadow-xl ${idx % 3 === 1 ? 'bg-primary text-white' : 'bg-[#F1F8FB] text-gray-900'}`}
                                    style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
                                >
                                    <div className="mb-4">{icons[idx % icons.length]}</div>
                                    <h3 className={`text-2xl font-bold mb-3 ${idx % 3 === 1 ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
                                    <p className={`text-base mb-6 ${idx % 3 === 1 ? 'text-white/90' : 'text-gray-600'}`}>{service.description?.[0]?.text?.slice(0, 120) || ''}</p>
                                    <a
                                        href={`/services/${EliminarCaracteresEspeciales(service.title)}`}
                                        className={`mt-auto font-bold flex items-center gap-2 text-lg ${idx % 3 === 1 ? 'text-[#ffffff] hover:text-white' : 'text-primary hover:text-secondary'} transition-colors`}
                                        aria-label={`Read more about ${service.title}`}
                                    >
                                        Read More <i className="fa-solid fa-arrow-down-left"></i>
                                    </a>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        );
}

export default SliderServicesDetail;