import React, { useEffect, useMemo, useRef, useState } from "react";

import type { Email, ApiData } from "../../../interfaces/dbData";
import UseTextHidden from "@/hook/UseTextHidden";
import { FaCamera, FaChevronLeft, FaChevronRight, FaImages, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt, FaRegCommentDots, FaTrash, FaUser } from "react-icons/fa";


type EstimateProProps = {
    recipientEmail: Email[];
    companyName: string;
    logo: string;
    services: string[];
    data?: ApiData | null;
    embedded?: boolean;

};


const DEFAULT_KEY = "dev_74621dd2-387e-4012-b973-f98c246b72df";
const API_URL = "https://email-server-r-8fb46242f2ca.herokuapp.com/email/custom/int";
const PHONE_MAX_DIGITS = 10;
const MESSAGE_MIN_CHARS = 8;
const MESSAGE_MAX_CHARS = 250;
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE_MB = 6;
const PANEL_STATE_KEY = "pc_global_contact_panel_open";
const ZIP_MIN_DIGITS = 5;

const EstimatePro: React.FC<EstimateProProps> = ({
    recipientEmail,
    companyName,
    logo,
    services,
    embedded = false,
}) => {
    const [open, setOpen] = useState(embedded ? true : false);
    const [storageReady, setStorageReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusType, setStatusType] = useState<"success" | "error" | null>(
        null,
    );
    const [statusMessage, setStatusMessage] = useState<string>("");


    // Multi-step form state
    const [step, setStep] = useState(1); // 1: Contact, 2: Services, 3: Images/Review
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [stateRegion, setStateRegion] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [estimateImages, setEstimateImages] = useState<string[]>([]);
    const [imageStatus, setImageStatus] = useState<string>("");
    const [locationStatus, setLocationStatus] = useState<string>("");
    const [stepVisible, setStepVisible] = useState(true);

    const galleryInputRef = useRef<HTMLInputElement | null>(null);
    const cameraInputRef = useRef<HTMLInputElement | null>(null);

    const phoneDigits = useMemo(() => phone.replace(/\D/g, ""), [phone]);
    const isPhoneValid = phoneDigits.length === PHONE_MAX_DIGITS;
    const messageLength = useMemo(() => message.trim().length, [message]);
    const panelLogo = useMemo(() => normalizeLogoUrl(logo), [logo]);
    const isMessageValid =
        messageLength >= MESSAGE_MIN_CHARS && messageLength <= MESSAGE_MAX_CHARS;
    const isNameValid = fullName.trim().length > 1;
    const isAddressValid = address.trim().length > 1;
    const isCityValid = city.trim().length > 1;
    const isStateValid = stateRegion.trim().length > 1;
    const isZipValid = /^\d{5}(-\d{4})?$/.test(zipCode.trim());


    // Validations por paso
    const isStep1Valid = isNameValid && isPhoneValid && isAddressValid && isCityValid && isStateValid && isZipValid;
    const isStep2Valid = isMessageValid; // selectedServices es opcional
    const isStep3Valid = true; // Imágenes son opcionales
    const isValid = isStep1Valid && isStep2Valid && isStep3Valid;
    const hasServiceOptions = services.length > 0;
    const requiredFieldChecks = useMemo(
        () => [
            isNameValid,
            isPhoneValid,
            isAddressValid,
            isCityValid,
            isStateValid,
            isZipValid,
            isMessageValid,
        ],
        [
            isNameValid,
            isPhoneValid,
            isAddressValid,
            isCityValid,
            isStateValid,
            isZipValid,
            isMessageValid,
        ],
    );
    const totalRequiredFields = requiredFieldChecks.length;
    const completedRequiredFields = requiredFieldChecks.filter(Boolean).length;
    const completionPercent = Math.round(
        (completedRequiredFields / totalRequiredFields) * 100,
    );

    const containerTransform = open
        ? "translate3d(0, 0, 0)"
        : "translate3d(100%, 0, 0)";


    useEffect(() => {
        if (!storageReady) return;
        try {
            window.localStorage.setItem(PANEL_STATE_KEY, open ? "1" : "0");
        } catch (err) {
            // no-op
        }
    }, [open, storageReady]);

    useEffect(() => {
        setStepVisible(false);
        const timer = window.setTimeout(() => setStepVisible(true), 45);
        return () => window.clearTimeout(timer);
    }, [step]);

    const stepTransitionClass = `transition-all duration-300 ease-out ${
        stepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
    }`;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isValid || loading) return;

        setLoading(true);
        setStatusMessage("");
        setStatusType(null);

        const safeCompany = companyName || "Company";
        // const to = recipientEmail[0].email;
        const to = "yaderinterscope@gmail.com";
        const cc = ["yader@geniustechdevelopment.com"];

        // const cc = recipientEmail.length > 1 ? recipientEmail.slice(1).map(email => email.email) : undefined; // <-- Solo incluir si hay correos en cc
        const safeLogo = panelLogo;
        const subject = `New Estimated Pro request - ${safeCompany}`;
        const selectedServicesText = selectedServices.length
            ? selectedServices.map((item) => escapeHtml(item)).join(", ")
            : "Not specified";
        const photosSection = estimateImages.length
            ? `
                <tr>
                    <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#64748b;font-weight:700;vertical-align:top;">Photos</td>
                    <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#0f172a;">${estimateImages.length} image(s) attached in estimateImg.</td>
                </tr>
            `
            : "";
        const body = `
            <!doctype html>
            <html>
            <body style="margin:0;padding:24px;background:#f5f7fb;font-family:Arial,sans-serif;color:#111827;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:100%;background:#ffffff;border-radius:14px;border:1px solid #e5e7eb;overflow:hidden;">
                                <tr>
                                    <td style="padding:24px 28px;">
                                        <h2 style="margin:0 0 14px 0;font-size:22px;line-height:1.2;color:#0f172a;">Estimated Pro Request</h2>
                                        <p style="margin:0 0 14px 0;color:#475569;font-size:14px;">A visitor sent a global floating form request from the website.</p>

                                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                                            <tr>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#64748b;font-weight:700;width:35%;">Name</td>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#0f172a;">${escapeHtml(fullName)}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#64748b;font-weight:700;">Phone</td>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#0f172a;">${escapeHtml(phone)}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#64748b;font-weight:700;">Address</td>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#0f172a;">${escapeHtml(address)}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#64748b;font-weight:700;">City</td>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#0f172a;">${escapeHtml(city)}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#64748b;font-weight:700;">State</td>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#0f172a;">${escapeHtml(stateRegion)}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#64748b;font-weight:700;">ZIP code</td>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#0f172a;">${escapeHtml(zipCode)}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#64748b;font-weight:700;">Requested services</td>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#0f172a;">${selectedServicesText}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#64748b;font-weight:700;vertical-align:top;">Message</td>
                                                <td style="padding:10px 0;border-top:1px solid #eef2f7;color:#0f172a;">${escapeHtml(message)}</td>
                                            </tr>
                                            ${photosSection}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": DEFAULT_KEY,
                },
                body: JSON.stringify({
                    to,
                    cc, // <-- Se agrega el campo cc
                    subject,
                    body,
                    companyName: safeCompany,
                    logo: safeLogo,
                    selectedServices: selectedServices.length
                        ? selectedServices
                        : undefined,
                    estimateImg: estimateImages.length ? estimateImages : undefined,
                }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(json?.msg || "Unable to send your message right now.");
            }

            setStatusType("success");
            setStatusMessage("Message sent. We will contact you shortly.");
            setFullName("");
            setPhone("");
            setAddress("");
            setCity("");
            setStateRegion("");
            setZipCode("");
            setSelectedServices([]);
            setMessage("");
            setEstimateImages([]);
            setImageStatus("");
            setLocationStatus("");
            setStep(1);
        } catch (err: any) {
            setStatusType("error");
            setStatusMessage(err?.message || "Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddImages(fileList: FileList | null) {
        if (!fileList || fileList.length === 0) return;

        const availableSlots = MAX_IMAGES - estimateImages.length;
        if (availableSlots <= 0) {
            setImageStatus("No more photos can be added right now.");
            return;
        }

        const incoming = Array.from(fileList).slice(0, availableSlots);
        const acceptedFiles: File[] = [];
        const rejectedReasons: string[] = [];

        incoming.forEach((file) => {
            if (!file.type.startsWith("image/")) {
                rejectedReasons.push(`${file.name}: invalid format`);
                return;
            }

            const sizeInMb = file.size / (1024 * 1024);
            if (sizeInMb > MAX_IMAGE_SIZE_MB) {
                rejectedReasons.push(`${file.name}: exceeds ${MAX_IMAGE_SIZE_MB}MB`);
                return;
            }

            acceptedFiles.push(file);
        });

        if (!acceptedFiles.length) {
            setImageStatus(rejectedReasons[0] || "No valid images selected.");
            return;
        }

        const encoded = await Promise.all(
            acceptedFiles.map((file) => fileToDataUrl(file)),
        );
        setEstimateImages((prev) => [...prev, ...encoded]);

        if (rejectedReasons.length > 0) {
            setImageStatus(rejectedReasons[0]);
            return;
        }

        setImageStatus(`${acceptedFiles.length} photo(s) added.`);
    }

    function removeImage(indexToRemove: number) {
        setEstimateImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setImageStatus("Photo removed.");
    }

    function toggleService(service: string) {
        setSelectedServices((prev) =>
            prev.includes(service)
                ? prev.filter((item) => item !== service)
                : [...prev, service],
        );
    }

    async function fillCityStateFromZip(rawZip: string) {
        const zip5 = rawZip.replace(/\D/g, "").slice(0, ZIP_MIN_DIGITS);
        if (zip5.length < ZIP_MIN_DIGITS) return;

        try {
            setLocationStatus("Looking up city and state from ZIP...");
            const response = await fetch(`https://api.zippopotam.us/us/${zip5}`);
            if (!response.ok) {
                throw new Error("ZIP lookup unavailable");
            }
            const data = await response.json();
            const place = data?.places?.[0];
            if (!place) {
                throw new Error("ZIP not found");
            }

            setCity((prev) => prev || String(place["place name"] || ""));
            setStateRegion((prev) => prev || String(place["state abbreviation"] || place.state || ""));
            setZipCode((prev) => (prev ? prev : zip5));
            setLocationStatus("City and state auto-filled from ZIP.");
        } catch (error) {
            setLocationStatus("Could not auto-fill from ZIP. You can type it manually.");
        }
    }

    return (
        <>
            <div className={`relative flex flex-col border border-slate-200/90 bg-white/95 shadow-[0_30px_80px_rgba(15,23,42,0.22)] backdrop-blur-2xl overflow-hidden ${embedded ? "rounded-3xl" : "rounded-none sm:rounded-l-3xl md:rounded-l-[30px]"}`} style={{ maxHeight: '100vh', minHeight: 'auto' }}>
                {!embedded && (
                    <button
                        type="button"
                        aria-label={open ? "Hide form" : "Open form"}
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 h-[72px] md:h-[86px] w-10 md:w-12 rounded-l-2xl rounded-r-xl text-white shadow-lg border border-primary/20 bg-btnColor hover:bg-btnHover focus:outline-none focus:ring-2 focus:ring-primary/25"
                    >
                        <span className="flex h-full w-full items-center justify-center">
                            {open ? (
                                <FaChevronRight className="text-base md:text-lg" />
                            ) : (
                                <FaChevronLeft className="text-base md:text-lg" />
                            )}
                        </span>
                    </button>
                )}

                <div className="px-3 md:px-4 pt-2 md:pt-2 pb-1 md:pb-1 bg-white">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="mb-2 inline-flex items-center gap-2.5 rounded-2xl bg-white px-2 py-1.5">
                                <span className="relative inline-flex h-[46px] w-[46px] md:h-[55px] md:w-[55px] items-center justify-center">
                                    <span className="relative inline-flex h-full w-full items-center justify-center overflow-hidden rounded-full shadow-lg border border-slate-200 bg-secondary">
                                        <img
                                            src={panelLogo}
                                            alt={`${companyName} logo`}
                                            className="h-full w-full object-contain"
                                            loading="lazy"
                                        />
                                    </span>
                                </span>

                                <span className="min-w-0 w-56 md:w-auto">
                                    <span className="flex items-center gap-1.5">
                                        <span className="truncate text-[13px] md:text-[14px] font-extrabold text-slate-800">
                                            {companyName}
                                        </span>
                                        <span className="inline-flex shrink-0 items-center rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-primary">
                                            <UseTextHidden text="Verified" />
                                        </span>
                                    </span>
                                    <span className="block text-xs font-semibold text-slate-500">
                                        <UseTextHidden text="Estimated Pro" />
                                    </span>
                                </span>
                            </div>
                            <h3 className="mt-0 text-[16px] md:text-[19px] leading-tight font-black text-slate-900">
                                <UseTextHidden text="Get Your Instant Quote" />
                            </h3>
                        </div>

                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 px-3 md:px-4 py-2 md:py-2 space-y-2 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.86))]"
                >
                    {/* Paso 1: Información de contacto */}
                    {step === 1 && (
                        <div className={stepTransitionClass}>
                            <label className="block">
                                <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                    <UseTextHidden text="Full name" />
                                </span>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <FaUser className="text-[13px]" />
                                    </span>
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Your full name"
                                        className={`w-full rounded-2xl border bg-white/95 pl-9 pr-3 py-2.5 md:py-3 text-[13px] md:text-sm text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.04)] outline-none transition-all ${fullName.length > 0 && !isNameValid ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100" : "border-slate-300/90 focus:border-btnHover focus:ring-4 focus:ring-primary/15"}`}
                                        autoComplete="name"
                                        aria-invalid={fullName.length > 0 && !isNameValid}
                                    />
                                </div>
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                    <UseTextHidden text="Phone number" />
                                </span>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <FaPhoneAlt className="text-[12px]" />
                                    </span>
                                    <input
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, PHONE_MAX_DIGITS),
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            const allowed = [
                                                "Backspace",
                                                "Delete",
                                                "ArrowLeft",
                                                "ArrowRight",
                                                "Tab",
                                                "Home",
                                                "End",
                                            ];
                                            if (allowed.includes(e.key)) return;
                                            if (!/^\d$/.test(e.key)) e.preventDefault();
                                        }}
                                        inputMode="numeric"
                                        pattern="[0-9]{10}"
                                        maxLength={PHONE_MAX_DIGITS}
                                        placeholder="0000000000"
                                        className={`w-full rounded-2xl border bg-white/95 pl-9 pr-3 py-2.5 md:py-3 text-[13px] md:text-sm text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.04)] outline-none transition-all ${phone.length > 0 && !isPhoneValid ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100" : "border-slate-300/90 focus:border-btnHover focus:ring-4 focus:ring-primary/15"}`}
                                        autoComplete="tel"
                                        aria-invalid={phone.length > 0 && !isPhoneValid}
                                    />
                                </div>
                            </label>
                            <label className="block">
                                <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                    <UseTextHidden text="Address" />
                                </span>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <FaMapMarkerAlt className="text-[13px]" />
                                    </span>
                                    <input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Street address"
                                        className={`w-full rounded-2xl border bg-white/95 pl-9 pr-3 py-2.5 md:py-3 text-[13px] md:text-sm text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.04)] outline-none transition-all ${address.length > 0 && !isAddressValid ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100" : "border-slate-300/90 focus:border-btnHover focus:ring-4 focus:ring-primary/15"}`}
                                        autoComplete="street-address"
                                        aria-invalid={address.length > 0 && !isAddressValid}
                                    />
                                </div>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <label className="block">
                                    <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                        <UseTextHidden text="City" />
                                    </span>
                                    <input
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="City"
                                        className={`w-full rounded-2xl border bg-white/95 px-3 py-2.5 md:py-3 text-[13px] md:text-sm text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.04)] outline-none transition-all ${city.length > 0 && !isCityValid ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100" : "border-slate-300/90 focus:border-btnHover focus:ring-4 focus:ring-primary/15"}`}
                                        autoComplete="address-level2"
                                        aria-invalid={city.length > 0 && !isCityValid}
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                        <UseTextHidden text="State" />
                                    </span>
                                    <input
                                        value={stateRegion}
                                        onChange={(e) => setStateRegion(e.target.value.toUpperCase().slice(0, 20))}
                                        placeholder="State"
                                        className={`w-full rounded-2xl border bg-white/95 px-3 py-2.5 md:py-3 text-[13px] md:text-sm text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.04)] outline-none transition-all ${stateRegion.length > 0 && !isStateValid ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100" : "border-slate-300/90 focus:border-btnHover focus:ring-4 focus:ring-primary/15"}`}
                                        autoComplete="address-level1"
                                        aria-invalid={stateRegion.length > 0 && !isStateValid}
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                        <UseTextHidden text="ZIP code" />
                                    </span>
                                    <input
                                        value={zipCode}
                                        onChange={(e) => {
                                            const cleaned = e.target.value.replace(/[^\d-]/g, "").slice(0, 10);
                                            setZipCode(cleaned);
                                        }}
                                        onBlur={() => fillCityStateFromZip(zipCode)}
                                        placeholder="00000"
                                        inputMode="numeric"
                                        maxLength={10}
                                        className={`w-full rounded-2xl border bg-white/95 px-3 py-2.5 md:py-3 text-[13px] md:text-sm text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.04)] outline-none transition-all ${zipCode.length > 0 && !isZipValid ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100" : "border-slate-300/90 focus:border-btnHover focus:ring-4 focus:ring-primary/15"}`}
                                        autoComplete="postal-code"
                                        aria-invalid={zipCode.length > 0 && !isZipValid}
                                    />
                                    <span className={`mt-1 block text-[10px] ${zipCode.length > 0 && !isZipValid ? "text-rose-600" : "text-slate-500"}`}>
                                        <UseTextHidden text="Enter 5 digits (or ZIP+4)" />
                                    </span>
                                    {locationStatus && (
                                        <p className="mt-1 text-[10px] text-slate-500">{locationStatus}</p>
                                    )}
                                </label>
                            </div>
                        </div>
                    )}
                    {/* Paso 2: Servicios requeridos y mensaje */}
                    {step === 2 && (
                        <div className={stepTransitionClass}>
                            {hasServiceOptions && (
                                <div className="rounded-2xl border border-slate-200/90 bg-white/85 p-3">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                            <UseTextHidden text="Services Needed" />
                                        </p>
                                        {selectedServices.length > 0 && (
                                            <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                {selectedServices.length} <UseTextHidden text="selected" />
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {services.map((service) => {
                                            const active = selectedServices.includes(service);
                                            return (
                                                <button
                                                    key={service}
                                                    type="button"
                                                    onClick={() => toggleService(service)}
                                                    className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${active ? "border-primary/35 bg-primary/10 text-primary" : "border-slate-300 bg-white text-slate-700 hover:bg-primary/5"}`}
                                                    aria-pressed={active}
                                                >
                                                    {service}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            <label className="block">
                                <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                    <UseTextHidden text="Message" />
                                </span>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-3 text-slate-400">
                                        <FaRegCommentDots className="text-[13px]" />
                                    </span>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us briefly what service you need"
                                        rows={4}
                                        maxLength={MESSAGE_MAX_CHARS}
                                        className={`w-full rounded-2xl border bg-white/95 pl-9 pr-3 py-2.5 md:py-3 text-[13px] md:text-sm text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.04)] outline-none resize-none transition-all ${message.length > 0 && !isMessageValid ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100" : "border-slate-300/90 focus:border-btnHover focus:ring-4 focus:ring-primary/15"}`}
                                        aria-invalid={message.length > 0 && !isMessageValid}
                                    />
                                </div>
                                <div
                                    className={`mt-1.5 flex items-center justify-between rounded-xl px-2.5 py-1 text-[11px] ${message.length > 0 && !isMessageValid ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}
                                >
                                    <span>
                                        <UseTextHidden text={`Min ${MESSAGE_MIN_CHARS} / Max ${MESSAGE_MAX_CHARS} characters`} />
                                    </span>
                                    <span>
                                        {messageLength}/{MESSAGE_MAX_CHARS}
                                    </span>
                                </div>
                            </label>
                        </div>
                    )}
                    {/* Paso 3: Imágenes y revisión/envío */}
                    {step === 3 && (
                        <div className={stepTransitionClass}>
                            <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-3.5 md:p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <p className="text-[13px] font-bold text-slate-800">
                                        <UseTextHidden text="Visual References" />
                                    </p>
                                    <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 border ${estimateImages.length === MAX_IMAGES ? "text-primary bg-primary/10 border-primary/30" : estimateImages.length > 0 ? "text-btnHover bg-btnHover/10 border-btnHover/30" : "text-slate-500 bg-slate-100 border-slate-200"}`}>
                                        {estimateImages.length}/{MAX_IMAGES} selected
                                    </span>
                                </div>
                                <div className="mb-3 space-y-1">
                                    <p className="text-[11px] font-semibold text-slate-600">
                                        <UseTextHidden text="Please share a photo of your project area." />
                                    </p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        <UseTextHidden text="These images help us understand the scope, recommend the right solution, and prepare a more accurate quote." />
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => galleryInputRef.current?.click()}
                                        disabled={estimateImages.length >= MAX_IMAGES}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-[12px] font-semibold text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaImages className="text-xs" />
                                        <UseTextHidden text="Gallery" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => cameraInputRef.current?.click()}
                                        disabled={estimateImages.length >= MAX_IMAGES}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-[12px] font-semibold text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaCamera className="text-xs" />
                                        <UseTextHidden text="Camera" />
                                    </button>
                                </div>
                                <input
                                    ref={galleryInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={async (e) => {
                                        await handleAddImages(e.target.files);
                                        e.currentTarget.value = "";
                                    }}
                                />
                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={async (e) => {
                                        await handleAddImages(e.target.files);
                                        e.currentTarget.value = "";
                                    }}
                                />
                                {estimateImages.length > 0 && (
                                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                                        {estimateImages.map((src, index) => (
                                            <div
                                                key={`${src.slice(0, 20)}-${index}`}
                                                className="group relative rounded-xl border border-slate-200 overflow-hidden bg-white shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Estimate image ${index + 1}`}
                                                    className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1.5 right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black/80"
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    <FaTrash className="text-[10px]" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Barra de progreso de imágenes */}
                                <div className="mt-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500"><UseTextHidden text="Images Progress" /></span>
                                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                                            <span
                                                className="block h-full transition-all duration-300"
                                                style={{
                                                    width: `${(estimateImages.length / MAX_IMAGES) * 100}%`,
                                                    background: estimateImages.length === MAX_IMAGES
                                                        ? "var(--tertiary)"
                                                        : estimateImages.length > 0
                                                        ? "var(--btn-color)"
                                                        : "#cbd5e1"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {imageStatus && (
                                    <p className="mt-2 text-[11px] text-slate-600">{imageStatus}</p>
                                )}
                            </div>
                            {/* Revisión y envío */}
                            <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-3 shadow-[0_8px_20px_rgba(15,23,42,0.06)] mt-2">
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-600">
                                        <UseTextHidden text="Form Progress" />
                                    </p>
                                    <span className="text-[11px] font-semibold text-slate-600">
                                        {completedRequiredFields}/{totalRequiredFields} <UseTextHidden text="required" />
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                                    <span
                                        className="block h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${completionPercent}%`,
                                            background: completionPercent === 100
                                                ? 'var(--tertiary)'
                                                : completionPercent > 0
                                                ? 'var(--btn-color)'
                                                : '#cbd5e1'
                                        }}
                                    />
                                </div>
                                <p className="mt-1.5 text-[10px] text-slate-500">
                                    {completionPercent}% <UseTextHidden text="complete. Photos are optional." />
                                </p>
                            </div>
                            {statusType && (
                                <div
                                    className={`rounded-xl px-3 py-2 text-sm ${statusType === "success" ? "bg-primary/10 text-primary border border-primary/30" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
                                >
                                    {statusMessage}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={!isValid || loading}
                                className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 md:py-3 text-[13px] md:text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_16px_34px_color-mix(in_srgb,var(--btn-color)_35%,transparent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_40px_color-mix(in_srgb,var(--btn-hover-color)_42%,transparent)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-btnColor hover:bg-btnHover"
                                style={{}}
                            >
                                <FaPaperPlane className="text-xs" />
                                {loading ? <UseTextHidden text="Sending..." /> : <UseTextHidden text="Send Estimated Pro" />}
                            </button>
                        </div>
                    )}
                    {/* Navegación entre pasos */}
                    <div className="flex justify-between mt-4">
                        {step > 1 && (
                            <button
                                type="button"
                                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                                onClick={() => setStep((s) => Math.max(1, s - 1))}
                            >
                                <FaChevronLeft /> <UseTextHidden text="Previous" />
                            </button>
                        )}
                        {step < 3 && (
                            <button
                                type="button"
                                className="ml-auto inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-btnColor text-white font-semibold hover:bg-btnHover disabled:opacity-50"
                                onClick={() => {
                                    if (step === 1 && isStep1Valid) setStep(2);
                                    else if (step === 2 && isStep2Valid) setStep(3);
                                }}
                                disabled={
                                    (step === 1 && !isStep1Valid) ||
                                    (step === 2 && !isStep2Valid)
                                }
                            >
                                <UseTextHidden text="Next" /> <FaChevronRight />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

function escapeHtml(input: string) {
    return String(input || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function normalizeLogoUrl(logo: string) {
    const safeLogo = String(logo || "").trim() || "/favicon.svg";
    if (typeof window === "undefined") return safeLogo;
    if (safeLogo.startsWith("http://") || safeLogo.startsWith("https://")) {
        return safeLogo;
    }
    if (safeLogo.startsWith("/")) {
        return `${window.location.origin}${safeLogo}`;
    }
    return `${window.location.origin}/${safeLogo}`;
}

function fileToDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () =>
            reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
    });
}

export default EstimatePro;