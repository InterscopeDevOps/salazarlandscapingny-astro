import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaCommentDots, FaPaperPlane, FaPhoneAlt, FaRobot, FaTimes, FaWhatsapp } from "react-icons/fa";
import { mapChatbotPayload, type OpeningHour, type RootObject } from "./botModels";

const CHATBOT_API_URL = "https://widget-wizzard.netlify.app/api/chat/1WmiO1V08dcaZrLGRMoM";
const CHATBOT_CONVERSATION_API_URL = `${CHATBOT_API_URL}/conversation`;
const CHAT_MESSAGES_BACKGROUND_IMAGE = "/assets/images/404Img/bg-services.jpg";

type MessageFrom = "bot" | "user";
type Channel = "whatsapp" | "text" | "call";
type ChatActionId =
    | "services"
    | "faqs"
    | "contact"
    | "hours"
    | "areas"
    | "estimate"
    | "insured"
    | "reset";

interface ChatAction {
    id: ChatActionId;
    label: string;
}

interface ChatMessage {
    id: number;
    from: MessageFrom;
    text: string;
    animateTyping?: boolean;
    actions?: ChatAction[];
}

type TranscriptMessage = Pick<ChatMessage, "from" | "text">;
type TranscriptLanguage = "es" | "en";

interface TranscriptOptions {
    language: TranscriptLanguage;
    channel?: Channel;
    phone?: string;
}

const defaultActions: ChatAction[] = [
    { id: "services", label: "Services" },
    { id: "faqs", label: "FAQs" },
    { id: "contact", label: "Contact" },
    { id: "hours", label: "Hours" },
    { id: "areas", label: "Coverage" },
    { id: "estimate", label: "Free estimate?" },
    { id: "insured", label: "License & insured?" },
];

const commonQuestionActions: ChatAction[] = [
    { id: "services", label: "What are your main services?" },
    { id: "insured", label: "Are your services insured?" },
    { id: "hours", label: "What are your business hours?" },
    { id: "areas", label: "What areas do you cover?" },
    { id: "reset", label: "Main menu" },
];

const filterLicenseAction = (actions: ChatAction[], showLicenseWidget: boolean): ChatAction[] => {
    if (showLicenseWidget) {
        return actions;
    }

    return actions.filter((action) => action.id !== "insured");
};

const EMAIL_SPLIT_REGEX = /(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)/g;
const EMAIL_EXACT_REGEX = /^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/;

const renderMessageTextWithEmailLinks = (text: string, from: MessageFrom) => {
    // Si el texto contiene <img ...>, renderizarlo como HTML seguro solo para imágenes
    if (/<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(text)) {
        // Sanitizar: solo permitir <img ...> y reemplazar saltos de línea por <br />
        const safeHtml = text
            .replace(/\n/g, '<br />')
            .replace(/<img([^>]*)on\w+=["'][^"']*["']/gi, '<img$1'); // Eliminar onerror/onload
        return (
            <span className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: safeHtml }} />
        );
    }

    const emailClassName =
        from === "user"
            ? "underline decoration-white/80 underline-offset-2 break-all"
            : "font-semibold text-sky-700 underline decoration-sky-500/70 underline-offset-2 break-all hover:text-sky-800";

    return (
        <span className="whitespace-pre-line">
            {text.split(EMAIL_SPLIT_REGEX).map((part, index) => {
                if (EMAIL_EXACT_REGEX.test(part)) {
                    return (
                        <a
                            key={`${part}-${index}`}
                            href={`mailto:${part}`}
                            className={emailClassName}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {part}
                        </a>
                    );
                }
                return <span key={`${part}-${index}`}>{part}</span>;
            })}
        </span>
    );
};

const MAX_CHARS = 400;
const MAX_SHARE_MESSAGE_CHARS = 3200;

const getPreferredTranscriptLanguage = (): TranscriptLanguage => {
    if (typeof window === "undefined") {
        return "en";
    }

    try {
        const saved = window.localStorage.getItem("site-lang");
        if (saved === "es" || saved === "en") {
            return saved;
        }
    } catch {
        // Ignore localStorage issues and fallback to browser language.
    }

    return window.navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
};

const formatConversationTranscript = (
    conversation: TranscriptMessage[],
    assistantName: string,
    options: TranscriptOptions,
): string => {
    const labels = options.language === "es"
        ? {
            title: "RESUMEN DE CHAT",
            generated: "Generado",
            contact: "Contacto",
            channel: "Canal",
            messages: "MENSAJES",
            customer: "CLIENTE",
            whatsapp: "WhatsApp",
            text: "SMS",
            call: "Llamada",
        }
        : {
            title: "CHAT SUMMARY",
            generated: "Generated",
            contact: "Contact",
            channel: "Channel",
            messages: "MESSAGES",
            customer: "CUSTOMER",
            whatsapp: "WhatsApp",
            text: "SMS",
            call: "Call",
        };

    const channelLabel = options.channel
        ? {
            whatsapp: labels.whatsapp,
            text: labels.text,
            call: labels.call,
        }[options.channel]
        : null;

    const generatedAt = new Date().toLocaleString(options.language === "es" ? "es-ES" : "en-US");
    const header = [
        `${labels.title} | ${assistantName}`,
        `${labels.generated}: ${generatedAt}`,
        options.phone ? `${labels.contact}: ${options.phone}` : null,
        channelLabel ? `${labels.channel}: ${channelLabel}` : null,
        "----------------------------------------",
        "",
        labels.messages,
    ]
        .filter((line): line is string => Boolean(line))
        .join("\n");

    const body = conversation
        .map((message, index) => {
            const author = message.from === "user" ? labels.customer : assistantName.toUpperCase();
            const cleanText = message.text.replace(/\s+/g, " ").trim();

            return `${index + 1}. ${author}: ${cleanText}`;
        })
        .join("\n");

    return `${header}\n${body}`.trim();
};

const truncateForShare = (text: string, maxChars: number): string => {
    if (text.length <= maxChars) {
        return text;
    }

    return `${text.slice(0, maxChars - 40)}\n\n[Transcript truncated]`;
};

const TypewriterText = ({
    text,
    speed = 18,
    onDone,
    onProgress,
}: {
    text: string;
    speed?: number;
    onDone?: () => void;
    onProgress?: () => void;
}) => {
    const [visibleText, setVisibleText] = useState("");
    const onDoneRef = useRef(onDone);
    const onProgressRef = useRef(onProgress);

    useEffect(() => {
        onDoneRef.current = onDone;
    }, [onDone]);

    useEffect(() => {
        onProgressRef.current = onProgress;
    }, [onProgress]);

    useEffect(() => {
        setVisibleText("");

        if (!text) {
            onDoneRef.current?.();
            return;
        }

        let index = 0;
        const intervalId = window.setInterval(() => {
            index += 1;
            setVisibleText(text.slice(0, index));
            onProgressRef.current?.();

            if (index >= text.length) {
                window.clearInterval(intervalId);
                onDoneRef.current?.();
            }
        }, speed);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [text, speed]);

    return <span className="whitespace-pre-line">{visibleText}</span>;
};

const BotTyping = () => {
    return (
        <div className="max-w-[86%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
            <div className="flex items-center gap-1">
                <span>Typing</span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
            </div>
        </div>
    );
};

const sanitizePhoneForUrl = (phone: string): string => {
    return phone.replace(/[^+\d]/g, "");
};

const buildWhatsAppUrl = (phone: string, message: string): string => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
};

const buildSmsUrl = (phone: string, message: string): string => {
    const encodedMessage = encodeURIComponent(message);
    return `sms:${phone}${encodedMessage ? `?body=${encodedMessage}` : ""}`;
};

const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

