
import LazyImage from "@/components/LazyImage";
import ButtonContent_2 from "@/components/button/ButtonContent_2";
import EstimatePro from "@/components/Blocks/contact/EstimatePro";
import type { Phone, Service, ApiData, Email } from "@/interfaces/dbData";
import React from "react";


interface ServicesComponentProps {
  dataServices: Service[];
  onePages?: boolean;
  dataPhone?: Phone[];
  companyName?: string;
  logo?: string;
  emails?: Email[];
}


const ServicesComponent: React.FC<ServicesComponentProps> = ({ dataServices, onePages, dataPhone, companyName, logo, emails }) => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ef] py-16 px-2">
      <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-12 text-btnHover drop-shadow-lg">Our Services</h2>
      <div className="grid max-w-7xl mx-auto gap-12 md:gap-16">
        {dataServices.map((service, idx) => {
          const isEven = idx % 2 === 0;
          const desc = service.description[0];
          return (
            <div
              key={service._id}
              className={`group relative flex flex-col md:flex-row ${isEven ? '' : 'md:flex-row-reverse'} items-center bg-white/90 rounded-3xl shadow-2xl hover:shadow-[0_8px_40px_rgba(34,197,94,0.13)] border border-slate-200/80 overflow-hidden transition-all duration-300`}
            >
              <div className="md:w-1/2 w-full h-[320px] md:h-[420px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-btnHover/10 to-primary/10">
                <LazyImage
                  src={desc.image}
                  alt={service.title}
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500 rounded-3xl"
                />
              </div>
              <div className="md:w-1/2 w-full p-8 md:p-12 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-btnHover/10 text-btnHover text-3xl shadow-md">
                    <i className="fa-solid fa-leaf"></i>
                  </span>
                  <h3 className="text-2xl md:text-4xl font-bold text-secondary capitalize drop-shadow-sm">{service.title}</h3>
                </div>
                <p className="text-lg text-slate-700 leading-relaxed mb-2">{desc.text}</p>
                <div className="flex gap-3 mt-2">
                  <ButtonContent_2 titleBtn="Contact Us" linkBtn={`tel:+1${dataPhone && dataPhone[0]?.number}`} />
                  <ButtonContent_2 titleBtn="Learn More" linkBtn={`/services/${service.title.replace(/\s+/g, '-').toLowerCase()}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulario moderno EstimatePro */}
      <div className="max-w-2xl mx-auto my-24">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center text-secondary md:text-btnHover capitalize">Get Your Instant Quote</h2>
        <EstimatePro
          recipientEmail={emails || []}
          companyName={companyName || ''}
          logo={logo || ''}
          services={dataServices.map(s => s.title)}
          embedded={true}
        />
      </div>
    </section>
  );
};

export default ServicesComponent;
