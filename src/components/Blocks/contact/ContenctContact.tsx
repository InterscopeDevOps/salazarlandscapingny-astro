import type { ApiData, SocialMedia } from "@/interfaces/dbData"
import ContactForm from "../contact/ContactForm";
import { RedesIcons } from "@/components/RedesIcons";


interface ContentContactProps {
    dataGlobal: ApiData;
    bgImage: string;
    dataRedes: SocialMedia[];
}

const ContentContact: React.FC<ContentContactProps> = ({ dataGlobal, bgImage, dataRedes }) => {
    return (
        <div className="w-full mx-auto h-full flex flex-col md:flex-row gap-5 relative mb-0 bg-slate-100 md:-mb-24 -mt-6">
            <div className="w-full md:w-2/5 py-10 md:py-32 bg-white">
                <div className="bg-black p-5 w-full md:w-4/5 ml-0 md:ml-52">
                    <h2 className="text-white text-4xl font-bold text-center md:text-start pb-5 capitalize">Contact Information</h2>
                    <div className="flex flex-col md:flex-row space-x-4 justify-center items-center mb-5">
                        <div className="w-16 h-16 md:h-14 flex justify-center items-center border-white border-2 rounded-full text-white border-dotted">
                            <div className="w-4/5 h-4/5 rounded-full bg-white flex justify-center items-center">
                                <i className="fa-light fa-phone text-xl text-secondary "></i>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-start w-full border-b pb-2 my-2">

                            {
                                dataGlobal.dataGeneral.phones.map((phone, index) => (
                                    <a
                                        key={index}
                                        href={`tel:${phone.number}`}
                                        className="text-xl font-bold text-white mt-4 hover:text-slate-300 transition-all duration-300 ease-in-out flex "
                                    >

                                        {phone.number}
                                        {
                                            phone.title.length > 0 && (
                                                <span className="text-[18px] text-white block text-center md:text-start font-semibold ml-2"> / {phone.title}</span>
                                            )
                                        }

                                    </a>

                                ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-x-4 justify-center items-center mb-5">
                        <div className="w-16 h-16 md:h-14 flex justify-center items-center border-white border-2 rounded-full text-white border-dotted">
                            <div className="w-4/5 h-4/5 rounded-full bg-white flex justify-center items-center">
                                <i className="fa-light fa-envelope text-xl text-secondary "></i>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-start w-full border-b pb-2 my-2">

                            {
                                dataGlobal.dataGeneral.emails.map((email, index) => (
                                    <a
                                        key={index}
                                        href={`tel:${email.email}`}
                                        className="text-xl font-bold text-white mt-4 hover:text-slate-300 transition-all duration-300 ease-in-out flex "
                                    >

                                        {email.email}


                                    </a>

                                ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-x-4 justify-center items-center mb-5">
                        <div className="w-16 h-16 md:h-14 flex justify-center items-center border-white border-2 rounded-full text-white border-dotted">
                            <div className="w-4/5 h-4/5 rounded-full bg-white flex justify-center items-center">
                                <i className="fa-light fa-calendar-clock text-xl text-secondary "></i>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-start w-full border-b pb-2 my-2">

                            {
                                dataGlobal.dataGeneral.openingHours.map((hour, index) => (
                                    <div
                                        key={index}
                                        className="text-xl font-bold text-white block  gap-1 mt-4 hover:text-slate-700 transition-all duration-300 ease-in-out"
                                    >

                                        <span className="text-white block text-center md:text-start font-semibold capitalize">{hour.days}</span>
                                        <span className="text-white text-[18px]  block text-center md:text-start font-semibold capitalize">{hour.hours}</span>

                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className=" flex flex-col justify-center items-center md:items-start pt-10 pb-20 md:py-5 ">
                        <h2 className="text-white text-3xl font-bold text-center pb-5 capitalize">Follow us on</h2>
                        <RedesIcons redesSociales={dataRedes} />
                    </div>
                </div>
            </div>
            <div className="w-full md:w-3/5 flex flex-col items-end justify-center px-10 py-12">

                <div className="w-full md:w-4/5 p-5">

                    <p className="text-5xl font-bold text-secondary capitalize"><i className="fa-solid fa-envelopes text-3xl"></i> Get In Touch!</p>
                    <ContactForm dataGlobal={dataGlobal} formStyles="p-0 md:p-5" />
                </div>
            </div>

        </div>
    )

}

export default ContentContact;