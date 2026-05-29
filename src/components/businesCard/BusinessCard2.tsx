import React from "react";
import type { ApiData, Phone, Email } from "@/interfaces/dbData";
import { RedesIcons } from "../RedesIcons"; // Importa el componente RedesIcons

interface Props {
  data: ApiData;
}

const BusinessCard2: React.FC<Props> = ({ data }) => {
  const {
    logos,
    dataGeneral,
    redesSociales,
    colors,
    domain,
    gallery,
    nameCustomers,
    businessAddress,
  } = data;

  const [stateFrontBack, setStateFrontBack] = React.useState(true);

  const isNetlify = domain.endsWith(".netlify.app"); // Verifica si el dominio termina en '.netlify.app'
  const isVercel = domain.endsWith(".vercel.app"); // Verifica si el dominio termina en '.vercel.app'
  const isCustomDomain = !isNetlify && !isVercel; // Verifica si es un dominio personalizado

  return (
    <div className="flex flex-col items-center justify-center  w-full h-full">
      <button
        className="hidden items-center gap-2 mb-4 rounded-full py-2 px-4 bg-white shadow-md hover:shadow-lg transition-all duration-300"
        onClick={() => setStateFrontBack(!stateFrontBack)}
      >
        <i
          className="fa-solid fa-arrows-rotate text-2xl"
          style={{ color: colors.btnColor }}
        ></i>
        <span className="text-sm font-sans" style={{ color: colors.btnColor }}>
          Rotate
        </span>
      </button>
      {stateFrontBack ? (
        <div className="bg-black shadow-lg rounded-lg  w-[90%] md:w-[40%] h-full md:h-[400px] flex flex-col-reverse md:flex-row">
          <div className="w-full md:w-1/2 h-full flex flex-col justify-center">
            <div className="px-5 flex flex-col gap-5 ">
              <img
                src={logos.primary}
                alt="logo"
                className="h-44 w-auto object-contain relative"
              />
              <div className="flex items-center md:-mt-5">
                <div
                  className="rounded-xl w-10 h-10 flex items-center justify-center mr-3"
                  style={{ backgroundColor: colors.btnHoverColor }}
                >
                  <i className="fa-solid fa-phone text-xl text-black"></i>
                </div>
                <div className="flex flex-col gap-2">
                  {dataGeneral.phones.slice(0, 1).map((phone: Phone) => (
                    <a
                      key={phone._id}
                      href={`tel:+1${phone.number}`}
                      className="text-lg font-sans text-white"
                    >
                      {phone.number}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="rounded-xl w-10 h-10 flex items-center justify-center mr-3"
                  style={{ backgroundColor: colors.btnHoverColor }}
                >
                  <i className="fa-solid fa-envelope text-xl text-black"></i>
                </div>

                <div className="flex flex-col gap-2">
                  {dataGeneral.emails.slice(0, 1).map((email: Email) => (
                    <a
                      key={email._id}
                      href={`mailto:${email.email}`}
                      className="text-md font-sans text-white"
                    >
                      {email.email}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p
                  className="text-center md:text-start text-lg font-bold capitalize"
                  style={{
                    color: colors.btnHoverColor,
                  }}
                >
                  Follow us on
                </p>
                <div className="flex items-center  md:justify-start justify-center h-full">
                  <RedesIcons
                    redesSociales={redesSociales}
                    textColor="text-white" // Cambia el color del texto
                    position="flex flex-row gap-2 md:gap-3" // Cambia la posición de los iconos
                  />
                </div>
              </div>
            </div>
            <div
              className="py-10 block md:hidden mt-5"
              style={{
                backgroundColor: colors.btnHoverColor,
                clipPath:
                  "polygon(10% 0%, 90% 0%, 100% 20%, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0% 20%)",
              }}
            ></div>
          </div>
          <div className="w-full md:w-1/2 h-full  flex flex-col justify-between">
            <div
              className="h-[35%] hidden md:block"
              style={{
                backgroundColor: colors.btnHoverColor,
                clipPath:
                  "polygon(0 0, 100% 0, 100% 20%, 100% 100%, 80% 100%, 20% 100%, 0% 50%, 0% 20%)",
              }}
            ></div>
            <div
              className="py-10 block md:hidden mb-5"
              style={{
                backgroundColor: colors.btnHoverColor,
                clipPath:
                  "polygon(0 0, 100% 0, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)",
              }}
            ></div>
            <div className="flex flex-col items-center justify-center mb-5 md:mb-0">
              <h1 className="text-white text-4xl font-bold text-center uppercase">
                {nameCustomers}
              </h1>
              <p className="text-white text-lg font-semibold text-center">
                Owner
              </p>
            </div>
            <div
              className="h-[35%] hidden md:block"
              style={{
                backgroundColor: colors.btnHoverColor,
                clipPath:
                  "polygon(20% 0%, 80% 0%, 100% 0, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0% 50%)",
              }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="bg-black shadow-lg rounded-lg   w-[90%] md:w-[40%] h-full md:h-[400px] flex flex-col justify-between">
          <div
            className="h-[20%] w-full py-5 md:py-0"
            style={{
              backgroundColor: colors.btnHoverColor,
              clipPath:
                "polygon(0 0, 100% 0, 100% 20%, 100% 70%, 95% 100%, 5% 100%, 0% 70%, 0% 20%)",
            }}
          ></div>
          <div className="flex justify-center items-center">
            <img src={logos.primary} alt="logo" className="h-60 w-auto" />
          </div>

          <div
            className="h-[20%] w-full py-1 md:py-0"
            style={{
              backgroundColor: colors.btnHoverColor,
              clipPath:
                "polygon(5% 0%, 95% 0%, 100% 30%, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0% 30%)",
            }}
          >
            <a
              href={domain}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-full text-black"
            >
              <i className="fa-solid fa-globe text-2xl"></i>
              {isCustomDomain ? (
                <span className="text-lg font-sans ml-2 hidden md:block">
                  www.{domain}
                </span>
              ) : (
                <span className="text-lg font-sans ml-2 capitalize hidden md:block">
                  Visit our website
                </span>
              )}
              <span className="text-md font-sans ml-2 capitalize block md:hidden">
                Visit our website
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCard2;
