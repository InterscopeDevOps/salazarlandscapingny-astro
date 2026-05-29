import React, { useState } from 'react';
import type { ApiData } from '@/interfaces/dbData';
import EstimatePro from '@/components/Blocks/contact/EstimatePro';

interface FixedButtonsContentProps {
    dataGlobal: ApiData;
}

const FixedButtonsContent: React.FC<FixedButtonsContentProps> = ({ dataGlobal }) => {
    const [panelOpen, setPanelOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalWater, setShowModalWater] = useState(false);
    const [showEstimateModal, setShowEstimateModal] = useState(false);
    const phoneNumber = dataGlobal.dataGeneral.phones[0].number.replace(/-/g, '');
    const [viewClose, setViewClose] = useState(false);
    const estimateLabel = 'Estimate';

    const handleWhatsAppClick = () => {
        const urlWhatsApp = `https://wa.me/+1${phoneNumber}`;
        window.open(urlWhatsApp, '_blank');
    };

    const handleCounterClick = () => {
        setShowModal(!showModal);
        setShowModalWater(false);
        setViewClose(false);
        setTimeout(() => setViewClose(true), 3000);
    };

    const handleWaterClick = () => {
        setShowModalWater(!showModalWater);
        setShowModal(false);
        setViewClose(false);
        setTimeout(() => setViewClose(true), 2000);
    };

    const handleEstimateClick = () => {
        setShowEstimateModal((prev) => {
            const nextState = !prev;
            if (nextState) {
                setPanelOpen(false);
            }
            return nextState;
        });
        setShowModal(false);
        setShowModalWater(false);
        setViewClose(false);
        setTimeout(() => setViewClose(true), 2000);
    };

    const hasAnyWidget = true;

    if (!hasAnyWidget) return null;

    /* ── estilos inline glass usando variables del sitio ── */
    const glassPanel: React.CSSProperties = {
        background: 'color-mix(in srgb, var(--secondary) 92%, white 8%)',
        border: '1px solid color-mix(in srgb, var(--tertiary) 32%, var(--secondary) 68%)',
        boxShadow: '0 18px 42px rgba(20, 12, 38, 0.18)',
    };

    const glassToggle: React.CSSProperties = {
        background: 'color-mix(in srgb, var(--secondary) 82%, white 18%)',
        border: '1px solid color-mix(in srgb, var(--tertiary) 30%, var(--secondary) 70%)',
        borderLeft: 'none',
        boxShadow: '4px 0 22px rgba(20, 12, 38, 0.18)',
    };

    const glassWidget: React.CSSProperties = {
        background: 'color-mix(in srgb, var(--secondary) 96%, white 4%)',
        border: '1px solid color-mix(in srgb, var(--tertiary) 28%, var(--secondary) 72%)',
        boxShadow: '0 18px 40px rgba(20, 12, 38, 0.22)',
    };

    /* ── config de cada widget ── */
    type WidgetItem = {
        key: string;
        icon: string;
        label: string;
        accent: string;
        hoverBg: string;
        active?: boolean;
        onClick?: () => void;
        href?: string;
        badgeDot?: boolean;
    };

    const widgetItems: WidgetItem[] = [
        ...(dataGlobal.widgets.btnWhatsapp ? [{
            key: 'whatsapp', icon: 'fab fa-whatsapp', label: 'WhatsApp',
            accent: '#22c55e', hoverBg: 'rgba(34,197,94,0.25)', onClick: handleWhatsAppClick,
        }] : []),
        ...(dataGlobal.widgets.btnCallUs ? [{
            key: 'call', icon: 'fa-light fa-phone-volume', label: 'Call Us',
            accent: '#ef4444', hoverBg: 'rgba(239,68,68,0.25)', href: `tel:+1${phoneNumber}`,
        }] : []),
        ...(dataGlobal.widgets.colorPalette ? [{
            key: 'palette', icon: 'fas fa-palette', label: 'Colors',
            accent: '#a855f7', hoverBg: 'rgba(168,85,247,0.25)', href: '/colorpalette',
        }] : []),
        ...(dataGlobal.widgets.weatherViewer ? [{
            key: 'weather', icon: 'fas fa-cloud-sun', label: 'Weather',
            accent: '#eab308', hoverBg: 'rgba(234,179,8,0.25)',
            active: showModalWater, onClick: handleWaterClick,
        }] : []),
        ...(dataGlobal.widgets.counterVisit ? [{
            key: 'counter', icon: 'fas fa-chart-bar', label: 'Visitors',
            accent: 'var(--tertiary)', hoverBg: 'color-mix(in srgb, var(--primary) 30%, transparent)',
            active: showModal, onClick: handleCounterClick,
        }] : []),
        {
            key: 'estimate', icon: 'fa-slab-press fa-regular fa-clipboard', label: estimateLabel,
            accent: 'var(--btn-color)', hoverBg: 'color-mix(in srgb, var(--btn-color) 26%, transparent)',
            active: showEstimateModal, onClick: handleEstimateClick, badgeDot: true,
        },
    ];

    return (
        <div className="fixed z-[30] left-0 top-1/2 -translate-y-1/2 flex items-center">

            {/* Panel deslizable — items individuales */}
            <div
                className="grid grid-cols-2 gap-1.5 transition-all duration-500 ease-in-out"
                style={{
                    ...glassPanel,
                    width: panelOpen ? '126px' : '0px',
                    padding: panelOpen ? '6px' : '0px',
                    borderRadius: '0 14px 14px 0',
                    opacity: panelOpen ? 1 : 0,
                    pointerEvents: panelOpen ? 'auto' : 'none',
                }}
            >
                {widgetItems.map((w) => {
                    const inner = (
                        <>
                            {/* Barra de acento derecha */}
                            <span
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full transition-all duration-300"
                                style={{
                                    height: w.active ? '70%' : '0%',
                                    background: w.accent,
                                    boxShadow: w.active ? `0 0 8px ${w.accent}` : 'none',
                                }}
                                data-accent
                            ></span>
                            {/* Ícono */}
                            <i
                                className={`${w.icon} transition-all duration-200 text-lg`}
                                style={{ filter: w.active ? `drop-shadow(0 0 6px ${w.accent})` : undefined }}
                            ></i>
                            {/* Tooltip */}
                            <span
                                className="absolute left-full top-1/2 z-50 -translate-y-1/2 ml-2 whitespace-nowrap text-xs font-semibold text-white/90 px-2.5 py-1 rounded-lg pointer-events-none
                                           opacity-0 -translate-x-2 transition-all duration-200"
                                style={{
                                    background: 'color-mix(in srgb, var(--secondary) 85%, transparent)',
                                    backdropFilter: 'blur(12px)',
                                    border: `1px solid color-mix(in srgb, ${w.accent} 45%, transparent)`,
                                    boxShadow: `0 4px 16px color-mix(in srgb, ${w.accent} 25%, transparent)`,
                                }}
                                data-tooltip
                            >
                                {w.label}
                            </span>
                            {w.badgeDot && (
                                <span
                                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse"
                                    style={{ background: 'var(--tertiary)', boxShadow: '0 0 8px var(--tertiary)' }}
                                    aria-hidden="true"
                                />
                            )}
                        </>
                    );

                    const baseStyle: React.CSSProperties = {
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '54px',
                        height: '52px',
                        borderRadius: '10px',
                        color: w.active ? w.accent : 'rgba(255,255,255,0.85)',
                        background: w.active
                            ? `color-mix(in srgb, ${w.accent} 22%, var(--secondary) 78%)`
                            : 'color-mix(in srgb, white 8%, var(--secondary) 92%)',
                        cursor: 'pointer',
                        overflow: 'visible',
                        transition: 'all 0.2s ease',
                        border: `1px solid ${w.active ? `color-mix(in srgb, ${w.accent} 58%, var(--secondary) 42%)` : 'rgba(255,255,255,0.18)'}`,
                        boxShadow: w.active ? `0 0 0 1px color-mix(in srgb, ${w.accent} 32%, transparent)` : 'inset 0 1px 0 rgba(255,255,255,0.12)',
                    };

                    const hoverClass = `widget-item-${w.key}`;

                    return w.href ? (
                        <a
                            key={w.key}
                            href={w.href}
                            aria-label={w.label}
                            className={`group ${hoverClass}`}
                            style={baseStyle}
                            onMouseEnter={e => {
                                const el = e.currentTarget;
                                (el.style as any).background = w.hoverBg;
                                (el.style as any).border = `1px solid color-mix(in srgb, ${w.accent} 65%, transparent)`;
                                (el.style as any).boxShadow = `0 0 0 1px color-mix(in srgb, ${w.accent} 35%, transparent)`;
                                const accent = el.querySelector('[data-accent]') as HTMLElement;
                                if (accent) { accent.style.height = '70%'; accent.style.boxShadow = `0 0 8px ${w.accent}`; }
                                const icon = el.querySelector('i') as HTMLElement;
                                if (icon) icon.style.transform = 'scale(1.25)';
                                const tip = el.querySelector('[data-tooltip]') as HTMLElement;
                                if (tip) { tip.style.opacity = '1'; tip.style.transform = 'translateY(-50%) translateX(0)'; }
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget;
                                (el.style as any).background = 'color-mix(in srgb, white 8%, var(--secondary) 92%)';
                                (el.style as any).border = '1px solid rgba(255,255,255,0.18)';
                                (el.style as any).boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.12)';
                                const accent = el.querySelector('[data-accent]') as HTMLElement;
                                if (accent) { accent.style.height = '0%'; accent.style.boxShadow = 'none'; }
                                const icon = el.querySelector('i') as HTMLElement;
                                if (icon) icon.style.transform = 'scale(1)';
                                const tip = el.querySelector('[data-tooltip]') as HTMLElement;
                                if (tip) { tip.style.opacity = '0'; tip.style.transform = 'translateY(-50%) translateX(-8px)'; }
                            }}
                        >
                            {inner}
                        </a>
                    ) : (
                        <button
                            key={w.key}
                            onClick={w.onClick}
                            aria-label={w.label}
                            style={baseStyle}
                            onMouseEnter={e => {
                                const el = e.currentTarget;
                                el.style.background = w.hoverBg;
                                el.style.border = `1px solid color-mix(in srgb, ${w.accent} 65%, transparent)`;
                                el.style.boxShadow = `0 0 0 1px color-mix(in srgb, ${w.accent} 35%, transparent)`;
                                const accent = el.querySelector('[data-accent]') as HTMLElement;
                                if (accent) { accent.style.height = '70%'; accent.style.boxShadow = `0 0 8px ${w.accent}`; }
                                const icon = el.querySelector('i') as HTMLElement;
                                if (icon) icon.style.transform = 'scale(1.25)';
                                const tip = el.querySelector('[data-tooltip]') as HTMLElement;
                                if (tip) { tip.style.opacity = '1'; tip.style.transform = 'translateY(-50%) translateX(0)'; }
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget;
                                el.style.background = w.active
                                    ? `color-mix(in srgb, ${w.accent} 22%, var(--secondary) 78%)`
                                    : 'color-mix(in srgb, white 8%, var(--secondary) 92%)';
                                el.style.border = w.active
                                    ? `1px solid color-mix(in srgb, ${w.accent} 58%, var(--secondary) 42%)`
                                    : '1px solid rgba(255,255,255,0.18)';
                                el.style.boxShadow = w.active
                                    ? `0 0 0 1px color-mix(in srgb, ${w.accent} 32%, transparent)`
                                    : 'inset 0 1px 0 rgba(255,255,255,0.12)';
                                const accent = el.querySelector('[data-accent]') as HTMLElement;
                                if (accent) { accent.style.height = w.active ? '70%' : '0%'; }
                                const icon = el.querySelector('i') as HTMLElement;
                                if (icon) icon.style.transform = 'scale(1)';
                                const tip = el.querySelector('[data-tooltip]') as HTMLElement;
                                if (tip) { tip.style.opacity = '0'; tip.style.transform = 'translateY(-50%) translateX(-8px)'; }
                            }}
                        >
                            {inner}
                        </button>
                    );
                })}
            </div>

            {/* Botón toggle glass */}
            <button
                onClick={() => {
                    setPanelOpen(!panelOpen);
                    if (panelOpen) {
                        setShowModal(false);
                        setShowModalWater(false);
                        setViewClose(false);
                    }
                }}
                aria-label={panelOpen ? 'Close widgets panel' : 'Open widgets panel'}
                className="relative flex items-center justify-center w-8 h-[58px]  text-white rounded-tr-2xl rounded-br-2xl transition-all duration-300 hover:brightness-125"
                style={glassToggle}
            >
                <i className={`fas text-xs text-white/80  transition-transform duration-400 ${panelOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                {!panelOpen && (
                    <span
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse"
                        style={{ background: 'var(--tertiary)', boxShadow: '0 0 8px var(--tertiary)' }}
                    ></span>
                )}
            </button>

            {/* Widget: Counter — glass popup */}
            {showModal && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 animate-fade-in">
                    <div className="relative rounded-2xl overflow-hidden p-4 min-w-[230px]" style={glassWidget}>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/15">
                            <span className="text-xs font-semibold text-white/80 uppercase tracking-widest flex items-center gap-1.5">
                                <i className="fas fa-chart-bar" style={{ color: 'var(--tertiary)' }}></i> Visitors
                            </span>
                            {viewClose && (
                                <button
                                    onClick={() => { setShowModal(false); setViewClose(false); }}
                                    className="w-6 h-6 flex items-center justify-center rounded-full text-white/70 text-xs hover:text-white hover:bg-white/20 transition-all"
                                    aria-label="Close"
                                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                        <div className="elfsight-app-44e6f653-cea2-4158-844c-eb0c266426bc" data-elfsight-app-lazy></div>
                    </div>
                </div>
            )}

            {/* Widget: Weather — glass popup */}
            {showModalWater && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50">
                    <div className="relative rounded-2xl overflow-hidden p-4 min-w-[230px]" style={glassWidget}>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/15">
                            <span className="text-xs font-semibold text-white/80 uppercase tracking-widest flex items-center gap-1.5">
                                <i className="fas fa-cloud-sun text-yellow-300"></i> Weather
                            </span>
                            {viewClose && (
                                <button
                                    onClick={() => { setShowModalWater(false); setViewClose(false); }}
                                    className="w-6 h-6 flex items-center justify-center rounded-full text-white/70 text-xs hover:text-white hover:bg-white/20 transition-all"
                                    aria-label="Close"
                                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                        <div className="elfsight-app-2c61b889-3cfa-497e-8470-2c98c7cfacbe" data-elfsight-app-lazy></div>
                    </div>
                </div>
            )}

            {showEstimateModal && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[999] animate-fade-in">
                    <div className="relative rounded-2xl overflow-hidden p-4 min-w-[320px] max-w-[92vw]" style={glassWidget}>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/15">
                            <span className="text-xs font-semibold text-white/80 uppercase tracking-widest flex items-center gap-1.5">
                                <i className="fa-slab-press fa-regular fa-clipboard text-white/90"></i> {estimateLabel}
                            </span>
                            {viewClose && (
                                <button
                                    onClick={() => { setShowEstimateModal(false); setViewClose(false); }}
                                    className="w-6 h-6 flex items-center justify-center rounded-full text-white/70 text-xs hover:text-white hover:bg-white/20 transition-all"
                                    aria-label="Close"
                                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                        <div className="max-h-[72vh] overflow-auto pr-1 estimate-scrollbar">
                            <EstimatePro
                                recipientEmail={dataGlobal.dataGeneral.emails}
                                companyName={dataGlobal.name}
                                logo={dataGlobal.logos.primary}
                                services={dataGlobal.services.map((service) => service.title).filter(Boolean)}
                                data={dataGlobal}
                                embedded
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixedButtonsContent;
