import type { Blogs } from "@/interfaces/dbBlog";
import LazyImage from "../LazyImage";
import { useEffect, useRef, useState } from "react";
import type { DataGeneral, Phone, SocialMedia } from "@/interfaces/dbData";
import { RedesIcons } from "../RedesIcons";
import EliminarCaracteresEspeciales from "@/hook/EliminarCaracteresEspeciales";

interface ComponentBlogsProps {
    dataBlog: Blogs[];
    infoContact: DataGeneral;
    redesSociales: SocialMedia[];
}

const ComponentBlogs: React.FC<ComponentBlogsProps> = ({ dataBlog, infoContact, redesSociales }) => {
    // Filtrar inicialmente solo los blogs publicados
    const publishedBlogs = dataBlog.filter(blog => blog.status === 'published');

    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const blogsPerPage = 5;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filteredBlogs, setFilteredBlogs] = useState<Blogs[]>([]);


    // Filtrar los blogs según la categoría seleccionada
    // const filteredBlogs = selectedCategory === 'All' ? dataBlog : dataBlog.filter(blog => blog.category === selectedCategory);

    // Calcular la cantidad total de páginas
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

    // Obtener los blogs correspondientes a la página actual
    const currentBlogs = filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

    // Obtener un conjunto de categorías únicas
    const categorySet = new Set(publishedBlogs.map(blog => blog.category));

    // Ordenar los blogs por fecha y obtener los 7 más recientes
    const sortedBlogs = publishedBlogs.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recentBlogs = sortedBlogs.slice(0, 7);
    const blogsContainerRef = useRef<HTMLDivElement>(null);


    const handleSelectedCategory = (category: string) => {
        if (category === 'All') {
            setSelectedCategory('All');
            setCurrentPage(1);

            // Eliminar la categoría de la URL
            window.history.pushState({}, document.title, window.location.pathname);
        } else {
            const categorySinEspacios = EliminarCaracteresEspeciales(category);
            setSelectedCategory(categorySinEspacios);
            setCurrentPage(1);

            // Agregar la categoría a la URL
            window.location.hash = categorySinEspacios;
        }

        // Scroll al contenedor de blogs
        if (blogsContainerRef.current) {
            blogsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };


    // Función para cambiar a la página siguiente
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Función para cambiar a la página anterior
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Function to format date
    const formatDate = (dateString: any) => {
        const dateObject = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "long",
            year: "numeric",
        };
        return dateObject.toLocaleDateString("en-US", options);
    };


    const getCategoryCounts = () => {
        const counts: { [category: string]: number } = {};
        publishedBlogs.forEach(blog => {
            counts[blog.category] = (counts[blog.category] || 0) + 1;
        });
        return counts;
    };

    const categoryCounts = getCategoryCounts();


    // Obtener categoría de la URL al cargar el componente
    useEffect(() => {
        const categoryFromUrl = window.location.hash.substr(1);
        setSelectedCategory(categoryFromUrl || 'All');
    }, []);

    // Filtrar blogs según la categoría seleccionada
    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredBlogs(publishedBlogs);
        } else {
            const filtered = publishedBlogs.filter(blog => EliminarCaracteresEspeciales(blog.category) === selectedCategory);
            setFilteredBlogs(filtered);
        }
    }, [selectedCategory, publishedBlogs]);

    return (
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div className="w-full md:w-[65%]" ref={blogsContainerRef}>
                {
                    currentBlogs.length > 0 ? (
                        currentBlogs.map((blog, index) => {
                            const textDescription = blog.description.find(
                                (desc) => desc.type === "text",
                            );
                            const firstTextValue = textDescription
                                ? textDescription.value
                                : "";
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col md:flex-row items-center gap-10 bg-[#FCFAF7] rounded-2xl px-5 md:pl-16 md:pr-5 py-8 shadow mb-10"
                                >
                                    <a
                                        href={`/blog/${blog.slug}`}
                                        className="w-full md:w-1/2 h-full hover:scale-105 transition-all duration-300 ease-in-out"
                                        aria-label="blog image link"
                                    >
                                        <LazyImage
                                            src={blog.featureimage}
                                            alt={blog.seoTitle}
                                            className="w-full h-[300px] md:h-[350px] object-cover rounded-xl"

                                        />
                                    </a>
                                    <div className="w-full md:w-1/2">
                                        <div className="bg-white flex flex-col md:flex-row items-center gap-2 border border-primary rounded-xl px-5 py-2 mb-5">
                                            <p className="text-primary text-lg font-medium ">
                                                {formatDate(blog.date)}
                                            </p>
                                            <div className="w-2 h-2 rounded-full bg-gray-400/70 mx-2" />
                                            <span className="text-primary text-lg font-medium capitalize">
                                                {blog.category}
                                            </span>
                                        </div>
                                        <a
                                            href={`/blog/${blog.slug}`}
                                            className="text-2xl text-primary font-bold hover:text-btnHover transition-all duration-300 ease-in-out"
                                            aria-label="blog title link"
                                        >
                                            {blog.seoTitle}
                                        </a>
                                        <div className="flex gap-2 items-center pt-5">
                                            <div className="rounded-full shadow-sm border bg-white px-4 py-2.5">
                                                <i className="fa-solid fa-user-hair" />
                                            </div>
                                            <span className="text-primary flex gap-1 text-xl">
                                                <span>By</span>
                                                <span className="capitalize font-semibold">
                                                    {blog.autor}
                                                </span>
                                            </span>
                                        </div>
                                        <p className="text-lg text-primary mt-5">
                                            {firstTextValue.slice(0, 100)}
                                            <a
                                                href={`/blog/${blog.slug}`}
                                                className="text-primary font-semibold hover:text-btnHover transition-all duration-300 ease-in-out"
                                                aria-label="blog read more link"
                                            >
                                                ...Read More
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div>
                            <LazyImage
                                src="https://firebasestorage.googleapis.com/v0/b/videostock-8dab7.appspot.com/o/stock%2Fblog.svg?alt=media&token=7b1e7f10-edf4-4d15-a83f-7d4de73768a2"
                                alt="No data found"
                                className="w-full h-full object-cover p5-10"
                                height={450}
                            />
                        <h3 className="text-3xl my-2 capitalize text-center font-bold">
                            No blogs created yet or no published blogs.
                        </h3>
                        </div>
                    )
                }
                {/* Aquí van los controles de paginación */}
                {
                    publishedBlogs.length > 0 && (
                        <div className="w-full flex justify-between items-center px-0 md:px-10 ">
                            {/* Botón para ir a la página anterior */}
                            <button
                                className="bg-primary text-white px-5 py-2 rounded-xl hover:bg-btnHover transition-all duration-300 ease-in-out"
                                onClick={prevPage} disabled={currentPage === 1}
                                aria-label="previous page link"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>

                            {/* Mostrar la cantidad total de páginas y la página actual */}
                            <p className="font-bold text-primary text-lg">
                                Page {currentPage} of {totalPages}
                            </p>

                            {/* Botón para ir a la página siguiente */}
                            <button
                                onClick={nextPage} disabled={currentPage === totalPages}
                                className="bg-primary text-white px-5 py-2 rounded-xl hover:bg-btnHover transition-all duration-300 ease-in-out"
                                aria-label="next page link"
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    )
                }
            </div>
            <div className="w-full md:w-[35%]">
                <div className="bg-[#FCFAF7] rounded-2xl border shadow py-4 mb-10">
                    <div className="px-5">
                        <p
                            className="text-center md:text-start text-xl font-semibold py-5  capitalize"
                        >
                            Category
                        </p>
                        <div
                            className="border-b-2  border-[#EBECE9] mb-5 relative before:absolute before:w-1/3 before:bg-secondary before:h-1 before:left-0 before:top-0"
                        >
                        </div>
                    </div>
                    <ul className={`flex flex-col px-5 gap-5 py-5 ${[...categorySet].length > 4 ? 'h-[350px] overflow-y-auto scroolbarSubBlock' : 'h-auto'} `}>
                        <li
                            className={`text-lg font-semibold  ${selectedCategory === 'All' ? 'bg-btnHover border-none rounded-xl px-5 text-white' : 'text-primary'} py-3 border-b hover:border-btnHover transition-all duration-300 ease-in-out`}
                        >
                            <button
                                onClick={() => handleSelectedCategory('All')}
                                className="w-full flex justify-between items-center "
                                aria-label="all category link"
                            >
                                <span className="capitalize">All - {`(${publishedBlogs.length})`}</span>
                                <i className="fa-solid fa-chevrons-right"></i>
                            </button>
                        </li>
                        {
                            publishedBlogs.length > 0 && (
                                [...categorySet].map((category, index) => (
                                    <li
                                        key={index}
                                        className={`text-lg font-semibold  ${selectedCategory === EliminarCaracteresEspeciales(category) ? 'bg-btnHover border-none rounded-xl px-5 text-white' : 'text-primary'} py-3 border-b hover:border-btnHover transition-all duration-300 ease-in-out`}
                                    >
                                        <button
                                            onClick={() => handleSelectedCategory(category)}
                                            className="w-full flex justify-between items-center "
                                            aria-label={`category ${category}  link`}
                                        >
                                            <span className="capitalize">{category} - {`(${categoryCounts[category]})`} </span>
                                            <i className="fa-solid fa-chevrons-right" />
                                        </button>
                                    </li>
                                ))
                            )
                        }
                    </ul>
                </div>

                <div className="rounded-2xl border shadow px-5 py-4 mb-10">
                    <p
                        className="text-center md:text-start text-xl font-semibold py-5 capitalize"
                    >
                        Recent News
                    </p>
                    <div
                        className="border-b-2 border-[#EBECE9] mb-5 relative before:absolute before:w-1/3 before:bg-secondary before:h-1 before:left-0 before:top-0"
                    >
                    </div>
                    <ul className={`p-0 md:p-5 ${recentBlogs.length > 3 ? 'h-[500px] overflow-y-auto scroolbarSubBlock' : 'h-auto'}`}>
                        {recentBlogs.length > 0 ? (
                            recentBlogs.map((blog, index) => (
                                <li key={index} className={`flex justify-center items-center gap-5 py-5 mb-5 ${index !== recentBlogs.length - 1 ? 'border-b' : ''}`}>
                                    <a
                                        href={`/blog/${blog.slug}`}
                                        className="w-auto h-full"
                                        aria-label={`read more about ${blog.seoTitle}`}
                                    >
                                        <LazyImage
                                            src={blog.featureimage}
                                            alt={blog.seoTitle}
                                            className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-full shadow-sm object-cover"
                                        />
                                    </a>
                                    <div className="w-2/3">
                                        <p className="text-primary text-lg my-2">
                                            {formatDate(blog.date)}
                                        </p>
                                        <a
                                            href={`/blog/${blog.slug}`}
                                            className="text-xl text-primary font-bold hover:text-btnHover transition-all duration-300 ease-in-out capitalize"
                                            aria-label={`read more about ${blog.seoTitle}`}
                                        >
                                            {blog.seoTitle}
                                        </a>
                                        <div>
                                            <a
                                                href={`/blog/${blog.slug}`}
                                                className="text-primary font-semibold hover:text-btnHover transition-all duration-300 ease-in-out capitalize"
                                                aria-label={`read more about ${blog.seoTitle}`}
                                            >
                                                View details
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="text-primary text-lg my-2 capitalize font-semibold">
                                No recent blogs available.
                            </li>
                        )}
                    </ul>


                </div>

                <div className="rounded-2xl bg-primary px-2 md:px-8 py-10">
                    <h3 className="text-white text-3xl font-bold capitalize mb-5">
                        Contact Us
                    </h3>
                    <div
                        className="border-b-2 border-[#EBECE9] mb-5 relative before:absolute before:w-1/3 before:bg-btnHover before:h-1 before:left-0 before:top-0"
                    >
                    </div>
                    <ul>
                        {
                            infoContact.phones.map((phone: Phone, index: number) => (
                                <li key={index} className="flex items-center gap-2 md:gap-5 py-2">
                                    <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-white flex justify-center items-center">
                                        <i className="fa-regular fa-phone text-primary" />
                                    </div>
                                    <a
                                        href={`tel:${phone.number}`}
                                        className="text-white text-[16px] md:text-lg font-semibold flex gap-2 items-center"
                                        aria-label={`call to ${phone.number}`}
                                    >
                                        <span className="hover:text-btnHover transition-all duration-300 ease-in-out">
                                            {phone.number}
                                        </span>
                                        {
                                            phone.title.length > 0 && (
                                                <span>
                                                    - {phone.title}
                                                </span>
                                            )
                                        }
                                    </a>
                                </li>
                            ))
                        }

                        {
                            infoContact.emails.map((email, index) => (
                                <li key={index} className="flex items-center gap-2 md:gap-5 py-2">
                                    <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-white flex justify-center items-center">
                                        <i className="fa-regular fa-envelope text-primary" />
                                    </div>
                                    <a
                                        href={`mailto:${email.email}`}
                                        className="text-white text-[16px] md:text-lg font-semibold hover:text-btnHover transition-all duration-300 ease-in-out"
                                        aria-label={`send email to ${email.email}`}
                                    >
                                        {email.email}
                                    </a>
                                </li>
                            ))
                        }

                    </ul>
                    <div className=" flex justify-center bg-gray-200 rounded-xl py-5 mt-5">
                        <RedesIcons redesSociales={redesSociales} bgColor />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentBlogs;