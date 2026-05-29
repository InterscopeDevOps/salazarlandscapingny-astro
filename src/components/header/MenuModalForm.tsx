import { useState } from 'react'
import ContactForm from '../Blocks/contact/ContactForm';
import type { ApiData } from '@/interfaces/dbData';

interface MenuModalFormProps {
  dataGlobal: ApiData;
}

const MenuModalForm: React.FC<MenuModalFormProps> = ({dataGlobal}) => {
  const [openModal, setOpenModal] = useState(false)
  const [animateMenu, setAnimateMenu] = useState('')

  const handleOpenMenu = () => {
    setOpenModal(true);
    setAnimateMenu('animate-slide-in-right');
  };

  const handleCloseMenu = () => {
    setAnimateMenu('animate-slide-out-right');
    // Agrega un retardo antes de cambiar el estado `openMenu` para permitir que la animación se reproduzca
    setTimeout(() => {
      setOpenModal(false);
    }, 500); // Ajusta el tiempo según la duración de tu animación
  };


const onePages = dataGlobal.widgets.onePages;


  return (
    <div>
      <button
        className="transition-all duration-300 hover:-translate-y-1"
        onClick={handleOpenMenu}
      >
        <span className="sr-only">Abrir menú</span>
        <span className="text-4xl text-white">
          <i className="fa-solid fa-bars-staggered"></i>
        </span>
      </button>

      {
        openModal && (
          <div className={`fixed top-0 right-0 ${onePages ? 'w-full md:w-[30%]' : 'w-[30%]'}  h-full bg-gray-900 bg-opacity-50 flex items-center justify-end ${animateMenu}`}>
            <div className="bg-white w-full h-full rounded-l shadow-lg p-4 overflow-y-auto">
              <div className="flex justify-end items-center mb-4">
                <button
                  className="text-gray-800 text-3xl hover:text-gray-700"
                  onClick={handleCloseMenu}
                >
                  <span className="sr-only">Cerrar menú</span>
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary text-center capitalize">send us a message</h3>
              <ContactForm dataGlobal={dataGlobal} formStyles="bg-white shadow-sm rounded-t-0 rounded-b-xl md:rounded-xl p-5" />

              </div>
            </div>
          </div>
        )
      }



    </div>
  )
}

export default MenuModalForm