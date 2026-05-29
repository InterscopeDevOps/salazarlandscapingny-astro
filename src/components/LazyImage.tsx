import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    height?: number;
    className: string;
    imgLoading?: "eager" | "lazy";

}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, height, className ,imgLoading }) => {
    const [isLoading, setIsLoading] = useState(true);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (imgRef.current) {
                        imgRef.current.src = src;
                        setIsLoading(false);
                        observer.unobserve(imgRef.current);
                    }
                }
            });
        },
        {
            rootMargin: "50px"
        });



        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src]);

    return (
        <img
            ref={imgRef}
            src={isLoading ? "/assets/images/stockWeb/PlaceholderBlur.webp" : src}
            alt={alt}
            height={height}
            className={`${className}`}
            loading={imgLoading ? imgLoading : "lazy"}
        />
    );
};

export default LazyImage;
