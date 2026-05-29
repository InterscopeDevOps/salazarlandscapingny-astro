import type { ApiData, SectionsHomeAbout } from "@/interfaces/dbData";

interface DigitalLinksProps {
    dataGlobal: ApiData;
    dataBlocks: SectionsHomeAbout[];

}
export default function DigitalLinks({ dataGlobal, dataBlocks }: DigitalLinksProps) {

    // Mapeo de colores por red social
    const socialColors: Record<string, string> = {
        Facebook: '#1877F3',
        Instagram: '#E4405F',
        WhatsApp: '#25D366',
        Twitter: '#1DA1F2',
        LinkedIn: '#0077B5',
        YouTube: '#FF0000',
        TikTok: '#000000',
        Pinterest: '#E60023',
        Telegram: '#0088cc',
        EzLocal: '#6C757D',
        Buildzoom: '#2E8B57',
        Houzz: '#4DBC15',
        Porch: '#F7B32B',
        Merchantcircle: '#3B3B98',
        Youtube: '#FF0000',
        Vimeo: '#1AB7EA',
            'Google My Business': '#4285F4',
        // Puedes agregar más directorios aquí
    };

        // GMB primero si existe, luego redes sociales y directorios
        let combinedArray = [...dataGlobal.redesSociales, ...dataGlobal.directorios];
        if (dataGlobal.gmb) {
            combinedArray = [
                {
                    _id: 'gmb',
                    name: 'Google My Business',
                    link: dataGlobal.gmb,
                    icon: '',
                    logo: '',
                },
                ...combinedArray
            ];
        }

    // Font Awesome iconos
    // Ejemplo: <i className="fa-brands fa-facebook-f"></i>
    // Para directorios: globo terráqueo <i className="fa-solid fa-globe"></i>
    const socialNames = [
        "Facebook", "Instagram", "WhatsApp", "Twitter", "LinkedIn", "YouTube", "TikTok", "Pinterest", "Telegram", "Youtube"
    ];

    const iconMap: Record<string, JSX.Element> = {
        Facebook: <i className="fa-brands fa-facebook-f text-2xl" />,
        Instagram: <i className="fa-brands fa-instagram text-2xl" />,
        WhatsApp: <i className="fa-brands fa-whatsapp text-2xl" />,
        Twitter: <i className="fa-brands fa-twitter text-2xl" />,
        LinkedIn: <i className="fa-brands fa-linkedin-in text-2xl" />,
        YouTube: <i className="fa-brands fa-youtube text-2xl" />,
        TikTok: <i className="fa-brands fa-tiktok text-2xl" />,
        Pinterest: <i className="fa-brands fa-pinterest-p text-2xl" />,
        Telegram: <i className="fa-brands fa-telegram text-2xl" />,
        Youtube: <i className="fa-brands fa-youtube text-2xl" />,
            'Google My Business': <i className="fa-brands fa-google text-2xl" />,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e1e1e]">
            <div className="relative bg-gradient-to-br from-white via-gray-100 to-gray-300 rounded-2xl shadow-2xl border-2 border-gray-300 p-0 w-full md:max-w-[70%] h-screen flex flex-col items-center animate-fadeIn">
                {/* Cabecera tipo ventana */}
                <div className="w-full flex items-center justify-between px-6 py-3 rounded-t-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 border-b border-gray-300">
                    <span className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400 border border-gray-400" />
                        <span className="w-3 h-3 rounded-full bg-yellow-400 border border-gray-400" />
                        <span className="w-3 h-3 rounded-full bg-green-400 border border-gray-400" />
                    </span>
                    <span className="font-bold text-lg text-gray-700">Link Tree</span>
                    <button className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors duration-200" aria-label="Cerrar">
                        <i className="fa-solid fa-xmark text-xl" />
                    </button>
                </div>
                <div className="flex md:flex-row flex-col gap-12 w-full px-12 py-10 items-start justify-center">
                    {/* Logo a la izquierda */}
                    <div className="flex flex-col items-center md:w-1/2 w-full  justify-between  min-w-[180px]">
                        <img
                            src={dataGlobal.logos.secondary}
                            alt="Logo"
                            className="w-[80%] object-contain rounded-2xl shadow-lg border mb-10 border-gray-200 bg-white"
                            loading="eager"
                        />

                        <img src={"/assets/QR.png"} alt="card" className="md:w-[50%] w-[80%] rounded-md shadow-sm" />
                    </div>
                    {/* Lista de links a la derecha con scroll oculto */}
                    <div className="flex flex-col gap-4 md:w-1/2 w-full md:max-h-[700px] max-h-[300px] overflow-y-auto custom-scrollbar">
                        {combinedArray.length > 0 && combinedArray.map((item) => {
                            const color = socialColors[item.name] || '#4b4a4a';
                            let icon = <i className="fa-solid fa-globe text-2xl" />;
                            if (iconMap[item.name]) {
                                icon = iconMap[item.name];
                            }
                            return (
                                <a
                                    key={item._id}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 rounded-lg shadow-lg px-5 py-3 font-semibold text-white transition-all duration-300 border-2 border-transparent hover:border-white hover:shadow-2xl hover:brightness-110 hover:-translate-y-1 group"
                                    style={{ background: color }}
                                >
                                    <span className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">{icon}</span>
                                    <span className="text-lg drop-shadow-sm group-hover:drop-shadow-lg">{item.name}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                    background: transparent;
                }
                .custom-scrollbar {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
            `}</style>
        </div>
    );
}