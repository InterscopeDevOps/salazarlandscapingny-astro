import type { ApiData, SectionsHomeAbout, Service } from "@/interfaces/dbData";
import { motion } from 'framer-motion';
import UseTextHidden from "@/hook/UseTextHidden";


import SliderServices from "../../Sliders/SliderServices";

interface ServicesHomeProps {
    dataGlobal: ApiData;
    homeSection: SectionsHomeAbout[];
    landingServices: boolean;
    dbServices: Service[];
}

const getServicesPreview = (text: string) => {
    const firstPointIndex = text.indexOf('.');
    if (firstPointIndex === -1) {
        return text;
    }

    const secondPointIndex = text.indexOf('.', firstPointIndex + 1);
    if (secondPointIndex === -1) {
        return text;
    }

    return text.slice(0, secondPointIndex + 1);
};

const fadeUpProps = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.65 },
};

const ServicesHome: React.FC<ServicesHomeProps> = ({ dataGlobal, homeSection, landingServices, dbServices }) => {
    const servicesSection = homeSection[1];
    const servicesPreview = getServicesPreview(servicesSection?.text || '');

    return (
        <section className="w-full mx-auto py-20 md:pb-32">
            <div className="w-[90%] xl:w-7xl mx-auto rounded-[2rem] border border-primary/10 bg-white px-6 py-10 shadow-[0_25px_80px_rgba(1,86,107,0.08)] md:px-10">
                <div className="flex flex-col gap-10 border-b border-primary/10 pb-10 md:flex-row md:items-start md:justify-between">
                    <div className="w-full md:w-[48%]">
                        <motion.div
                            {...fadeUpProps}
                            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 14px 34px rgba(76, 29, 149, 0.12)' }}
                            className="mb-5 inline-flex items-center gap-4 rounded-full border border-primary/15 bg-primary/5 px-5 py-3 transition-colors duration-300 hover:border-secondary/25 hover:bg-secondary/5"
                        >
                        {/* <PiTreeFill className="text-4xl text-primary" /> */}
                            <i className="fa-solid fa-house-chimney text-2xl text-primary"></i>
                            <span className="text-base font-semibold text-primary capitalize md:text-lg">
                                {dataGlobal.name}
                            </span>
                        </motion.div>
                        <motion.h2
                            {...fadeUpProps}
                            transition={{ ...fadeUpProps.transition, delay: 0.08 }}
                            whileHover={{ x: 6 }}
                            className="max-w-2xl text-center text-3xl font-bold capitalize leading-[1.05] text-primary transition-colors duration-300 hover:text-secondary md:text-start md:text-5xl"
                        >
                            {servicesSection?.title}
                        </motion.h2>
                    </div>
                    <div className="w-full md:w-[44%] md:pt-3">
                        <motion.p
                            {...fadeUpProps}
                            transition={{ ...fadeUpProps.transition, delay: 0.14 }}
                            whileHover={{ y: -2 }}
                            className="text-center text-base leading-8 text-slate-700 transition-colors duration-300 hover:text-slate-900 md:text-left md:text-lg"
                        >
                            {servicesPreview}
                        </motion.p>

                        {
                            !dataGlobal.widgets.onePages && (
                                <motion.div
                                    {...fadeUpProps}
                                    transition={{ ...fadeUpProps.transition, delay: 0.2 }}
                                    className="mt-6 flex items-center justify-center md:justify-start"
                                >
                                    <motion.a
                                        href="/services"
                                        className="group inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary"
                                        aria-label="see all the services we provide"
                                        whileHover={{ y: -6, scale: 1.02, boxShadow: '0 18px 45px rgba(168, 25, 214, 0.28)' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span><UseTextHidden text="See all services" /></span>
                                        <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
                                    </motion.a>
                                </motion.div>
                            )
                        }
                    </div>
                </div>

                <motion.div
                    {...fadeUpProps}
                    transition={{ ...fadeUpProps.transition, delay: 0.24 }}
                    className="pt-10"
                >
                    <SliderServices dbServices={dbServices} logoCompany={dataGlobal.logos.primary} landingServices={landingServices} onePage={dataGlobal.widgets.onePages} dataGeneral={dataGlobal.dataGeneral} />
                </motion.div>
            </div>
        </section>
    );
}
export default ServicesHome;