const toMinutes = (hourText: string): number | null => {
    const match = hourText.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
        return null;
    }

    const rawHour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3].toUpperCase();

    if (Number.isNaN(rawHour) || Number.isNaN(minute) || rawHour < 1 || rawHour > 12 || minute > 59) {
        return null;
    }

    const normalizedHour = period === "AM" ? (rawHour % 12) : (rawHour % 12) + 12;
    return normalizedHour * 60 + minute;
};

const parseDays = (days: string): number[] => {
    const normalized = days.toLowerCase().trim();

    if (normalized.includes("-") || normalized.includes("to")) {
        const parts = normalized.split(/-|to/).map((part) => part.trim());
        const start = dayMap[parts[0]];
        const end = dayMap[parts[1]];

        if (start === undefined || end === undefined) {
            return [];
        }

        if (start <= end) {
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }

        return [...Array.from({ length: 7 - start }, (_, i) => start + i), ...Array.from({ length: end + 1 }, (_, i) => i)];
    }

    if (normalized.includes(",")) {
        return normalized
            .split(",")
            .map((part) => dayMap[part.trim()])
            .filter((day): day is number => day !== undefined);
    }

    const day = dayMap[normalized];
    return day === undefined ? [] : [day];
};

const isWithinBusinessHours = (openingHours: OpeningHour[]): boolean => {
    if (!openingHours.length) {
        return true;
    }

    const now = new Date();
    const today = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return openingHours.some((entry) => {
        const activeDays = parseDays(entry.days);
        if (!activeDays.includes(today)) {
            return false;
        }

        const [startText, endText] = entry.hours.split("-").map((part) => part.trim());
        if (!startText || !endText) {
            return false;
        }

        const start = toMinutes(startText);
        const end = toMinutes(endText);

        if (start === null || end === null) {
            return false;
        }

        return currentMinutes >= start && currentMinutes <= end;
    });
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatbotData, setChatbotData] = useState<RootObject | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typedMessageIds, setTypedMessageIds] = useState<Set<number>>(new Set());
    const [isBotThinking, setIsBotThinking] = useState(false);
    const [draftMessage, setDraftMessage] = useState("");
    const [channel, setChannel] = useState<Channel>("whatsapp");
    const [selectedPhoneIndex, setSelectedPhoneIndex] = useState(0);

    const messageIdRef = useRef(1);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const lastSyncedConversationRef = useRef("");
    const syncTimeoutRef = useRef<number | null>(null);

    const accentColor = useMemo(() => {
        return chatbotData?.branding.primaryColor || "#0f766e";
    }, [chatbotData]);

    const phoneOptions = useMemo(() => {
        return chatbotData?.contact.phones || [];
    }, [chatbotData]);

    const selectedPhone = useMemo(() => {
        return phoneOptions[selectedPhoneIndex] || phoneOptions[0] || "";
    }, [phoneOptions, selectedPhoneIndex]);

    const selectedPhoneUrl = useMemo(() => {
        return sanitizePhoneForUrl(selectedPhone);
    }, [selectedPhone]);

    const isBotOnline = useMemo(() => {
        if (isLoading || Boolean(error)) {
            return false;
        }

        return Boolean(chatbotData);
    }, [chatbotData, isLoading, error]);

    const showLicenseWidget = chatbotData?.settings.licenseWidgetEnabled ?? true;

    const addMessage = (message: Omit<ChatMessage, "id">) => {
        const id = messageIdRef.current;
        messageIdRef.current += 1;
        setMessages((current) => [...current, { ...message, id }]);
    };

    const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    }, []);

    const handleTypewriterProgress = useCallback(() => {
        scrollToBottom("auto");
    }, [scrollToBottom]);

    const handleTypewriterDone = useCallback((messageId: number) => {
        setTypedMessageIds((current) => {
            if (current.has(messageId)) {
                return current;
            }

            const updated = new Set(current);
            updated.add(messageId);
            return updated;
        });
    }, []);

    const addBotMessage = (text: string, actions: ChatAction[] = defaultActions) => {
        setIsBotThinking(true);
        const safeActions = filterLicenseAction(actions, showLicenseWidget);

        window.setTimeout(() => {
            setIsBotThinking(false);
            addMessage({ from: "bot", text, animateTyping: true, actions: safeActions });
        }, 500);
    };

    const loadChatbotData = async (signal?: AbortSignal) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(CHATBOT_API_URL, { signal });
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const payload: unknown = await response.json();
            const mappedPayload = mapChatbotPayload(payload);
            setChatbotData(mappedPayload);
            setTypedMessageIds(new Set());

            messageIdRef.current = 4;
            setMessages([
                {
                    id: 1,
                    from: "bot",
                    text: `Welcome to ${mappedPayload.name}!`,
                },
             
                {
                    id: 2,
                    from: "bot",
                    text: mappedPayload.branding.welcomeMessage || "How can I help you today?",
                    animateTyping: true,
                    actions: filterLicenseAction(defaultActions, mappedPayload.settings.licenseWidgetEnabled),
                },
            ]);

            if (mappedPayload.settings.autoOpen) {
                setIsOpen(true);
            }
        } catch (requestError) {
            if (requestError instanceof Error && requestError.name === "AbortError") {
                return;
            }

            setError("We could not load assistant data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const abortController = new AbortController();
        void loadChatbotData(abortController.signal);

        return () => {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        scrollToBottom("smooth");
    }, [messages, isBotThinking, scrollToBottom]);

    useEffect(() => {
        if (isLoading || Boolean(error) || !chatbotData || messages.length === 0) {
            return;
        }

        const conversation: TranscriptMessage[] = messages.map((message) => ({
            from: message.from,
            text: message.text,
        }));

        const fingerprint = JSON.stringify(conversation);
        if (fingerprint === lastSyncedConversationRef.current) {
            return;
        }

        if (syncTimeoutRef.current) {
            window.clearTimeout(syncTimeoutRef.current);
        }

        syncTimeoutRef.current = window.setTimeout(() => {
            const transcript = formatConversationTranscript(conversation, chatbotData.name || "Assistant", {
                language: getPreferredTranscriptLanguage(),
            });

            void fetch(CHATBOT_CONVERSATION_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatbotId: chatbotData.id,
                    name: chatbotData.name,
                    transcript,
                    messages: conversation,
                    syncedAt: new Date().toISOString(),
                }),
            }).catch(() => {
                // Keep UI responsive even if transcript sync endpoint is unavailable.
            });

            lastSyncedConversationRef.current = fingerprint;
            syncTimeoutRef.current = null;
        }, 700);

        return () => {
            if (syncTimeoutRef.current) {
                window.clearTimeout(syncTimeoutRef.current);
                syncTimeoutRef.current = null;
            }
        };
    }, [messages, chatbotData, isLoading, error]);

    useEffect(() => {
        setSelectedPhoneIndex((current) => {
            if (phoneOptions.length === 0) {
                return 0;
            }

            return Math.min(current, phoneOptions.length - 1);
        });
    }, [phoneOptions]);

    const handleAction = (actionId: ChatActionId, label: string) => {
        if (!chatbotData) {
            return;
        }

        if (actionId === "insured" && !showLicenseWidget) {
            return;
        }

        addMessage({ from: "user", text: label });

        if (actionId === "reset") {
            addBotMessage("Back to menu. What do you want to explore first?");
            return;
        }

        if (actionId === "services") {
            const services = chatbotData.knowledge.services.slice(0, 5);
            if (services.length === 0) {
                addBotMessage(
                    "No services listed yet.",
                    [
                        { id: "faqs", label: "Show common questions" },
                        { id: "contact", label: "Talk to someone" },
                        { id: "reset", label: "Main menu" },
                    ],
                );
                return;
            }

            // Mostrar lista de servicios como acciones para seleccionar
            addBotMessage(
                `Here are our main services:\n${services.map((s, i) => `${i + 1}. ${s.title}`).join("\n")}`,
                [
                    ...services.map((s, i) => ({ id: `service_${i}` as ChatActionId, label: s.title })),
                    { id: "faqs", label: "Show common questions" },
                    { id: "contact", label: "Talk to someone" },
                    { id: "reset", label: "Main menu" },
                ],
            );
            return;
        }

        // Manejar selección de un servicio
        if (/^service_\d+$/.test(actionId)) {
            const idx = Number(actionId.replace("service_", ""));
            const service = chatbotData.knowledge.services[idx];
            if (!service) return;

            // Mostrar primero el texto, luego la imagen como mensaje separado
            let detailText = `**${service.title}**`;
            let images: string[] = [];
            service.description.forEach((block) => {
                if (block.text) {
                    detailText += `\n${block.text}`;
                }
                if (block.image && block.image.length > 0) {
                    images.push(...block.image.map((img) => `<img src=\"${img}\" alt=\"${service.title}\" style=\"max-width:100%;border-radius:1rem;margin-bottom:0.5rem;\" />`));
                }
            });
            addBotMessage(detailText, [
                { id: "services", label: "Back to services" },
                { id: "reset", label: "Main menu" },
            ]);

            // Mostrar cada imagen como mensaje separado, con un pequeño delay
            if (images.length > 0) {
                images.forEach((imgHtml, i) => {
                    setTimeout(() => {
                        addBotMessage(imgHtml, [
                            { id: "services", label: "Back to services" },
                            { id: "reset", label: "Main menu" },
                        ]);
                    }, 800 * (i + 1));
                });
            }
            return;
        }

        if (actionId === "faqs") {
            const faqPreview = chatbotData.knowledge.faqs
                .slice(0, 4)
                .map((faq) => `- ${faq.question}`)
                .join("\n");

            addBotMessage(
                `Most common questions:\n${faqPreview || "No FAQs available right now."}`,
                commonQuestionActions,
            );
            return;
        }

        if (actionId === "contact") {
            const phones = chatbotData.contact.phones.join(" | ") || "No phone listed";
            const emails = chatbotData.contact.emails.join(" | ") || "No email listed";
            addBotMessage(
                `You can reach us here:\nPhone: ${phones}\nEmail: ${emails}`,
                [
                    { id: "estimate", label: "Do you offer estimates?" },
                    { id: "insured", label: "License & insured?" },
                    { id: "areas", label: "Coverage areas" },
                    { id: "reset", label: "Main menu" },
                ],
            );
            return;
        }

        if (actionId === "hours") {
            const schedule = chatbotData.contact.openingHours
                .map((item) => `${item.days}: ${item.hours}`)
                .join("\n");

            addBotMessage(
                `Our business hours:\n${schedule || "No opening hours available."}`,
                [
                    { id: "contact", label: "Contact details" },
                    { id: "estimate", label: "Free estimate" },
                    { id: "insured", label: "License & insured?" },
                    { id: "reset", label: "Main menu" },
                ],
            );
            return;
        }

        if (actionId === "areas") {
            const areas = chatbotData.contact.coverageAreas.join("\n") || "No coverage areas listed yet.";

            addBotMessage(
                `We currently serve:\n${areas}`,
                [
                    { id: "estimate", label: "Free estimate" },
                    { id: "contact", label: "Contact details" },
                    { id: "insured", label: "License & insured?" },
                    { id: "reset", label: "Main menu" },
                ],
            );
            return;
        }

        if (actionId === "estimate") {
            const insured = chatbotData.contact.insurance.isInsured ? "Yes" : "No";
            const freeEstimate = chatbotData.contact.freeEstimates ? "Yes" : "No";
            const license = chatbotData.contact.insurance.license;
            let licenseMessage = license && license.trim().length > 0
                ? license
                : "";
            if (!licenseMessage || licenseMessage.trim().length === 0) {
                licenseMessage = "Pending validation.";
            }

            addBotMessage(
                `Free estimates: ${freeEstimate}\nInsured: ${insured}\nLicense: ${licenseMessage}`,
                [
                    { id: "contact", label: "Contact now" },
                    { id: "insured", label: "License & insured?" },
                    { id: "hours", label: "Business hours" },
                    { id: "reset", label: "Main menu" },
                ],
            );
            return;
        }

        if (actionId === "insured") {
            const license = chatbotData.contact.insurance.license;
            let licenseMessage = license && license.trim().length > 0
                ? license
                : "";
            if (!licenseMessage || licenseMessage.trim().length === 0) {
                licenseMessage = "Pending validation.";
            }
            addBotMessage(
                `Insured: ${chatbotData.contact.insurance.isInsured ? "Yes" : "No"}\nLicense: ${licenseMessage}`,
                [
                    { id: "estimate", label: "Free estimate" },
                    { id: "contact", label: "Contact details" },
                    { id: "reset", label: "Main menu" },
                ],
            );
            return;
        }
    };

    const handlePrimaryAction = () => {
        const message = draftMessage.trim();

        if (!selectedPhoneUrl) {
            return;
        }

        if (channel === "call") {
            window.location.href = `tel:${selectedPhoneUrl}`;
            return;
        }

        if (!message) {
            return;
        }

        const conversationForShare: TranscriptMessage[] = [
            ...messages.map((item) => ({ from: item.from, text: item.text })),
            { from: "user", text: message },
        ];
        const language = getPreferredTranscriptLanguage();
        const transcript = truncateForShare(
            formatConversationTranscript(conversationForShare, chatbotData?.name || "Assistant", {
                language,
                channel,
                phone: selectedPhone,
            }),
            MAX_SHARE_MESSAGE_CHARS,
        );

        addMessage({ from: "user", text: message });
        setDraftMessage("");

        if (channel === "whatsapp") {
            window.open(buildWhatsAppUrl(selectedPhoneUrl, transcript), "_blank", "noopener,noreferrer");

            addBotMessage(
                "Perfect. I opened WhatsApp with the full conversation so you can send it right away.",
                [
                    { id: "contact", label: "Contact details" },
                    { id: "hours", label: "Business hours" },
                    { id: "reset", label: "Main menu" },
                ],
            );
            return;
        }

        window.location.href = buildSmsUrl(selectedPhoneUrl, transcript);

        addBotMessage(
            "Great. I opened your text app with the full conversation ready.",
            [
                { id: "contact", label: "Contact details" },
                { id: "hours", label: "Business hours" },
                { id: "reset", label: "Main menu" },
            ],
        );
    };

    const isMessageChannel = channel !== "call";
    const isPrimaryActionDisabled =
        isLoading || Boolean(error) || !selectedPhoneUrl || (isMessageChannel && !draftMessage.trim());

    const quickActions = filterLicenseAction(messages[messages.length - 1]?.actions || defaultActions, showLicenseWidget);

    return (
        <section className="pointer-events-none fixed inset-0 z-50 ">
            <div className="absolute bottom-4 left-4 flex w-[calc(100vw-1rem)]  max-w-sm flex-col items-start gap-3 sm:w-[31rem]">
                <article
                    className={`flex h-[500px] max-h-[calc(100vh-6rem)]  w-full origin-bottom-left flex-col overflow-hidden rounded-[1.8rem] border border-slate-300 bg-[#eff1f4] shadow-[0_20px_45px_rgba(15,23,42,0.30)] transition-all duration-300 ${
                        isOpen
                            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                            : "pointer-events-none translate-y-5 scale-95 opacity-0"
                    }`}
                >
                    <header
                        className="flex items-start justify-between  px-5 pb-4 pt-4 text-white"
                        style={{ backgroundColor: accentColor }}
                    >
                        <div className="flex items-center gap-3">
                            {chatbotData?.branding.logoUrl ? (
                                <img
                                    src={chatbotData.branding.logoUrl}
                                    alt={chatbotData.branding.botName}
                                    className="h-11 w-11 rounded-full border-2 border-white/80 bg-white object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 bg-white text-slate-700">
                                    <FaRobot className="text-xl" aria-hidden="true" />
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/85">Live Chat</p>
                                <p className="mt-1 text-[2rem] leading-none font-bold text-white sm:text-[1.1rem]">
                                    {chatbotData?.name || "Assistant"}
                                </p>
                                <p
                                    className={`mt-1 flex items-center gap-1 text-xs ${
                                        isBotOnline ? "text-white/85" : "text-red-200"
                                    }`}
                                >
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span
                                            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                                                isBotOnline ? "bg-emerald-300" : "bg-red-300"
                                            }`}
                                        />
                                        <span
                                            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                                                isBotOnline ? "bg-emerald-300" : "bg-red-500"
                                            }`}
                                        />
                                    </span>
                                    {isBotOnline ? "Online now" : "Offline"}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="mt-1 rounded-full p-1 transition hover:bg-white/15"
                            aria-label="Close chatbot"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </header>

                    <div className="chatbot-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y">
                        <div
                            className="space-y-3 p-4"
                            style={{
                                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.24) 0%, rgba(15, 23, 42, 0.18) 100%), url(${CHAT_MESSAGES_BACKGROUND_IMAGE})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            {isLoading && (
                                <div className="animate-pulse rounded-xl bg-slate-200 p-3 text-sm text-slate-600">
                                    Loading your assistant...
                                </div>
                            )}

                            {!isLoading && error && (
                                <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    <p>{error}</p>
                                    <button
                                        type="button"
                                        onClick={() => void loadChatbotData()}
                                        className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {!isLoading && !error && (
                                <>
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.from === "bot" ? "justify-start" : "justify-end"}`}
                                        >
                                            <div className={`flex max-w-[92%] items-end gap-2 ${message.from === "user" ? "flex-row-reverse" : ""}`}>
                                                {message.from === "bot" && (
                                                    <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-slate-300 bg-white">
                                                        {chatbotData?.branding.logoUrl ? (
                                                            <img
                                                                src={chatbotData.branding.logoUrl}
                                                                alt="Bot avatar"
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-slate-600">
                                                                <FaRobot className="text-sm" aria-hidden="true" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div
                                                    className={`rounded-2xl px-3 py-2.5 text-sm shadow-sm ${
                                                        message.from === "bot"
                                                            ? "rounded-bl-md border border-slate-300 bg-white text-slate-700"
                                                            : "rounded-br-md text-white"
                                                    }`}
                                                    style={message.from === "user" ? { backgroundColor: accentColor } : undefined}
                                                >
                                                    {/* Si el mensaje contiene una imagen, mostrarla directamente sin animación */}
                                                    {message.from === "bot" && /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(message.text)
                                                        ? renderMessageTextWithEmailLinks(message.text, message.from)
                                                        : message.animateTyping && !typedMessageIds.has(message.id)
                                                            ? (
                                                                <TypewriterText
                                                                    text={message.text}
                                                                    onDone={() => handleTypewriterDone(message.id)}
                                                                    onProgress={handleTypewriterProgress}
                                                                />
                                                            )
                                                            : renderMessageTextWithEmailLinks(message.text, message.from)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {isBotThinking && (
                                        <div className="flex justify-start">
                                            <div className="flex items-end gap-2">
                                                <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-slate-300 bg-white">
                                                    {chatbotData?.branding.logoUrl ? (
                                                        <img
                                                            src={chatbotData.branding.logoUrl}
                                                            alt="Bot avatar"
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-600">
                                                            <FaRobot className="text-sm" aria-hidden="true" />
                                                        </div>
                                                    )}
                                                </div>
                                                <BotTyping />
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        <div className="border-t border-slate-300 bg-white p-4">
                            {phoneOptions.length > 1 && (
                                <div className="flex flex-wrap gap-2">
                                    {phoneOptions.map((phone, index) => (
                                        <button
                                            key={`${phone}-${index}`}
                                            type="button"
                                            onClick={() => setSelectedPhoneIndex(index)}
                                            aria-pressed={selectedPhoneIndex === index}
                                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                                selectedPhoneIndex === index
                                                    ? "border-transparent text-white"
                                                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                                            }`}
                                            style={selectedPhoneIndex === index ? { backgroundColor: accentColor } : undefined}
                                        >
                                            {phone}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => setChannel("whatsapp")}
                                    aria-pressed={channel === "whatsapp"}
                                    className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                                        channel === "whatsapp"
                                            ? "border-transparent text-white"
                                            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                                    style={channel === "whatsapp" ? { backgroundColor: accentColor } : undefined}
                                >
                                    <FaWhatsapp />
                                    WhatsApp
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChannel("text")}
                                    aria-pressed={channel === "text"}
                                    className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                                        channel === "text"
                                            ? "border-transparent text-white"
                                            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                                    style={channel === "text" ? { backgroundColor: accentColor } : undefined}
                                >
                                    <FaCommentDots />
                                    Text
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChannel("call")}
                                    aria-pressed={channel === "call"}
                                    className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                                        channel === "call"
                                            ? "border-transparent text-white"
                                            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                                    style={channel === "call" ? { backgroundColor: accentColor } : undefined}
                                >
                                    <FaPhoneAlt />
                                    Call
                                </button>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.id}
                                        type="button"
                                        onClick={() => handleAction(action.id, action.label)}
                                        disabled={isLoading || Boolean(error) || isBotThinking}
                                        className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>

                            {isMessageChannel ? (
                                <>
                                    <label htmlFor="chatbot-message" className="mt-3 block text-xs font-semibold text-slate-500">
                                        Your message
                                    </label>
                                    <textarea
                                        id="chatbot-message"
                                        rows={3}
                                        maxLength={MAX_CHARS}
                                        value={draftMessage}
                                        onChange={(event) => setDraftMessage(event.target.value)}
                                        placeholder={
                                            channel === "whatsapp"
                                                ? "Write your WhatsApp message..."
                                                : "Write your text message..."
                                        }
                                        className="mt-2 w-full resize-none rounded-2xl border border-slate-300 bg-[#f9fafb] px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400"
                                    />

                                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                                        <span>Channel: {channel === "whatsapp" ? "WhatsApp" : "Text"}</span>
                                        <span>
                                            {draftMessage.length}/{MAX_CHARS}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                                    Ready to call {selectedPhone || "this number"}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handlePrimaryAction}
                                disabled={isPrimaryActionDisabled}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-lg font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                                style={{ backgroundColor: accentColor }}
                            >
                                {channel === "call" ? <FaPhoneAlt className="text-base" /> : <FaPaperPlane className="text-base" />}
                                {channel === "whatsapp" ? "Send message" : channel === "text" ? "Write now" : "Call now"}
                            </button>
                        </div>
                    </div>
                </article>

                <button
                    type="button"
                    onClick={() => setIsOpen((current) => !current)}
                    className="pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl ring-4 ring-white/80 transition-transform duration-300 hover:scale-105"
                    style={{ backgroundColor: accentColor }}
                    aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
                >
                    {isOpen ? <FaTimes className="text-xl" /> : <i className="fa-duotone fa-solid fa-user-headset text-2xl" aria-hidden="true"></i> }
                </button>
            </div>

            <style>{`
                .chatbot-scroll {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .chatbot-scroll::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                    display: none;
                }
            `}</style>
        </section>
    );
}
