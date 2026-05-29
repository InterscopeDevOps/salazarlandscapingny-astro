import { useState, useEffect, useRef } from "react";
import type { ApiData } from "@/interfaces/dbData";

export interface EmblemsProps {
    nameCompany: string;
    data: ApiData;
}

const INTERVAL_MS = 5000;
const BG_TRANSITION_MS = 650;

// Themes use inline-style values so CSS can transition them
const THEMES = [
    {
        gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
        border: "#5a5a5a",
        barBg: "#4a4a4a",
        barFill: "#808080",
        dotActive: "#808080",
        dotInactive: "#404040",
    },
    {
        gradient: "linear-gradient(135deg, #050d1a 0%, #0a1c35 50%, #050d1a 100%)",
        border: "#4a7fbf",
        barBg: "#0d2240",
        barFill: "#4a9eff",
        dotActive: "#4a9eff",
        dotInactive: "#1a3a5c",
    },
    {
        gradient: "linear-gradient(135deg, #1a1400 0%, #2b2000 50%, #1a1400 100%)",
        border: "#d4af37",
        barBg: "#3a2e00",
        barFill: "#f0c040",
        dotActive: "#f0c040",
        dotInactive: "#4a3c00",
    },
];

const SLIDE_CONTENT = (nameCompany: string) => [
    {
        img: "/assets/images/aniversary.png",
        imgAlt: "Anniversary badge",
        eyebrow: "Celebrating Our Journey",
        title: `A Proven Legacy of Quality by ${nameCompany}`,
        description: `At ${nameCompany}, we are proud to celebrate years of trusted service in our community. Our reputation is built on consistency, professionalism, and long-term customer relationships.`,
        tags: ["Trusted Local Team", "Proven Customer Satisfaction", "Google-Verified Reviews"],
        imgWrap: "bg-gray-200 border-[#a0a0a0]",
        eyebrowColor: "text-[#d0d0d0]",
        titleColor: "text-[#f5f5f5]",
        descColor: "text-[#b8b8b8]",
        tagStyle: "bg-[#333333] border-[#666666] text-[#e0e0e0]",
    },
    {
        img: "/assets/images/Satisfaction.png",
        imgAlt: "100% Satisfaction Guaranteed badge",
        eyebrow: "Our Promise to You",
        title: `100% Satisfaction — That's Our Commitment`,
        description: `Every project we take on is backed by a full satisfaction guarantee. ${nameCompany} doesn't consider a job done until you are completely happy with the results — no exceptions.`,
        tags: ["No Compromises", "Client-First Approach", "Quality Assurance"],
        imgWrap: "bg-blue-50/30 border-[#4a7fbf]",
        eyebrowColor: "text-[#7eb8f7]",
        titleColor: "text-[#ddeeff]",
        descColor: "text-[#8aadcc]",
        tagStyle: "bg-[#0a1c35] border-[#4a7fbf] text-[#7eb8f7]",
    },
    {
        img: "/assets/images/22.png",
        imgAlt: "22 Years of Experience badge",
        eyebrow: "Decades of Expertise",
        title: `22 Years of Experience in the Industry`,
        description: `With over two decades serving the community, ${nameCompany} brings unmatched expertise, refined techniques, and deep-rooted knowledge to every landscape and tree project we undertake.`,
        tags: ["Over Two Decades of Service", "Experienced Professionals", "Long-Lasting Results"],
        imgWrap: "bg-yellow-50/40 border-[#d4af37]",
        eyebrowColor: "text-[#f0c040]",
        titleColor: "text-[#f5e9c0]",
        descColor: "text-[#cfc097]",
        tagStyle: "bg-[#2b2000] border-[#d4af37] text-[#f0c040]",
    },
];

const ANIM_CSS = `
@keyframes _emb_fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes _emb_fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
}
._emb_img  { animation: _emb_fadeIn  0.55s cubic-bezier(.22,1,.36,1) 0.05s both; }
._emb_t1   { animation: _emb_fadeUp  0.5s  cubic-bezier(.22,1,.36,1) 0.1s  both; }
._emb_t2   { animation: _emb_fadeUp  0.5s  cubic-bezier(.22,1,.36,1) 0.2s  both; }
._emb_t3   { animation: _emb_fadeUp  0.5s  cubic-bezier(.22,1,.36,1) 0.3s  both; }
._emb_t4   { animation: _emb_fadeUp  0.5s  cubic-bezier(.22,1,.36,1) 0.42s both; }
._emb_t5   { animation: _emb_fadeUp  0.5s  cubic-bezier(.22,1,.36,1) 0.52s both; }
`;

