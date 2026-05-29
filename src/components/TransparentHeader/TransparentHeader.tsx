import LazyImage from "../LazyImage";

interface TransparentHeaderProps {
    bgImages: string;
    title: string;

}

const TransparentHeader: React.FC<TransparentHeaderProps> = ({ bgImages, title }) => {
    return (
        <section className="relative isolate w-full h-[360px] md:h-[520px] overflow-hidden">
            <div className="absolute inset-0 animate-fade-slide-down">
                <LazyImage
                    src={bgImages}
                    alt={title}
                    height={520}
                    className="w-full h-[360px] md:h-[520px] object-cover object-center scale-[1.02]"
                    imgLoading="eager"
                />
            </div>

            <div className="absolute inset-0 animate-fade-slide-down bg-gradient-to-b from-black/90 via-black/65 to-black/85"></div>
            <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-gradient-to-br from-black/35 to-black/5 blur-3xl animate-moveWaveLeftRight"></div>
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gradient-to-tr from-black/40 to-black/5 blur-3xl animate-moveWaveRightLeft"></div>

            <div className="absolute inset-0 mx-auto flex w-full max-w-[1400px] items-end px-4 pb-8 md:px-10 md:pb-14">
                <div className="animate-fade-slide-up-delay-1 max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:rounded-3xl md:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.4)]">
                    <div className="animate-fade-slide-up-delay-2 mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 md:text-xs">
                        <span className="h-2 w-2 rounded-full bg-white/80"></span>
                        Landscaping Specialists
                    </div>

                    <h1 className="animate-fade-slide-up-delay-3 text-3xl font-black uppercase leading-[1.05] tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] md:text-6xl lg:text-7xl">
                        {title}
                    </h1>

                    <div className="animate-slide-in-left-delay-2 mt-4 h-[3px] w-24 rounded-full bg-gradient-to-r from-primary via-secondary to-secondary md:w-40"></div>
                </div>
            </div>
        </section>
    );
}


export default TransparentHeader;