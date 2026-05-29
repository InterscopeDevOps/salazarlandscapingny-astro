import FadeInOnScroll from "@/animations/FadeIn";
import useTextRender from "@/hook/TextRender";
import type { ApiData, SectionsHomeAbout } from "@/interfaces/dbData";
import React, { useEffect, useState } from "react";

//Mandar a llamarlo : <VideoSection dataBlocks={dataBlocks} data={data} client:load />

interface VideoSectionProps {
  title?: string;
  dataBlocks: SectionsHomeAbout[];
  data: ApiData;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  title = "Video",
  dataBlocks,
  data,
}) => {
  const textRender = useTextRender();

  const getYouTubeId = (url?: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch?.[1]) return watchMatch[1];

    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch?.[1]) return shortMatch[1];

    const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch?.[1]) return embedMatch[1];

    const shortsMatch = trimmed.match(
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    );
    if (shortsMatch?.[1]) return shortsMatch[1];

    return "";
  };

  const getPreviewImage = (url?: string, index = 0) => {
    const ytId = getYouTubeId(url);
    if (ytId) return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;

    const imagePool =
      dataBlocks
        ?.flatMap((block) => block?.additionalImages || [])
        .filter(Boolean) || [];

    if (imagePool.length > 0) return imagePool[index % imagePool.length];
    return "/assets/images/stockWeb/1.webp";
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    try {
      // Normalize spaces
      const trimmed = url.trim();
      // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
      const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
      if (watchMatch && watchMatch[1])
        return `https://www.youtube.com/embed/${watchMatch[1]}`;

      // youtu.be short link: https://youtu.be/VIDEO_ID
      const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch && shortMatch[1])
        return `https://www.youtube.com/embed/${shortMatch[1]}`;

      // embed or shorts or already embed
      const embedMatch = trimmed.match(
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      );
      if (embedMatch && embedMatch[1])
        return `https://www.youtube.com/embed/${embedMatch[1]}`;

      const shortsMatch = trimmed.match(
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      );
      if (shortsMatch && shortsMatch[1])
        return `https://www.youtube.com/embed/${shortsMatch[1]}`;

      // Vimeo links: examples
      // https://vimeo.com/12345678
      // https://vimeo.com/12345678?fl=pl&fe=sh
      // https://player.vimeo.com/video/12345678
      const vimeoMatch = trimmed.match(
        /(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/,
      );
      if (vimeoMatch && vimeoMatch[1])
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

      // Fallback: return the original URL (may be a direct video URL)
      return trimmed;
    } catch (e) {
      return url;
    }
  };

  const detectVideo = (url?: string) => {
    if (!url) return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    const videoPattern =
      /youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com|\.mp4|\.webm|\.mov|\.m3u8/i;
    return videoPattern.test(trimmed);
  };

  // Filtrar los videos válidos
  const videos =
    data.videoAnimado?.filter(
      (v: any) => v.urlVideo && detectVideo(v.urlVideo),
    ) || [];
  const hasVideo = videos.length > 0;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Si no detecta un video válido, no renderizamos el componente
  if (!hasVideo) return null;

  const currentVideo = videos[currentIndex % videos.length];
  const rawVideoUrl = currentVideo?.urlVideo;
  const src = getEmbedUrl(rawVideoUrl);
  const isDirectFile = Boolean(
    rawVideoUrl && /\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(rawVideoUrl),
  );

  const isModalMode = Boolean(data.widgets?.videoAnimado);
  const [open, setOpen] = useState<boolean>(isModalMode);

  // Open automatically only when the external widget asks for modal mode.
  useEffect(() => {
    if (isModalMode) setOpen(true);
  }, [isModalMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const buildAutoplaySrc = (embedUrl: string) => {
    if (!embedUrl) return embedUrl;
    return embedUrl.includes("?")
      ? `${embedUrl}&autoplay=1`
      : `${embedUrl}?autoplay=1`;
  };

  const modalSrc = buildAutoplaySrc(src);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const renderVideoCard = (
    video: any,
    index: number,
    size: "half" | "tall" | "wide" | "extra",
  ) => {
    const preview = getPreviewImage(video?.urlVideo, index);
    const sizeClass =
      size === "half"
        ? "h-[250px] sm:h-[290px] w-full sm:w-[calc(50%-0.5rem)]"
        : size === "tall"
          ? "h-[360px] sm:h-[520px] lg:h-[595px] w-full"
          : size === "wide"
            ? "h-[280px] sm:h-[300px] w-full"
            : "h-[250px] sm:h-[280px] w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.85rem)]";

    return (
      <FadeInOnScroll
        key={video?.urlVideo || index}
        delay={150 + index * 80}
        type="fade-up"
        className={`${sizeClass} shrink-0`}
      >
        <button
          aria-label={`Abrir video ${index + 1}`}
          onClick={() => {
            setCurrentIndex(index);
            setOpen(true);
          }}
          className="group relative h-full w-full overflow-hidden rounded-3xl border border-primary/20 bg-white/80 shadow-[0_15px_35px_rgba(1,86,107,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(1,86,107,0.2)]"
        >
          <img
            src={preview}
            alt={video?.title || `Preview de video ${index + 1}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"></div>

          <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition group-hover:scale-110 group-hover:rotate-12 group-hover:bg-btnHover">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M8 7h9v9"
              />
            </svg>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-left text-white">
            <p className="line-clamp-1 text-sm font-semibold tracking-wide sm:text-base">
              {video?.title || `Project ${index + 1}`}
            </p>
          </div>
        </button>
      </FadeInOnScroll>
    );
  };

  return (
    <>
      {!isModalMode && (
        <section className="relative overflow-hidden bg-white py-16 md:py-20 text-title">
          <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-16 -left-24 h-72 w-72 rounded-full bg-tertiary/20 blur-3xl"></div>

          <div className="mx-auto w-[90%] max-w-[90%] px-5 sm:px-8 lg:px-12">
            <FadeInOnScroll delay={150} type="fade-up">
              <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary sm:text-sm">
                <span>↗</span>
                <span>{data.slogan?.[4] || "Our Work Gallery"}</span>
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={250} type="fade-up">
              <h2 className="w-full text-3xl font-black text-black leading-[1.1] sm:text-5xl lg:text-5xl">
                <span>{data.slogan?.[5] || "Expert Carpentry"} </span>
                <span className="text-primary">{data.name || "Work Showcase."}</span>
              </h2>
            </FadeInOnScroll>

            <FadeInOnScroll delay={350} type="fade-up">
              <p className="mt-5 w-full text-sm leading-relaxed text-text sm:text-base">
                {textRender.renderText(dataBlocks[0]?.text) ||
                  "Explore a curated gallery of our featured spaces and open any card to watch the full project video."}
              </p>
            </FadeInOnScroll>

            <div className="mt-10 flex flex-col gap-4 lg:gap-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
                <div className="flex w-full flex-col gap-4 lg:w-[60%] lg:gap-5">
                  <div className="flex flex-col gap-4 sm:flex-row lg:gap-5">
                    {videos[0] && renderVideoCard(videos[0], 0, "half")}
                    {videos[1] && renderVideoCard(videos[1], 1, "half")}
                  </div>
                  {videos[3] && renderVideoCard(videos[3], 3, "wide")}
                </div>

                <div className="w-full lg:w-[40%]">
                  {videos[2] && renderVideoCard(videos[2], 2, "tall")}
                </div>
              </div>

              {videos.length > 4 && (
                <div className="flex flex-wrap gap-4 lg:gap-5">
                  {videos.slice(4).map((video: any, extraIndex: number) =>
                    renderVideoCard(video, extraIndex + 4, "extra"),
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <div className="relative w-[95%] max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <div className="relative aspect-video">
              <button
                aria-label="Cerrar video"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-50 rounded-full bg-black/55 p-2 text-white transition hover:bg-black/85"
              >
                ✕
              </button>

              {videos.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Video anterior"
                    className="absolute left-3 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white transition hover:bg-black/80"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Siguiente video"
                    className="absolute right-3 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white transition hover:bg-black/80"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {isDirectFile ? (
                <video
                  key={currentIndex}
                  className="h-full w-full"
                  src={rawVideoUrl}
                  controls
                  autoPlay
                />
              ) : (
                <iframe
                  key={currentIndex}
                  className="h-full w-full"
                  src={modalSrc}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSection;
