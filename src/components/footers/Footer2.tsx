import type { ApiData, SectionsHomeAbout } from "@/interfaces/dbData";
import { RedesIcons } from "../RedesIcons";
import EliminarCaracteresEspeciales from "@/hook/EliminarCaracteresEspeciales";
import UseTextHidden from "@/hook/UseTextHidden";
import React, { useState } from "react";

interface Footer1Props {
    dataGlobal: ApiData;
}

const Footer2: React.FC<Footer1Props> = ({ dataGlobal }) => {

    const [email, setEmail] = useState('');

    const aboutSection = dataGlobal?.sectionsHomeAbout.filter(
        (section: SectionsHomeAbout) => section.section === "about",
    );

    const homeSection = dataGlobal?.sectionsHomeAbout.filter(
        (section: SectionsHomeAbout) => section.section === "home",
    );

    const landingServices = dataGlobal.widgets.landingServices;

    const dataPhone = dataGlobal?.dataGeneral.phones;
    const dataEmail = dataGlobal?.dataGeneral.emails;
    const dataAddress = dataGlobal?.dataGeneral.location;
    const dataOpeningHours = dataGlobal?.dataGeneral.openingHours;

    const reviewsPages = dataGlobal.reviews.stateReviews && dataGlobal.reviews.viewAll;
    const videoPages = dataGlobal.widgets.landingVideos;
    const blogPages = dataGlobal.widgets.blog;
    const onePages = dataGlobal.widgets.onePages;

    const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmail('');
    };

    return (
        <div className="bg-[#0d0d0d]">

            {/* ── Newsletter Banner ── */}
            <div className="w-[80%] mx-auto relative py-10 -mt-32 z-30">
                <div
                    className="relative rounded-3xl overflow-hidden px-6 py-14 flex flex-col items-center text-center">
                    <img src={homeSection[0]?.additionalImages?.[0]} className="absolute top-0 w-full h-full object-cover" />
                

                    {/* dark overlay */}
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 max-w-2xl w-full">
                        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4"><UseTextHidden text="Subscribe Our Newsletter" /></h2>
                        <p className="text-gray-300 mb-8 text-sm md:text-base leading-relaxed">
                            {(() => {
                                const text = aboutSection[0]?.text ?? '';
                                const idx = text.indexOf('.');
                                return idx !== -1 ? text.slice(0, idx + 1) : text;
                            })()}
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mx-auto">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="flex-1 rounded-full px-6 py-3 bg-white/10 border border-white/30 text-white placeholder-gray-400 outline-none focus:border-primary transition"
                            />
                            <button
                                type="submit"
                                className="rounded-full px-8 py-3 bg-white text-black font-bold hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                <UseTextHidden text="Subscribe" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* ── Footer body ── */}
            <div className="w-[80%] mx-auto pt-10 pb-6 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Col 1 – Logo + description + contact */}
                <div className="flex flex-col gap-4">
                    <img
                        src={dataGlobal.logos.secondary}
                        alt="logo"
                        loading="lazy"
                        width={160}
                        height={60}
                        className="h-24 w-auto object-contain"
                    />
            
                    <ul className="flex flex-col gap-3 mt-2">
                        {dataAddress && dataAddress.length > 0 && (
                            <li className="flex items-start gap-2 text-gray-400 text-sm">
                                <i className="fa-solid fa-location-dot mt-0.5 text-secondary" />
                                <span className="capitalize">
                                    {dataAddress.slice(0, 2).map((a, i) => (
                                        <span key={i}>{i > 0 && <span className="mx-1 text-gray-600">|</span>}<UseTextHidden text={a.city} /></span>
                                    ))}
                                </span>
                            </li>
                        )}
                        {dataEmail && dataEmail.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <i className="fa-solid fa-envelope text-secondary" />
                                <a href={`mailto:${item.email}`} className="text-gray-400 hover:text-secondary transition">
                                    <UseTextHidden text={item.email} />
                                </a>
                            </li>
                        ))}
                        {dataPhone && dataPhone.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <i className="fa-solid fa-phone text-secondary" />
                                <a href={`tel:+1${item.number}`} className="text-gray-400 hover:text-secondary transition">
                                    <UseTextHidden text={item.number} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 2 – Quick Links */}
                <div>
                    <h4 className="text-secondary font-bold text-lg mb-5"><UseTextHidden text="Quick Links" /></h4>
                    <ul className="flex flex-col gap-3">
                        <li><a href="/" className="text-gray-400 text-sm hover:text-secondary transition"><UseTextHidden text="Home" /></a></li>
                        <li><a href="/about" className="text-gray-400 text-sm hover:text-secondary transition"><UseTextHidden text="About" /></a></li>
                        <li><a href="/contact" className="text-gray-400 text-sm hover:text-secondary transition"><UseTextHidden text="Contact" /></a></li>
                        {blogPages && (
                            <li><a href="/blog" className="text-gray-400 text-sm hover:text-secondary transition"><UseTextHidden text="Blog" /></a></li>
                        )}
                        {videoPages && (
                            <li><a href="/videos" className="text-gray-400 text-sm hover:text-secondary transition"><UseTextHidden text="Videos" /></a></li>
                        )}
                        {reviewsPages && (
                            <li><a href="/reviews" className="text-gray-400 text-sm hover:text-secondary transition"><UseTextHidden text="Reviews" /></a></li>
                        )}
                    </ul>
                </div>

                {/* Col 3 – Services */}
                <div>
                    <h4 className="text-secondary font-bold text-lg mb-5"><UseTextHidden text="Services" /></h4>
                    <ul className="flex flex-col gap-3">
                        {dataGlobal.services.slice(0, 6).map((service, index) => (
                            <li key={index}>
                                <a
                                    href={
                                        onePages
                                            ? `tel:+1${dataPhone[0]?.number}`
                                            : landingServices
                                                ? `/services/${EliminarCaracteresEspeciales(service.title)}`
                                                : '/services'
                                    }
                                    className="text-gray-400 text-sm capitalize hover:text-secondary transition"
                                    aria-label="service link"
                                >
                                    <UseTextHidden text={service.title} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 4 – Work Days */}
                <div>
                    <h4 className="text-secondary font-bold text-lg mb-5"><UseTextHidden text="Work Days" /></h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                        {(() => {
                            const text = aboutSection[0]?.text ?? '';
                            const idx = text.indexOf('.');
                            return idx !== -1 ? text.slice(0, idx + 1) : text;
                        })()}
                    </p>
                    <ul className="flex flex-col gap-3 mb-6">
                        {dataOpeningHours && dataOpeningHours.slice(0, 3).map((hour, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-400 text-sm">
                                <i className="fa-regular fa-clock text-secondary" />
                                <span><UseTextHidden text={hour.days} />{hour.hours ? `, ${hour.hours}` : ''}</span>
                            </li>
                        ))}
                    </ul>
                    <a
                        href="/contact"
                        className="inline-block rounded-full bg-primary px-7 py-3 text-white font-bold text-sm hover:brightness-110 transition"
                    >
                        <UseTextHidden text="Contact Us" />
                    </a>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className="border-t border-gray-800 w-[80%] mx-auto py-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">
                    <UseTextHidden text={`${dataGlobal?.name} © ${new Date().getFullYear()} All Rights Reserved.`} />
                </p>
                {dataGlobal?.redesSociales.length > 0 && (
                    <RedesIcons redesSociales={dataGlobal?.redesSociales} textColor="text-gray-400" bgColorCustom="bg-transparent" />
                )}
            </div>

        </div>
    );
}
export default Footer2;