


import React, { useEffect, useState } from 'react';
import type { MenuItem } from '../../interfaces/menu';
import type { ApiData } from '../../interfaces/dbData';
import EliminarCaracteresEspeciales from '@/hook/EliminarCaracteresEspeciales';

interface MenuHeaderProps {
  data: ApiData;
  textColors?: string;
}


export const MenuHeader: React.FC<MenuHeaderProps> = ({ data, textColors }) => {

  const [openMenu, setOpenMenu] = useState(false)
  const [showMenuPanel, setShowMenuPanel] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState('')
  const menuTransitionMs = 380;

  const mobileOverlayStyle: React.CSSProperties = {
    background: 'color-mix(in srgb, var(--secondary) 72%, black 28%)',
  };

  const mobilePanelStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, color-mix(in srgb, var(--secondary) 78%, white 22%) 0%, color-mix(in srgb, var(--secondary) 92%, var(--primary) 8%) 52%, color-mix(in srgb, var(--secondary) 88%, black 12%) 100%)',
    borderColor: 'color-mix(in srgb, var(--tertiary) 30%, rgba(255,255,255,0.35))',
    boxShadow: '0 24px 80px color-mix(in srgb, var(--secondary) 58%, black 42%)',
  };

  const mobileHeaderFadeStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, color-mix(in srgb, var(--secondary) 88%, var(--primary) 12%) 0%, transparent 100%)',
  };

  //landing page de services
  const landingServices = data.widgets.landingServices;
  const landingGallery = data.widgets.landingGallery;
  const reviewsPages = data.reviews.stateReviews;
  const videoPages = data.widgets.landingVideos;
  const blogPages = data.widgets.blog;
  const areasWeServePages = data.widgets.areasweserve;
  const primaryPhone = data?.dataGeneral?.phones?.[0];
  const primaryEmail = data?.dataGeneral?.emails?.[0];
  const primaryPhoneLabel = primaryPhone?.title?.trim() || 'Phone';
  const primaryEmailLabel = primaryEmail?.title?.trim() || 'Email';


  const handleOpenMenu = () => {
    setOpenMenu(true);
    setOpenSubMenu('');
    requestAnimationFrame(() => {
      setShowMenuPanel(true);
    });
  };

  const handleCloseMenu = () => {
    setShowMenuPanel(false);
    setTimeout(() => {
      setOpenMenu(false);
      setOpenSubMenu('');
    }, menuTransitionMs);
  };

  useEffect(() => {
    document.body.style.overflow = openMenu ? 'hidden' : '';

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openMenu) {
        handleCloseMenu();
      }
    };

    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEscape);
    };
  }, [openMenu]);

  //menu
  const dataMenu: MenuItem[] = [
    {
      label: "home",
      url: "/",
    },
    {
      label: "about",
      url: "/about",
    },
    {
      label: "services",
      url: "/services",
      subItem: landingServices,
      ...(landingServices
        ? {
          subServices: data.services.slice(0,10).map((service) => ({
            label: service.title,
            url: `/services/${EliminarCaracteresEspeciales(service.title)}`,
          })),
        }
        : {}),
    },
    {
      label: "gallery",
      url: "/gallery",
      subItem: landingGallery,
      ...(landingGallery
        ? {
          subServices: data.landingsGallery.map((gallery) => ({
            label: gallery.nameLanding,
            url: `/gallery/${EliminarCaracteresEspeciales(gallery.nameLanding)}`,
          })),
        }
        : {}),
    },
    {
      label: "contact",
      url: "/contact",
    },
    // {
    //   label: "all types roofs",
    //   url: "/services",
    //   subItem: landingServices,
    //   ...(landingServices
    //     ? {
    //       subServices: data.services.slice(10,17).map((service) => ({
    //         label: service.title,
    //         url: `/services/${EliminarCaracteresEspeciales(service.title)}`,
    //       })),
    //     }
    //     : {}),
    // },

  ];


  // agregar la pestaña de Blog al array de dbMenu

  // const areasserverPages = {
  //   label: "Areas We Serve",
  //   url: "/areas-we-serve",
  //   subItem: areasWeServePages,
  //   ...(areasWeServePages
  //     ? {
  //       subServices: data.landingLocations?.slice(1, 20).map((location) => ({
  //         label: location.title,
  //         url: `/areas-we-serve/${location.slug}`,
  //       })),
  //     }
  //     : {}),
  // }

  // if (areasWeServePages) {
  //   const num = dataMenu.length - 4
  //   dataMenu.splice(num, 0, areasserverPages)
  // }

  // agregar la pestaña de Blog al array de dbMenu

  const blogItems = {
    label: "Blog",
    url: "/blog",
  }

  if (blogPages) {
    const num = dataMenu.length - 2
    dataMenu.splice(num, 0, blogItems)
  }

  // agregar la pestaña de video al array de dbMenu

  const videoItems = {
    label: "videos",
    url: "/videos",
  }

  if (videoPages) {
    const num = dataMenu.length - 1
    dataMenu.splice(num, 0, videoItems)
  }

  // agregar la pestaña de reviews al array de dbMenu

  const reviewsItems = {
    label: "reviews",
    url: "/reviews",
  }

  if (reviewsPages && data.reviews.viewHome === false) {
    const num = dataMenu.length - 1
    dataMenu.splice(num, 0, reviewsItems)
  }


  return (
    <nav className="flex items-center w-full">
      {/* ── Desktop nav ── */}
      <ul className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5">
        {dataMenu.map((menuItem, index) => (
          <li className="group relative" key={index}>
            {menuItem.subItem ? (
              <span
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold capitalize cursor-pointer transition-all duration-300 ${textColors} hover:bg-white/15 hover:text-white`}
              >
                {menuItem.label}
                <i className="fa-solid fa-chevron-down text-[10px] transition-transform duration-300 group-hover:rotate-180"></i>
              </span>
            ) : (
              <a
                href={menuItem.url}
                className={`block px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${textColors} hover:bg-white/15 hover:text-white`}
              >
                {menuItem.label}
              </a>
            )}

            {menuItem.subServices && (
              <div className="absolute top-full pt-3 hidden group-hover:block hover:block left-0 z-50">
                <ul className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl py-2 min-w-[220px] max-w-[280px] shadow-2xl overflow-hidden">
                  {menuItem.subServices.map((subService, i) => (
                    <li key={i}>
                      <a
                        href={subService.url}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 capitalize transition-all duration-300 hover:text-gray-900 hover:bg-primary/15 hover:pl-6"
                      >
                        <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {subService.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* ── Hamburger ── */}
      <button
        className="lg:hidden ml-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/25 backdrop-blur-md transition-all duration-300 hover:bg-white/20"
        onClick={handleOpenMenu}
        aria-label="Abrir menú"
      >
        <i className={`fa-solid fa-bars text-lg ${textColors}`}></i>
      </button>

      {/* ── Mobile drawer ── */}
      {openMenu && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
        >
          <button
            className={`absolute inset-0 bg-[#04141d]/75 backdrop-blur-md transition-opacity duration-300 ${
              showMenuPanel ? 'opacity-100' : 'opacity-0'
            }`}
            style={mobileOverlayStyle}
            onClick={handleCloseMenu}
            aria-label="Cerrar menú"
          ></button>

          <div className="relative h-full flex items-start justify-center p-4 sm:p-6 pointer-events-none">
            <div
              className={`mobile-menu-scroll pointer-events-auto w-full max-w-lg h-full overflow-y-auto rounded-[2rem] border transition-all duration-300 ${
                showMenuPanel
                  ? 'opacity-100 translate-y-0 scale-100 blur-0'
                  : 'opacity-0 -translate-y-6 scale-[0.98] blur-[2px]'
              }`}
              style={mobilePanelStyle}
            >
              <div className="sticky top-0 z-10 flex justify-end px-5 pt-5" style={mobileHeaderFadeStyle}>
                <button
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20"
                  onClick={handleCloseMenu}
                  aria-label="Cerrar menú"
                >
                  <i className="fa-solid fa-times text-white text-lg"></i>
                </button>
              </div>

              <div className="flex justify-center items-center pt-2 pb-6 px-6">
                <img src={data?.logos.secondary} alt="Logo" className="w-40" />
              </div>

              <div className="px-7 sm:px-8 pb-5">
                <div className="flex items-center justify-center flex-wrap gap-2.5">
                  {primaryPhone?.number && (
                    <a
                      href={`tel:${primaryPhone.number}`}
                      aria-label={`Llamar al ${primaryPhone.number}`}
                      className="group inline-flex items-center gap-2 px-4 h-11 rounded-full border text-white border-white/20 bg-white/10 text-white/85 transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white"
                    >
                      <i className="fa-solid fa-phone text-sm"></i>
                      <span className="text-sm font-semibold leading-none">{primaryPhoneLabel}</span>
                    </a>
                  )}

                  {primaryEmail?.email && (
                    <a
                      href={`mailto:${primaryEmail.email}`}
                      aria-label={`Enviar email a ${primaryEmail.email}`}
                      className="group inline-flex items-center gap-2 px-4 h-11 rounded-full border border-white/20 bg-white/10 text-white/85 transition-all text-white duration-300 hover:bg-primary hover:border-primary hover:text-white"
                    >
                      <i className="fa-solid fa-envelope text-sm"></i>
                      <span className="text-sm font-semibold leading-none">{primaryEmailLabel}</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="w-[84%] mx-auto h-px bg-white/15 mb-5"></div>

              <ul className="flex flex-col px-7 sm:px-8 gap-1 pb-14">
                {dataMenu.map((menuItem, index) => (
                  <li
                    key={index}
                    className={`border-b border-white/10 last:border-0 transition-all duration-300 ${
                      showMenuPanel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    }`}
                    style={{ transitionDelay: `${90 + index * 45}ms` }}
                  >
                    {menuItem.subItem ? (
                      <>
                        <button
                          className="w-full flex items-center justify-between py-4 text-white/80 font-semibold capitalize text-lg transition-colors duration-300 hover:text-white"
                          onClick={() =>
                            setOpenSubMenu(
                              openSubMenu !== menuItem.label ? menuItem.label : ""
                            )
                          }
                        >
                          <span>{menuItem.label}</span>
                          <i
                            className={`fa-solid fa-chevron-down text-sm transition-transform duration-300 ${
                              openSubMenu === menuItem.label ? "rotate-180" : ""
                            }`}
                          ></i>
                        </button>
                        {openSubMenu === menuItem.label && (
                          <ul className="pl-4 pb-3 flex flex-col gap-1">
                            {menuItem.subServices?.map((subService, i) => (
                              <li key={i}>
                                <a
                                  href={subService.url}
                                  className="flex items-center gap-2 py-2 text-white/60 capitalize text-base transition-colors duration-300 hover:text-white"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                                  {subService.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <a
                        href={menuItem.url}
                        className="flex items-center py-4 text-white/80 font-semibold capitalize text-lg transition-colors duration-300 hover:text-white"
                      >
                        {menuItem.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


