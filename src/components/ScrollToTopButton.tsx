import   { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Manejar el evento de scroll
    const handleScroll = () => {
        // Mostrar el botón cuando el usuario haya hecho scroll hacia abajo una cierta cantidad
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Manejar el clic en el botón para desplazarse hacia arriba
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Desplazamiento suave
        });
    };

    // Agregar el listener de scroll cuando el componente se monta
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Remover el listener cuando el componente se desmonta
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        // Mostrar el botón solo si isVisible es true
        isVisible && (
            <button
                onClick={scrollToTop}
                className="fixed z-40 bottom-4 right-2 bg-btnHover text-white px-4 py-2.5 rounded-full shadow "
            >
                <i className="fa-solid fa-arrow-up"></i>
            </button>
        )
    );
};

export default ScrollToTopButton;
