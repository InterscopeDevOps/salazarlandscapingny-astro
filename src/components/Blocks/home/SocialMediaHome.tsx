import ButtonContent from "@/components/button/ButtonContent_2";
import type { ApiData } from "@/interfaces/dbData";
import UseTextHidden from "@/hook/UseTextHidden";
import { useEffect, useRef, useState } from 'react';

function useReveal<T extends HTMLElement>(delay = 0) {
    const ref = useRef<T>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const t = setTimeout(() => setVisible(true), delay);
                    observer.disconnect();
                    return () => clearTimeout(t);
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return [ref, visible] as const;
}

interface SocialMediaHomeProps {
    dataGlobal: ApiData;

}

const iconFallbacks: Record<string, string> = {
    google: 'google',
    'google my business': 'google',
    gmb: 'google',
    facebook: 'facebook-f',
    instagram: 'instagram',
    whatsapp: 'whatsapp',
    vimeo: 'vimeo-v',
    mastodon: 'mastodon',
    mastodonword: 'mastodon',
    yelp: 'yelp',
    angi: 'angellist',
    angiads: 'angellist',
    homeadvisor: 'house',
    houzz: 'houzz',
    thumbtack: 'thumbtack',
    linkedin: 'linkedin-in',
    youtube: 'youtube',
    tiktok: 'tiktok',
    x: 'x-twitter',
    twitter: 'x-twitter'
};

const solidIcons = new Set(['house', 'thumbtack', 'link', 'globe']);

const brandStyles: Record<string, { accent: string; soft: string; ring: string }> = {
    google: { accent: '#4285F4', soft: 'rgba(66,133,244,0.10)', ring: 'rgba(66,133,244,0.24)' },
    'google my business': { accent: '#4285F4', soft: 'rgba(66,133,244,0.10)', ring: 'rgba(66,133,244,0.24)' },
    gmb: { accent: '#4285F4', soft: 'rgba(66,133,244,0.10)', ring: 'rgba(66,133,244,0.24)' },
    facebook: { accent: '#1877F2', soft: 'rgba(24,119,242,0.10)', ring: 'rgba(24,119,242,0.24)' },
    instagram: { accent: '#E4405F', soft: 'rgba(228,64,95,0.10)', ring: 'rgba(228,64,95,0.24)' },
    whatsapp: { accent: '#25D366', soft: 'rgba(37,211,102,0.10)', ring: 'rgba(37,211,102,0.24)' },
    vimeo: { accent: '#1AB7EA', soft: 'rgba(26,183,234,0.12)', ring: 'rgba(26,183,234,0.22)' },
    mastodon: { accent: '#6364FF', soft: 'rgba(99,100,255,0.12)', ring: 'rgba(99,100,255,0.22)' },
    mastodonword: { accent: '#6364FF', soft: 'rgba(99,100,255,0.12)', ring: 'rgba(99,100,255,0.22)' },
    pinterest: { accent: '#E60023', soft: 'rgba(230,0,35,0.10)', ring: 'rgba(230,0,35,0.24)' },
    yelp: { accent: '#FF1A1A', soft: 'rgba(255,26,26,0.10)', ring: 'rgba(255,26,26,0.24)' },
    angi: { accent: '#7C4DFF', soft: 'rgba(124,77,255,0.10)', ring: 'rgba(124,77,255,0.24)' },
    angiads: { accent: '#7C4DFF', soft: 'rgba(124,77,255,0.10)', ring: 'rgba(124,77,255,0.24)' },
    homeadvisor: { accent: '#F15A24', soft: 'rgba(241,90,36,0.10)', ring: 'rgba(241,90,36,0.24)' },
    houzz: { accent: '#4DBC15', soft: 'rgba(77,188,21,0.10)', ring: 'rgba(77,188,21,0.24)' },
    thumbtack: { accent: '#009FD9', soft: 'rgba(0,159,217,0.10)', ring: 'rgba(0,159,217,0.24)' },
    linkedin: { accent: '#0A66C2', soft: 'rgba(10,102,194,0.10)', ring: 'rgba(10,102,194,0.24)' },
    youtube: { accent: '#FF0000', soft: 'rgba(255,0,0,0.10)', ring: 'rgba(255,0,0,0.24)' },
    tiktok: { accent: '#000000', soft: 'rgba(37,244,238,0.12)', ring: 'rgba(254,44,85,0.18)' },
    x: { accent: '#000000', soft: 'rgba(0,0,0,0.08)', ring: 'rgba(0,0,0,0.16)' },
    twitter: { accent: '#000000', soft: 'rgba(29,161,242,0.10)', ring: 'rgba(29,161,242,0.22)' }
};

const resolveIcon = (icon?: string, name?: string) => {
    const normalizedIcon = icon?.trim().toLowerCase();

    if (normalizedIcon) {
        const iconName = normalizedIcon.startsWith('fa-') ? normalizedIcon.slice(3) : normalizedIcon;
        return {
            iconName,
            iconPrefix: solidIcons.has(iconName) ? 'fa-solid' : 'fa-brands'
        };
    }

    const normalizedName = name?.trim().toLowerCase() ?? '';
    const fallbackKey = Object.keys(iconFallbacks).find((key) => normalizedName.includes(key));
    const fallbackIcon = fallbackKey ? iconFallbacks[fallbackKey] : 'globe';

    return {
        iconName: fallbackIcon,
        iconPrefix: solidIcons.has(fallbackIcon) ? 'fa-solid' : 'fa-brands'
    };
};

