import LazyImage from "@/components/LazyImage";

import React, { useState } from "react";

import Masonry from 'react-masonry-css';

import type { LandingsGallery } from "@/interfaces/dbData";



interface GalleryDetailProps {
  dataGallery: string[];
  LandingsGallery: LandingsGallery[];
}

const GalleryDetail: React.FC<GalleryDetailProps> = ({ dataGallery, LandingsGallery }) => {
  // Estado para controlar la visibilidad del modal y la imagen seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [dataImg, setDataImg] = useState<string[]>([])
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    768: 2,
    500: 1,
  };

  const openModal = (index: number, dataGalleryimg: string[]) => {
    setSelectedImageIndex(index);
    setDataImg(dataGalleryimg);
    setIsModalOpen(true);
  };
  const openModal2 = (index: number) => {
    setSelectedImageIndex(index);
    setDataImg(dataGallery);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? dataImg.length - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === dataImg.length - 1 ? 0 : prev + 1));
  };

  // Navegación con teclado
  React.useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, dataImg.length]);

  // const LandImg = LandingsGallery.map((item)=> item)




  return (
    <div>

      {
        LandingsGallery.length > 0 ?
          LandingsGallery.map((item, index) => {
            return (
              <div key={index} className="py-6 w-full">
                <div className="max-w-7xl mx-auto mb-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40  px-4 py-6">
                  <h3 className="text-4xl text-secondary font-bold text-center pb-5">{item.nameLanding}</h3>
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                  {
                    item.imgLanding.map((img, index) => (
                      <div key={index} onClick={() => openModal(index, item.imgLanding)} className="mb-4 cursor-pointer group rounded-lg">
                        <LazyImage
                          src={img}
                          alt={`gallery-${index}`}
                          className="w-full h-auto object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl"
                        />
                      </div>
                    ))
                  }



                  </Masonry>
                </div>



              </div>
            )
          })
          :
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {dataGallery.map((item, index) => (
              <div key={index} onClick={() => openModal2(index)} className="mb-4 cursor-pointer group">
                <LazyImage
                  src={item}
                  alt={`gallery-${index}`}
                  className="w-full h-auto object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl"
                />
              </div>
            ))}
          </Masonry>
      }



      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 animate-fade-in" onClick={closeModal}>
          <div className="relative rounded-xl bg-zinc-900/80 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col items-center p-4" onClick={e => e.stopPropagation()}>
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 rounded-full bg-zinc-700/70 text-white hover:bg-red-600 transition-all duration-200 p-2 shadow-lg z-10"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Flecha izquierda */}
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-700/70 hover:bg-zinc-500 text-white rounded-full p-2 shadow-lg z-10"
              aria-label="Anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            {/* Flecha derecha */}
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-700/70 hover:bg-zinc-500 text-white rounded-full p-2 shadow-lg z-10"
              aria-label="Siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            {/* Imagen principal */}
            {dataImg[selectedImageIndex] && (
              <LazyImage
                src={dataImg[selectedImageIndex]}
                alt={`gallery-modal-${selectedImageIndex}`}
                className="w-full max-h-[70vh] object-contain rounded-lg transition-all duration-300 shadow-xl"
              />
            )}
            {/* Indicador de posición */}
            <div className="mt-2 text-sm text-zinc-200/80">
              {selectedImageIndex + 1} / {dataImg.length}
            </div>
          </div>
        </div>
      )}



    </div>
  );
};


export default GalleryDetail;