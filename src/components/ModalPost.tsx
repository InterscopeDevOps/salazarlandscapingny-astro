import React, { useState, useEffect } from 'react';
import type { ApiData, SectionsHomeAbout } from '@/interfaces/dbData';

interface modalpostProps {
    dataGlobal: ApiData;
}

export const ModalPost: React.FC<modalpostProps> = ({ dataGlobal }) => {
  const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowModal(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const dataBlocks = dataGlobal?.sectionsHomeAbout.filter(
        (section: SectionsHomeAbout) => section.section === "blocks",
      );

  return (
    <div>
      {showModal && (
        <>
                  <div className="fixed inset-0 z-50 overflow-y-auto">
                      <div className="flex items-center min-h-full justify-center p-4 text-center sm:items-center sm:p-0">
                          <div className='fixed inset-0 bg-black bg-opacity-70 z-20'></div>
                          <div className="relative z-30 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-[300px] md:w-[500px] h-[400px] md:h-[550px]">
                              <div className="bg-white w-full h-full">
                                  <div className="sm:flex sm:items-start">
                                      <button
                                          className="absolute top-3 right-3 px-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                          id="modal-title"
                                          onClick={() => setShowModal(false)}
                                      >
                                          <i className="fa fa-times"></i>
                                      </button>

                                  </div>
                                  <div className='h-full'>
                                      <img src={dataBlocks[8]?.additionalImages[0]} alt='modal_post' className='w-full h-full' />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
        </>
      )}
    </div>
  );
}