export default function Emblems({ nameCompany }: EmblemsProps) {
    const slides = SLIDE_CONTENT(nameCompany);
    const total = slides.length;

    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    // contentKey forces React to remount the content div → replays CSS animations
    const [contentKey, setContentKey] = useState(0);

    // Background crossfade: "from" layer stays visible, "to" layer fades in on top
    const [bgFrom, setBgFrom] = useState(0);
    const [bgTo, setBgTo] = useState(0);
    const [bgVisible, setBgVisible] = useState(false); // opacity of "to" layer

    const rafRef = useRef<number | null>(null);
    const startRef = useRef<number>(0);
    const lockedRef = useRef(false); // prevents overlapping transitions

    const triggerChange = (next: number) => {
        if (lockedRef.current) return;
        lockedRef.current = true;

        // Update content IMMEDIATELY — all elements start at opacity:0 via CSS animations,
        // so the new (correct) colors are in the DOM before they become visible.
        // This avoids the mismatch window where old text colors sit on the new background.
        setBgTo(next);
        setBgVisible(false);
        setCurrent(next);
        setProgress(0);
        setContentKey((k) => k + 1);
        startRef.current = performance.now();

        // Crossfade the background in parallel with the content animations
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setBgVisible(true);

                setTimeout(() => {
                    setBgFrom(next);
                    setBgVisible(false);
                    lockedRef.current = false;
                }, BG_TRANSITION_MS);
            });
        });
    };

    useEffect(() => {
        startRef.current = performance.now();

        const tick = (now: number) => {
            const pct = Math.min(((now - startRef.current) / INTERVAL_MS) * 100, 100);
            setProgress(pct);

            if (pct < 100) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                triggerChange((current + 1) % total);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current]);

    const slide = slides[current];
    const theme = THEMES[current];
    const themeFrom = THEMES[bgFrom];
    const themeTo = THEMES[bgTo];

    return (
        <>
            <style>{ANIM_CSS}</style>
            <section
                className="w-[90%] max-w-6xl mx-auto my-12 rounded-3xl overflow-hidden relative shadow-[0_18px_55px_rgba(0,0,0,0.2)]"
                style={{
                    border: `1px solid ${theme.border}`,
                    transition: `border-color ${BG_TRANSITION_MS}ms ease`,
                }}
            >
                {/* Background layer: FROM (always at full opacity underneath) */}
                <div
                    className="absolute inset-0"
                    style={{ background: themeFrom.gradient }}
                />
                {/* Background layer: TO (fades in on top) */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: themeTo.gradient,
                        opacity: bgVisible ? 1 : 0,
                        transition: bgVisible
                            ? `opacity ${BG_TRANSITION_MS}ms ease`
                            : "none",
                    }}
                />

                {/* All content sits above the background layers */}
                <div className="relative z-10">
                    {/* Progress bar */}
                    <div
                        className="w-full h-1.5"
                        style={{
                            background: theme.barBg,
                            transition: `background ${BG_TRANSITION_MS}ms ease`,
                        }}
                    >
                        <div
                            className="h-full"
                            style={{
                                width: `${progress}%`,
                                background: theme.barFill,
                                transition: `background ${BG_TRANSITION_MS}ms ease`,
                            }}
                        />
                    </div>

                    {/* Slide content — key changes on every slide switch to replay animations */}
                    <div
                        key={contentKey}
                        className="flex flex-col md:flex-row items-center gap-8 px-6 py-8 md:px-10 md:py-10"
                    >
                        {/* Emblem image */}
                        <div className="w-full md:w-auto flex justify-center shrink-0 _emb_img">
                            <div
                                className={`rounded-2xl border p-4 shadow-[0_10px_28px_rgba(0,0,0,0.2)] ${slide.imgWrap}`}
                            >
                                <img
                                    alt={slide.imgAlt}
                                    src={slide.img}
                                    className="h-48 md:h-56 w-auto object-contain"
                                />
                            </div>
                        </div>

                        {/* Text content */}
                        <div className="w-full md:flex-1 text-center md:text-left">
                            <p
                                className={`_emb_t1 text-sm md:text-base uppercase tracking-[0.18em] font-semibold ${slide.eyebrowColor}`}
                            >
                                {slide.eyebrow}
                            </p>
                            <h2
                                className={`_emb_t2 text-3xl md:text-4xl font-extrabold leading-tight mt-2 ${slide.titleColor}`}
                            >
                                {slide.title}
                            </h2>
                            <p
                                className={`_emb_t3 text-base md:text-lg leading-relaxed mt-4 max-w-2xl mx-auto md:mx-0 ${slide.descColor}`}
                            >
                                {slide.description}
                            </p>

                            <div className="_emb_t4 mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                                {slide.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium ${slide.tagStyle}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Dot navigation */}
                            <div className="_emb_t5 mt-6 flex gap-2 justify-center md:justify-start items-center">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => triggerChange(i)}
                                        aria-label={`Go to slide ${i + 1}`}
                                        className="rounded-full transition-all duration-300"
                                        style={{
                                            width: i === current ? "24px" : "10px",
                                            height: "10px",
                                            background:
                                                i === current
                                                    ? theme.dotActive
                                                    : theme.dotInactive,
                                            transition: `width 300ms ease, background ${BG_TRANSITION_MS}ms ease`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}