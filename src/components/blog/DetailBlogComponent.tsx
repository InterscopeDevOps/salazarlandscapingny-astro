import EliminarCaracteresEspeciales from "@/hook/EliminarCaracteresEspeciales";
import type { Blogs, Description } from "@/interfaces/dbBlog"
import React, { useState } from "react";
import LazyImage from "../LazyImage";
import { RedesIcons } from "../RedesIcons";
import type { SocialMedia } from "@/interfaces/dbData";

interface DetailBlogComponentProps {
    dataBlog: Blogs[];
    blogInfo: Blogs;
    redesSociales: SocialMedia[];

}


const DetailBlogComponent: React.FC<DetailBlogComponentProps> = ({ dataBlog, blogInfo, redesSociales }) => {

    const [selectedCategory, setSelectedCategory] = useState<string>("");


    const handleSelectedCategory = (category: string) => {
        if (category === 'All') {
            setSelectedCategory('All');
            window.location.href = '/blog';
        }
        else {
            const categorySinEspacios = EliminarCaracteresEspeciales(category);
            setSelectedCategory(categorySinEspacios);
            window.location.href = '/blog/#' + categorySinEspacios;
        }
    }


    // Obtener un conjunto de categorías únicas
    const categorySet = new Set(dataBlog.map(blog => blog.category));

    // Ordenar los blogs por fecha y obtener los 7 más recientes
    const sortedBlogs = dataBlog.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recentBlogs = sortedBlogs.slice(0, 7);

    const getCategoryCounts = () => {
        const counts: { [category: string]: number } = {};
        dataBlog.forEach(blog => {
            counts[blog.category] = (counts[blog.category] || 0) + 1;
        });
        return counts;
    };

    const categoryCounts = getCategoryCounts();


    const renderDescriptionContent = (desc: Description) => {
        switch (desc.type) {
            case "titleh1":
                return <h1 className="text-3xl md:text-5xl font-bold my-4 text-primary border-l-[5px] border-btnHover pl-5 capitalize"> {desc.value}</h1>;
            case "titleh2":
                return <h2 className="text-3xl font-semibold my-3 capitalize">{desc.value}</h2>;
            case "titleh3":
                return <h3 className="text-2xl font-medium my-2">{desc.value}</h3>;
            case "text":
                return <p className="text-base my-1 text-center md:text-justify">{desc.value}</p>;
            case "img":
                return (
                    <LazyImage
                        src={desc.value as string}
                        alt={desc.alt || "blog image"}
                        className="w-full h-auto object-contain rounded-xl my-2 shadow"
                    />
                );
            case "list":
                return (
                    <ul className="list-disc ml-5 my-2">
                        {(desc.value as string[]).map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                );
            case "video":
                return <p className="my-2">Video: {desc.value}</p>;
            default:
                return null;
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

    return (
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 pt-20">
            <div className="w-full md:w-[65%]">
                <div className="flex-grow md:pr-4 gap-6 flex flex-col w-full">
                    {blogInfo.description.map((desc, index) => (
                        <React.Fragment key={index}>
                            {renderDescriptionContent(desc)}
                        </React.Fragment>
                    ))}
                </div>
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
                            className={`text-lg font-semibold border-b px-5 py-3 text-primary hover:text-white hover:bg-btnHover hover:border-none hover:rounded-xl  hover:border-btnHover transition-all duration-300 ease-in-out`}
                        >
                            <button
                                onClick={() => handleSelectedCategory('All')}
                                className="w-full flex justify-between items-center "
                                aria-label="all category link"
                            >
                                <span className="capitalize">All - {`(${dataBlog.length})`}</span>
                                <i className="fa-solid fa-chevrons-right"></i>
                            </button>
                        </li>
                        {
                            dataBlog.length > 0 && (
                                [...categorySet].map((category, index) => (
                                    <li
                                        key={index}
                                        className={`text-lg font-semibold border-b px-5 py-3  text-primary hover:bg-btnHover hover:border-none hover:rounded-xl hover:border-btnHover hover:text-white transition-all duration-300 ease-in-out`}
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
                            <li className="text-primary text-lg my-2">
                                No recent blogs available.
                            </li>
                        )}
                    </ul>


                </div>

                <div className="rounded-2xl border shadow px-5 py-4 mb-10 bg-[#F5F7FA]">
                    <p
                        className="text-center md:text-start text-2xl font-bold py-5 capitalize text-primary"
                    >
                        Follow Us
                    </p>
                    <div
                        className="border-b-2 border-[#EBECE9] mb-5 relative before:absolute before:w-1/3 before:bg-primary before:h-1 before:left-0 before:top-0"
                    >
                    </div>
                    <div className="flex justify-center md:justify-start items-center gap-5">
                        <RedesIcons redesSociales={redesSociales} bgColor />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DetailBlogComponent