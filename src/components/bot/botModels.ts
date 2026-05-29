export interface RootObject {
    branding: Branding;
    contact: Contact;
    id: string;
    knowledge: Knowledge;
    metadata: Metadata;
    name: string;
    settings: Settings;
    website: string;
}

export type ApiChatbotPayload = Partial<RootObject> & {
    branding?: Partial<Branding>;
    contact?: Partial<Contact> & {
        insurance?: Partial<Insurance>;
        openingHours?: Array<Partial<OpeningHour>>;
    };
    knowledge?: Partial<Knowledge> & {
        faqs?: Array<Partial<FAQ>>;
        services?: Array<Partial<Service>>;
    };
    metadata?: Partial<Metadata> & {
        creationDate?: string | Date;
        lastEditedDate?: string | Date;
    };
    settings?: Partial<Settings> & {
        insuranceWidget?: boolean;
        insuredWidget?: boolean;
        licenseWidget?: boolean;
        licenseWidgetEnabled?: boolean;
    };
};

export interface Branding {
    botName: string;
    logoUrl: string;
    primaryColor: string;
    welcomeMessage: string;
}

export interface Contact {
    coverageAreas: string[];
    emails: string[];
    freeEstimates: boolean;
    insurance: Insurance;
    openingHours: OpeningHour[];
    phones: string[];
}

export interface Insurance {
    isInsured: boolean;
    license: string;
}

export interface OpeningHour {
    days: string;
    hours: string;
}

export interface Knowledge {
    faqs: FAQ[];
    services: Service[];
}

export interface FAQ {
    answer: string;
    question: string;
}

export interface ServiceDescriptionBlock {
    image: string[];
    text: string;
    tipoImages?: string;
    _id?: string;
}

export interface Service {
    title: string;
    description: ServiceDescriptionBlock[];
}

export interface Metadata {
    creationDate: string;
    lastEditedDate: string;
}

export interface Settings {
    audioEnabled: boolean;
    autoOpen: boolean;
    avatarVisible: boolean;
    emailCapture: boolean;
    licenseWidgetEnabled: boolean;
}

const safeString = (value: unknown, fallback = ""): string => {
    if (typeof value !== "string") {
        return fallback;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
};

const safeStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => safeString(item))
        .filter((item) => item.length > 0);
};

const safeBoolean = (value: unknown, fallback = false): boolean => {
    if (typeof value === "boolean") {
        return value;
    }

    return fallback;
};

const toIsoString = (value: unknown): string => {
    if (typeof value === "string") {
        const parsedDate = new Date(value);
        if (!Number.isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString();
        }
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString();
    }

    return "";
};

export const mapChatbotPayload = (payload: unknown): RootObject => {
    const source = (payload ?? {}) as ApiChatbotPayload;

    return {
        id: safeString(source.id),
        name: safeString(source.name, "Landscape Assistant"),
        website: safeString(source.website),
        branding: {
            botName: safeString(source.branding?.botName, "Assistant"),
            logoUrl: safeString(source.branding?.logoUrl),
            primaryColor: safeString(source.branding?.primaryColor, "#0f766e"),
            welcomeMessage: safeString(source.branding?.welcomeMessage, "Hi! How can I help you today?"),
        },
        contact: {
            coverageAreas: safeStringArray(source.contact?.coverageAreas),
            emails: safeStringArray(source.contact?.emails),
            freeEstimates: safeBoolean(source.contact?.freeEstimates),
            insurance: {
                isInsured: safeBoolean(source.contact?.insurance?.isInsured),
                license: safeString(source.contact?.insurance?.license),
            },
            openingHours: Array.isArray(source.contact?.openingHours)
                ? source.contact?.openingHours
                    .map((entry) => ({
                        days: safeString(entry?.days),
                        hours: safeString(entry?.hours),
                    }))
                    .filter((entry) => entry.days.length > 0 || entry.hours.length > 0)
                : [],
            phones: safeStringArray(source.contact?.phones),
        },
        knowledge: {
            faqs: Array.isArray(source.knowledge?.faqs)
                ? source.knowledge.faqs
                    .map((faq) => ({
                        question: safeString(faq?.question),
                        answer: safeString(faq?.answer),
                    }))
                    .filter((faq) => faq.question.length > 0 || faq.answer.length > 0)
                : [],
            services: Array.isArray(source.knowledge?.services)
                ? source.knowledge.services
                    .map((service) => ({
                        title: safeString(service?.title),
                        description: Array.isArray(service?.description)
                            ? service.description.map((descBlock) => ({
                                image: Array.isArray(descBlock?.image) ? descBlock.image.map((img) => safeString(img)) : [],
                                text: safeString(descBlock?.text),
                                tipoImages: safeString(descBlock?.tipoImages),
                                _id: safeString(descBlock?._id),
                            })).filter((block) => block.text.length > 0 || block.image.length > 0)
                            : [],
                    }))
                    .filter((service) => service.title.length > 0 || service.description.length > 0)
                : [],
        },
        settings: {
            autoOpen: safeBoolean(source.settings?.autoOpen),
            emailCapture: safeBoolean(source.settings?.emailCapture),
            avatarVisible: safeBoolean(source.settings?.avatarVisible),
            audioEnabled: safeBoolean(source.settings?.audioEnabled),
            licenseWidgetEnabled: safeBoolean(
                source.settings?.licenseWidgetEnabled
                ?? source.settings?.licenseWidget
                ?? source.settings?.insuranceWidget
                ?? source.settings?.insuredWidget,
                true,
            ),
        },
        metadata: {
            creationDate: toIsoString(source.metadata?.creationDate),
            lastEditedDate: toIsoString(source.metadata?.lastEditedDate),
        },
    };
};
