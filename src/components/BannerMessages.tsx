import type { ApiData } from "@/interfaces/dbData";

interface BannerCarouselProps {
  dataGlobal: ApiData;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ dataGlobal }) => {
  const message = dataGlobal?.estimateFree;

  if (!message || message.trim() === "") {
    return null;
  }

  const bannerMessages = [message, message, message];
  const marqueeText = bannerMessages.join("   •   ");

  return (
    <section className="w-full py-4 bg-secondary flex justify-center items-center overflow-hidden h-[56px]">
      <div className="relative w-full h-full gap-4 flex items-center overflow-hidden">
        <div className="whitespace-nowrap animate-marquee">
          <span className=" text-white text-xl font-bold px-4">
            {marqueeText}
          </span>

          <span className=" text-white text-xl font-bold px-4">
            {marqueeText}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          display: inline-block;
          min-width: max-content;
          animation: marquee 18s linear infinite;
        }

        @media (max-width: 768px) {
          .animate-marquee {
            animation: marquee 24s linear infinite;
          }
        }
      `}</style>
    </section>
  );
};

export default BannerCarousel;
