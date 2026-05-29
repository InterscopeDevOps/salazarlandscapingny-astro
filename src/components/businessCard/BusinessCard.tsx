import React from 'react';
import type { ApiData, Phone, Email } from '@/interfaces/dbData';
import { RedesIcons } from '../RedesIcons'; // Importa el componente RedesIcons


interface Props {
    data: ApiData;
}

const BusinessCard: React.FC<Props> = ({ data }) => {
    const { logos, dataGeneral, redesSociales, colors, domain, gallery, nameCustomers, businessAddress } = data;

    const [stateFrontBack, setStateFrontBack] = React.useState(true);

    const isNetlify = domain.endsWith('.netlify.app'); // Verifica si el dominio termina en '.netlify.app'
    const isVercel = domain.endsWith('.vercel.app'); // Verifica si el dominio termina en '.vercel.app'
    const isCustomDomain = !isNetlify && !isVercel; // Verifica si es un dominio personalizado


    return (
        <div className='flex flex-col items-center justify-center w-full h-full'>
            <button
                className='items-center gap-2 mb-4 rounded-full py-2 px-4 bg-white shadow-md hover:shadow-lg transition-all duration-300'
                onClick={() => setStateFrontBack(!stateFrontBack)} >
                <i className="fa-solid fa-arrows-rotate text-2xl" style={{ color: colors.btnColor }}></i>
                <span className='text-sm font-sans' style={{ color: colors.btnColor }}>Rotate</span>
            </button>
            {
                stateFrontBack ? (
                    <div className='bg-black text-white font-semibold shadow-lg rounded-lg  pb-8 w-[90%] md:w-[40%] h-full md:h-[400px] flex flex-col-reverse md:flex-row' style={{
                        backgroundImage: `
                        radial-gradient(at 77% 23%, ${colors.primaryColor} 0px, transparent 50%),
                        radial-gradient(at 21% 68%, ${colors.primaryColor} 0px, transparent 50%)`
                    }}>
                        <div className='w-full md:w-1/2 h-full flex flex-col justify-between '>
                            <div className='p-6 h-full flex flex-col justify-between'>
                                <div className='flex items-center mb-4'>
                                    <i
                                        className="fa-solid fa-user text-5xl"
                                    ></i>
                                    <div
                                        className='border-l-2 h-full ml-3 pl-3'
                                    >
                                        <h1 className='text-2xl font-semibold uppercase tracking-wide'>{nameCustomers}</h1>
                                        <h2 className='text-xl font-sans uppercase tracking-wide'>Owner</h2>
                                    </div>

                                </div>
                                <div className='flex flex-col gap-4'>
                                    <div className='flex items-center'>
                                        <div
                                            className='rounded-full w-10 h-10 flex items-center justify-center mr-3'
                                            style={{ backgroundColor: colors.btnColor }}
                                        >
                                            <i className="fa-solid fa-phone text-xl text-white" ></i>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            {dataGeneral.phones.slice(0, 1).map((phone: Phone) => (
                                                <a
                                                    key={phone._id}
                                                    href={`tel:+1${phone.number}`}
                                                    className='text-md font-sans'
                                                >
                                                    {phone.number}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='flex items-center'>
                                        <div
                                            className='rounded-full w-10 h-10 flex items-center justify-center mr-3 p-2'
                                            style={{ backgroundColor: colors.btnColor }}
                                        >
                                            <i className="fa-solid fa-envelope text-xl text-white" ></i>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            {dataGeneral.emails.map((email: Email) => (
                                                <a
                                                    key={email._id}
                                                    href={`mailto:${email.email}`}
                                                    className='text-md font-sans'
                                                >
                                                    {email.email}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className='rounded-r-full py-3.5 relative z-20 -bottom-1.5'
                                style={{
                                    backgroundColor: colors.btnColor,
                                }}
                            >
                                <div className='flex items-center gap-3 pl-7'>
                                    <i className="fa-solid fa-location-dot text-5xl text-white"></i>
                                    <p className='text-md font-sans text-white'>
                                        {businessAddress}
                                    </p>
                                </div>

                            </div>
                        </div>
                        <div className='w-full md:w-1/2 h-full  flex flex-col justify-between'>
                            <div className='flex justify-center relative mb-16 md:mb-0'>

                                <div className='absolute top-0 left-0 w-full h-[220px] rounded-b-full'
                                    style={{
                                        // backgroundColor: colors.btnColor,
                                        backgroundImage: `url(${gallery[1]})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }
                                    }
                                ></div>
                                <div className='bg-black/30 absolute top-0 left-0 w-full h-[220px] rounded-b-full'></div>
                                <img src={logos.primary} alt="logo" className='h-44 w-auto relative' />
                            </div>
                            <div>
                                <p
                                    className='text-center text-lg font-bold capitalize'
                                >
                                    Follow us on
                                </p>
                                <div
                                    className='py-3 rounded-l-full w-full ml-auto mb-2'
                                    style={{
                                        backgroundColor: colors.btnColor,
                                    }}
                                >
                                    <div className='flex items-center justify-center gap-5 h-full'>
                                        <a
                                            href={data.gmb}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={` transition-all duration-300 hover:-translate-y-1.5  `}
                                            aria-label={`View Google Business Profile`}
                                        >
                                            <i className={`fa-brands fa-google`}></i>
                                        </a>
                                        <RedesIcons
                                            redesSociales={redesSociales}
                                            textColor="text-white" // Cambia el color del texto
                                            position="flex flex-row gap-2" // Cambia la posición de los iconos
                                        />

                                    </div>
                                </div>

                                <div className='hidden md:block relative bottom-16 left-0'>
                                    {/* <div
                                        className='rounded-t-full rounded-r-full rounded-l-2xl rounded-b-full w-16 h-20 absolute -top-2 left-3 md:-left-8'
                                        style={{
                                            backgroundColor: colors.btnColor,
                                        }}
                                    ></div> */}
                                    <div className='bg-white rounded-r-full w-full h-[85px] absolute -top-2.5 -left-[295px] z-10'></div>

                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className='bg-black shadow-lg rounded-lg  w-[90%] md:w-[40%] h-[490px] md:h-[400px] flex flex-col-reverse md:flex-row' style={{
                        backgroundImage: `
                        radial-gradient(at 77% 23%, ${colors.primaryColor} 0px, transparent 50%),
                        radial-gradient(at 21% 68%, ${colors.primaryColor} 0px, transparent 50%)`
                    }}>
                        <div className='pt-6 w-full h-full flex flex-col justify-between'>
                            <div className='flex justify-center items-center'>
                                <img src={logos.primary} alt="logo" className='h-40 w-auto' />
                            </div>
                            <p className='text-center text-white font-semibold'>Lic # MHIC 117801</p>
                            <div className='flex flex-wrap justify-center gap-2 text-white'>
                                {data?.services?.slice(0, 8).map((service, index) => (
                                    <span className='text-center text-lg font-bold capitalize' key={index}>
                                        {service.title} /
                                    </span>
                                ))}

                            </div>
                            <div className='flex jucestify-center'>
                                <div className='w-[35%]'>
                                    <div
                                        className='w-full h-8 rounded-r-full mb-4 bg-white'

                                    ></div>
                                    <div className='w-full flex justify-end relative'>
                                        <div
                                            className='rounded-l-full w-16 h-16 absolute -right-8 bottom-0 bg-white'

                                        ></div>
                                        {/* <div className='bg-white rounded-l-full w-16 h-20 absolute -right-14 -bottom-2'></div> */}
                                    </div>
                                </div>
                                <div
                                    className='w-full h-16 rounded-full relative bottom-4 z-20 p-3'
                                    style={{
                                        backgroundColor: colors.btnColor,
                                    }}
                                >
                                    <a
                                        href="/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='flex items-center justify-center h-full text-white'

                                    >
                                        <i className="fa-solid fa-globe text-2xl"></i>
                                        {
                                            isCustomDomain ? (
                                                <span className='text-lg font-sans ml-2 hidden md:block'>www.{domain}</span>
                                            ) : (
                                                <span className='text-lg font-sans ml-2 capitalize hidden md:block'>Visit our website</span>
                                            )
                                        }
                                        <span className='text-md font-sans ml-2 capitalize block md:hidden'>Visit our website</span>

                                    </a>
                                </div>
                                <div className='w-[35%]'>
                                    <div
                                        className='w-full h-8 rounded-l-full mb-4 bg-white'></div>
                                    <div className='w-full flex justify-start relative'>
                                        <div
                                            className='rounded-r-full w-16 h-16 absolute bottom-0 -left-8 bg-white'
                                        ></div>
                                        {/* <div className='bg-white rounded-r-full w-16 h-20 absolute -bottom-2 -left-14 z-10'></div> */}
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default BusinessCard;
