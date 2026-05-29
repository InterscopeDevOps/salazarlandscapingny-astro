import React, { useMemo, useState } from "react";
import EstimatePro from "@/components/Blocks/contact/EstimatePro";
import type { ApiData } from "@/interfaces/dbData";

interface PanelEstimateFixedProps {
	dataGlobal: ApiData;
}

const PanelEstimateFixed: React.FC<PanelEstimateFixedProps> = ({ dataGlobal }) => {
	const [panelOpen, setPanelOpen] = useState(false);

	const services = useMemo(
		() => (dataGlobal.services || []).map((service) => service.title).filter(Boolean),
		[dataGlobal.services],
	);

	const canRender =
		Boolean(dataGlobal?.dataGeneral?.emails?.length) &&
		Boolean(dataGlobal?.name);

	if (!canRender) return null;

	const glassPanel: React.CSSProperties = {
		background: "color-mix(in srgb, var(--primary) 14%, rgba(255,255,255,0.86))",
		backdropFilter: "blur(18px)",
		WebkitBackdropFilter: "blur(18px)",
		border: "1px solid color-mix(in srgb, var(--tertiary) 25%, transparent)",
		boxShadow: "0 28px 70px color-mix(in srgb, var(--primary) 24%, transparent)",
	};

	const glassToggle: React.CSSProperties = {
		background: "color-mix(in srgb, var(--primary) 20%, rgba(255,255,255,0.15))",
		backdropFilter: "blur(14px)",
		WebkitBackdropFilter: "blur(14px)",
		border: "1px solid color-mix(in srgb, var(--tertiary) 45%, transparent)",
		borderLeft: "none",
		boxShadow: "-4px 0 22px color-mix(in srgb, var(--primary) 30%, transparent)",
	};

	return (
		<div className="fixed left-0 top-[calc(50%+110px)] -translate-y-1/2 z-[70] flex items-center">
			<button
				type="button"
				onClick={() => setPanelOpen((prev) => !prev)}
				aria-label={panelOpen ? "Close estimate panel" : "Open estimate panel"}
				aria-expanded={panelOpen}
				className="relative flex items-center gap-2 w-[132px] h-11 px-3 rounded-tr-2xl rounded-br-2xl text-white transition-all duration-300 hover:brightness-110"
				style={glassToggle}
			>
				<i className="fa-slab-press fa-regular fa-clipboard text-sm text-white/95"></i>
				<span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/95">Estimate</span>
				<i className={`fas text-[11px] text-white/90 ml-auto transition-transform duration-300 ${panelOpen ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
				{!panelOpen && (
					<span
						className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse"
						style={{ background: "var(--tertiary)", boxShadow: "0 0 8px var(--tertiary)" }}
					></span>
				)}
			</button>

			<div
				className="transition-all duration-500 ease-in-out overflow-hidden"
				style={{
					...glassPanel,
					width: panelOpen ? "430px" : "0px",
					maxWidth: "calc(100vw - 2.5rem)",
					maxHeight: "calc(100vh - 4rem)",
					borderRadius: "0 1.2rem 1.2rem 0",
					padding: panelOpen ? "10px" : "0px",
					opacity: panelOpen ? 1 : 0,
					pointerEvents: panelOpen ? "auto" : "none",
				}}
			>
				<div className="h-full w-full rounded-2xl overflow-hidden">
					<EstimatePro
						recipientEmail={dataGlobal.dataGeneral.emails}
						companyName={dataGlobal.name}
						logo={dataGlobal.logos.primary}
						services={services}
						data={dataGlobal}
						embedded
					/>
				</div>
			</div>
		</div>
	);
};

export default PanelEstimateFixed;