const resolveBrandStyle = (name: string) => {
    const normalizedName = name.trim().toLowerCase();
    const brandKey = Object.keys(brandStyles).find((key) => normalizedName.includes(key));

    return brandKey
        ? brandStyles[brandKey]
        : { accent: '#250852', soft: 'rgba(37,8,82,0.08)', ring: 'rgba(37,8,82,0.14)' };
};

const SocialLinkCard = ({ name, link, icon, delay = 0 }: { name: string; link: string; icon?: string; delay?: number }) => {
    const { iconName, iconPrefix } = resolveIcon(icon, name);
    const brandStyle = resolveBrandStyle(name);
    const [ref, visible] = useReveal<HTMLAnchorElement>(delay);

    return (
        <a
            ref={ref}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full min-h-[132px] w-full flex-col items-center justify-center rounded-[22px] border bg-white/95 px-4 py-5 text-center shadow-[0_10px_28px_rgba(37,8,82,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(37,8,82,0.12)]"
            style={{
                borderColor: brandStyle.ring,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(22px)',
            }}
            aria-label={`Visit ${name}`}
        >
            <span
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-sm transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: brandStyle.soft, color: brandStyle.accent }}
            >
                <i className={`${iconPrefix} fa-${iconName}`}></i>
            </span>
            <span className="max-w-[16ch] text-base font-semibold leading-snug text-primary sm:text-[1.05rem]"><UseTextHidden text={name} /></span>
        </a>
    );
};

const SocialMediaHome: React.FC<SocialMediaHomeProps> = ({ dataGlobal }) => {

    // Combina los directorios y redes sociales en un solo arreglo
    const combinedArray = [...dataGlobal.directorios, ...dataGlobal.redesSociales];

    const [googleRef, googleVisible] = useReveal<HTMLAnchorElement>(0);
    const [textRef, textVisible] = useReveal<HTMLDivElement>(120);
    const [btnRef, btnVisible] = useReveal<HTMLDivElement>(240);

    return (
        <section className="relative -mt-px py-10 md:py-14">
             
            <div className="mx-auto flex w-11/12 max-w-6xl flex-col gap-7 md:gap-8">
                <div className="grid gap-5 xl:grid-cols-[minmax(210px,240px)_1fr_minmax(200px,220px)] xl:items-center">
                    <a
                        ref={googleRef}
                        href={dataGlobal?.gmb?.length ? dataGlobal?.gmb : '/'}
                        aria-label={dataGlobal?.gmb?.length ? "Google my Business" : "Google my Business not available"}
                        target={dataGlobal?.gmb?.length ? "_blank" : "_self"}
                        rel={dataGlobal?.gmb?.length ? "noopener noreferrer" : undefined}
                        className="group flex min-h-[148px] w-full flex-col items-center justify-center rounded-[24px] border bg-white px-5 py-5 text-center shadow-[0_10px_28px_rgba(37,8,82,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(37,8,82,0.12)]"
                        style={{
                            borderColor: 'rgba(66,133,244,0.22)',
                            opacity: googleVisible ? 1 : 0,
                            transform: googleVisible ? 'translateY(0)' : 'translateY(28px)',
                        }}
                    >
                        <span
                            className="mb-3 flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-sm transition-transform duration-300 group-hover:scale-105"
                            style={{ backgroundColor: 'rgba(66,133,244,0.10)', color: '#4285F4' }}
                        >
                            <i className="fa-brands fa-google"></i>
                        </span>
                        <span className="max-w-[14ch] text-lg font-semibold leading-tight text-primary sm:text-xl"><UseTextHidden text="Google Business Profile" /></span>
                        <span className="mt-2 flex items-center gap-1 text-[0.78rem]" aria-label="5 star rating on Google">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <i key={index} className="fa-solid fa-star" style={{ color: '#FBBC05' }}></i>
                            ))}
                        </span>
                        <span className="mt-1 text-xs font-medium tracking-[0.08em] text-primary/60 uppercase">
                            <UseTextHidden text="Top rated on Google" />
                        </span>
                    </a>

                    <div
                        ref={textRef}
                        className="flex flex-col items-center text-center md:pl-10 xl:items-start xl:text-left transition-all duration-500"
                        style={{
                            opacity: textVisible ? 1 : 0,
                            transform: textVisible ? 'translateY(0)' : 'translateY(22px)',
                        }}
                    >
                        <span className="mb-2 inline-flex rounded-full bg-primary/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70 sm:text-xs">
                            <UseTextHidden text="Reviews and Directories" />
                        </span>
                        <h2 className="max-w-[12ch] text-3xl font-bold capitalize leading-none text-primary sm:text-4xl md:text-5xl">
                            <UseTextHidden text="Find Us On" />
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-primary/70 sm:text-base">
                            <UseTextHidden text="Browse every place where customers can find, follow, and review the business." />
                        </p>
                    </div>

                    <div
                        ref={btnRef}
                        className="flex justify-center xl:justify-end transition-all duration-500"
                        style={{
                            opacity: btnVisible ? 1 : 0,
                            transform: btnVisible ? 'translateY(0)' : 'translateY(18px)',
                        }}
                    >
                        <ButtonContent titleBtn="Write A Review" gmbUrl linkBtn={dataGlobal?.gmb?.length ? dataGlobal?.gmb : '/'} />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {combinedArray.length > 0 && combinedArray.map((item, index) => (
                        <SocialLinkCard key={index} name={item.name} link={item.link} icon={item.icon} delay={index * 60} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default SocialMediaHome;