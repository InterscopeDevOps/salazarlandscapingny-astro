import type { ApiData, SectionsHomeAbout } from "@/interfaces/dbData";
import React, { useEffect, useState } from "react";

interface VideoGalleryProps {
	title?: string;
	dataBlocks: SectionsHomeAbout[];
	data: ApiData;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ title = "Videos", dataBlocks, data }) => {
	// Helpers to normalize/embed URLs
	const getEmbedUrl = (url?: string) => {
		if (!url) return "";
		try {
			const trimmed = url.trim();
			const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
			if (watchMatch && watchMatch[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;

			const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
			if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

			const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
			if (embedMatch && embedMatch[1]) return `https://www.youtube.com/embed/${embedMatch[1]}`;

			const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
			if (shortsMatch && shortsMatch[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

			const vimeoMatch = trimmed.match(/(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/);
			if (vimeoMatch && vimeoMatch[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

			return trimmed;
		} catch (e) {
			return url;
		}
	};

	const detectVideo = (url?: string) => {
		if (!url) return false;
		const trimmed = url.trim();
		if (!trimmed) return false;
		const videoPattern = /youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com|\.mp4|\.webm|\.mov|\.m3u8/i;
		return videoPattern.test(trimmed);
	};

	const buildAutoplaySrc = (embedUrl: string) => {
		if (!embedUrl) return embedUrl;
		return embedUrl.includes("?") ? `${embedUrl}&autoplay=1` : `${embedUrl}?autoplay=1`;
	};

	const videos = (data.videoAnimado || []).filter((v: any) => v && (v.urlVideo || v.url));

	const [open, setOpen] = useState(false);
	const [selectedSrc, setSelectedSrc] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	const openVideo = (rawUrl?: string) => {
		if (!rawUrl) return;
		const embed = getEmbedUrl(rawUrl);
		if (!embed || !detectVideo(rawUrl)) return;
		setSelectedSrc(buildAutoplaySrc(embed));
		setOpen(true);
	};

	const getYouTubeId = (url: string) => {
		const m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) || url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/) || url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
		return m ? m[1] : null;
	};

	const thumbnailFor = (url?: string) => {
		if (!url) return "";
		const id = getYouTubeId(url);
		if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
		// Vimeo thumbnails require API; fallback to empty string so we can show placeholder
		return "";
	};

	// Map of remote thumbnails fetched (keyed by raw url)
	const [remoteThumbs, setRemoteThumbs] = useState<Record<string, string>>({});

	// Fetch Vimeo oEmbed thumbnails for vimeo links (client-side)
	useEffect(() => {
		videos.forEach((v: any) => {
			const raw = (v.urlVideo || v.url || "").trim();
			if (!raw) return;
			const isYT = !!getYouTubeId(raw);
			const vimeoMatch = raw.match(/(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/);
			// if vimeo and not already fetched
			if (!isYT && vimeoMatch && vimeoMatch[1]) {
				if (remoteThumbs[raw]) return;
				const oembed = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(raw)}`;
				fetch(oembed)
					.then((r) => r.json())
					.then((json) => {
						if (json && json.thumbnail_url) {
							setRemoteThumbs((s) => ({ ...s, [raw]: json.thumbnail_url }));
						}
					})
					.catch(() => {
						// ignore failures, keep placeholder
					});
			}
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [videos]);

	if (!videos.length) return null;

	return (
		<section className="py-8 px-4">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold mb-4">{title}</h2>
				{/* <p className="mb-6 text-gray-600">{dataBlocks?.[6]?.text || data.slogan?.[6] || ""}</p> */}

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{videos.map((v: any, idx: number) => {
						const raw = v.urlVideo || v.url || "";
						const embed = getEmbedUrl(raw);
						const isValid = detectVideo(raw) && embed;
						const thumb = thumbnailFor(raw) || remoteThumbs[raw] || (v.poster || "");
						return (
							<button
								key={idx}
								onClick={() => openVideo(raw)}
								className="group bg-black rounded overflow-hidden relative flex items-center justify-center h-48 w-full"
								aria-label={`Abrir video ${idx + 1}`}
								type="button"
							>
								{thumb ? (
									<img loading="lazy" decoding="async" src={thumb} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">{/* placeholder */}
										<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-5.197-3.023A1 1 0 008 9.023v5.954a1 1 0 001.555.832l5.197-3.023a1 1 0 000-1.664z" />
										</svg>
									</div>
								)}

								<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
									<div className="rounded-full bg-black bg-opacity-50 p-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11.5v6l4-3-4-3z" clipRule="evenodd" />
										</svg>
									</div>
								</div>

								{!isValid && (
									<div className="absolute bottom-2 left-2 text-xs bg-white/80 text-black px-2 py-1 rounded">No compatible</div>
								)}
							</button>
						);
					})}
				</div>

				{open && selectedSrc && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
						<div className="w-[90%] max-w-4xl aspect-video bg-black rounded-lg overflow-hidden relative">
							<button
								aria-label="Cerrar video"
								onClick={() => setOpen(false)}
								className="absolute top-2 right-2 z-50 text-white bg-black/50 rounded-full p-2"
							>
								✕
							</button>
							<iframe
								className="w-full h-full"
								src={selectedSrc}
								title={title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default VideoGallery;