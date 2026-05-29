import React, { useState } from 'react';
import type { Location } from "@/interfaces/dbData";

interface MapaTabProps {
    locations: Location[];
}

const MapaTab: React.FC<MapaTabProps> = ({ locations }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [showLocations, setShowLocations] = useState(false);
    const [animateMenu, setAnimateMenu] = useState('')
    const [locationName, setLocationName] = useState(locations[0].city);


    const handleTabClick = (index: number, title: string) => {
        setSelectedTab(index);
        setLocationName(title);
        setAnimateMenu('animate-slide-out-right');
        // Agrega un retardo antes de cambiar el estado `openMenu` para permitir que la animación se reproduzca
        setTimeout(() => {
            setShowLocations(false);
        }, 500); // Ajusta el tiempo según la duración de tu animación
    };

    const toggleLocations = () => {
        setShowLocations(prevState => !prevState); // Cambia el estado de visibilidad de la lista de localidades
        setAnimateMenu('animate-slide-in-right');

    };

    const handleClose = () => {
        setAnimateMenu('animate-slide-out-right');
        // Agrega un retardo antes de cambiar el estado `openMenu` para permitir que la animación se reproduzca
        setTimeout(() => {
            setShowLocations(false);
        }, 500); // Ajusta el tiempo según la duración de tu animación
    };


    return (
        <div className="flex flex-col overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-semibold text-center text-white capitalize bg-secondary p-5">we cover the entire {locationName}</h2>
            <div className="w-full h-[500px] md:h-[650px] relative ">
                <iframe
                    src={locations[selectedTab].urlCity}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    aria-label='Mapa de localidades'
                    
                ></iframe>
                {/* Botón para mostrar/ocultar la lista de localidades */}
                {showLocations ? (
                    <button
                        className="absolute z-10 right-0 top-0 mt-2 mr-2 px-3 py-1 text-lg font-semibold text-white bg-gray-800 hover:bg-gray-600 rounded-full"
                        onClick={handleClose}
                        arial-label="Close locations"
                    >
                        X
                    </button>
                ) : (
                    <button
                        className="absolute right-0 top-0 px-4 py-2 text-lg font-semibold bg-btnHover hover:bg-secondary hover:text-white  rounded-bl-xl transition-all duration-300 ease-in-out capitalize"
                        onClick={toggleLocations}
                        arial-label="View locations"
                    >
                        <span className="mr-2"> <i className="fa-solid fa-arrow-up-right-and-arrow-down-left-from-center"></i></span>
                        view locations
                    </button>
                )}
                {/* Contenedor de botones de localidades */}
                {showLocations && (
                    <div className={`${animateMenu} flex flex-col items-center justify-center absolute right-0 top-0 bottom-0  bg-green-950/80 shadow w-full h-[500px] md:h-[650px]`}>
                        <h2 className="text-xl md:text-3xl font-semibold text-white text-center py-5 capitalize">all the locations we cover </h2>
                        <div className="flex flex-wrap justify-center items-end overflow-y-auto pb-10 gap-5">
                            {locations.map((location, index) => (
                                <button
                                    key={index}
                                    className={`flex flex-col justify-center items-center p-8 mb-2 text-lg font-semibold rounded-b-full shado-sm border-t-[10px] ${selectedTab === index ? 'bg-btnHover  border-gray-200' : 'bg-gray-100 border-btnHover hover:bg-btnHover hover:border-gray-200 hover:text-white transition-all duration-300 ease-in-out'}`}
                                    onClick={() => handleTabClick(index, location.city)}
                                    arial-label={`Select ${location.city}`}
                                >
                                    <i className="fa-solid fa-location-dot mr-1 text-2xl pb-1"></i>
                                    <span>{location.city}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapaTab;
