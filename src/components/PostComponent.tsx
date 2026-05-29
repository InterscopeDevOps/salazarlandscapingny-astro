import { useState, useEffect } from 'react';
import type { SectionsHomeAbout } from "@/interfaces/dbData";

export interface PostComponentProps {
    dataBlocks: SectionsHomeAbout[];
    widgetActive?: boolean;
}

// datos a llamar

//   <PostComponent dataBlocks={dataBlocks} widgetActive={data.widgets.post} client:load />

const PostComponent: React.FC<PostComponentProps> = ({ dataBlocks, widgetActive = true }) => {
    // Buscar bloques que contengan la palabra 'post' en campos legibles
    const images = (
        dataBlocks
            .filter(block => {
                // revisar campos comunes donde podría aparecer la palabra 'post'
                const hayPost = [block.title, block.section, block.tipos, block.text]
                    .some(v => typeof v === 'string' && v.toLowerCase().includes('post'));
                return hayPost;
            })
            // aplanar todos los additionalImages de los bloques encontrados
            .flatMap(block => block.additionalImages || [])
    ) || [];

    const [currentIndex, setCurrentIndex] = useState(0);
    // Inicializar isOpen sólo si el widget está activo Y hay imágenes
    const [isOpen, setIsOpen] = useState<boolean>(!!widgetActive && images.length > 0);
    const [wasClosed, setWasClosed] = useState(false); // Para controlar si se cerró

    const goToPrevious = () => {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleClose = () => {
        setIsOpen(false);
        setWasClosed(true);
    };

    // Cierra el modal con la tecla Escape y bloqueo de scroll SOLO cuando el widget está activo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        // Solo aplicar el comportamiento de modal si el widget está activo
        // y además hay imágenes para mostrar. Evita bloquear scroll cuando
        // no existen imágenes o cuando el widget está inactivo.
        if (widgetActive && isOpen && images.length > 0) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            // restaurar overflow en cualquier otro caso
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, widgetActive, images.length]);

    // Sincronizar isOpen si cambia el widgetActive (por ejemplo, toggles desde la página)
    useEffect(() => {
        setIsOpen(!!widgetActive && images.length > 0);
        // si se desactiva el widget, resetear el wasClosed para permitir mostrar la sección plana
        if (!widgetActive) setWasClosed(false);
    }, [widgetActive, images.length]);

    if (!images.length) return null; // No renderizar nada si no hay imágenes

    // Si el widget está activo, mostramos como modal (comportamiento anterior)
    if (widgetActive) {
        if (wasClosed) return null; // Si el usuario cerró el modal

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                onClick={handleClose}
            >
                {/* Botón de cerrar (X) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                    }}
                    className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-gray-300 focus:outline-none"
                    aria-label="Close modal"
                >
                    &times;
                </button>

                {/* Contenedor de imagen */}
                <div
                    className="relative max-w-[80vw] max-h-[80vh] md:max-w-[60vw] md:max-h-[85vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Imagen actual */}
                    <img
                        src={images[currentIndex]}
                        alt={`Post image ${currentIndex + 1}`}
                        className="max-h-[80vh] md:max-h-[85vh] max-w-full object-contain"
                    />

                    {/* Botones de navegación */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-primary bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 focus:outline-none"
                                aria-label="Previous image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-primary bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 focus:outline-none"
                                aria-label="Next image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Indicadores de posición */}
                            <div className="absolute md:bottom-4 -bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentIndex(index);
                                        }}
                                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-gray-500'}`}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Si el widget NO está activo, renderizamos las imágenes en una sección plana
    return (
        <section className="py-8 px-4 w-full bg-gradient-to-tr from-primary to-secondary md:px-2">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-4 text-center text-white">Our Recent Posts</h2>
                <div className="flex flex-wrap gap-4 justify-center items-center">
                    {images.map((src, idx) => (
                        <div key={idx} className="overflow-hidden rounded shadow-sm bg-white">
                            <img src={src} alt={`Post image ${idx + 1}`} className="w-full h-80 object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PostComponent;