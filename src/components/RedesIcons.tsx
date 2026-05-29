import type { SocialMedia } from "../interfaces/dbData";

interface RedesSocialProps {
  redesSociales: SocialMedia[] | undefined;
  bgColor?: boolean;
  textColor?: string;
  bgColorCustom?: string;
  position?: string;
}

export const RedesIcons: React.FC<RedesSocialProps> = ({ redesSociales, bgColor, textColor, bgColorCustom, position }) => {
  return (
    <div className={`flex flex-wrap items-center ${bgColor ? 'gap-2 md:gap-3' : 'gap-0'}`}>
      {redesSociales && redesSociales.map((redSocial) => (
        <a
          key={redSocial._id}
          href={redSocial.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bgColorCustom ? ' rounded-full px-3.5 py-2.5 md:py-2 text-sm md:text-lg': 'bg-none'} ${textColor ? textColor : 'text-black'} ${bgColor ? ' rounded-full px-3.5 py-2.5 md:py-2 text-sm md:text-lg text-black' : 'text-xl hover:text-btnHover'} transition-all duration-300 hover:-translate-y-1.5  `}
          aria-label={`Visitar nuestro perfil en ${redSocial.name}`}
        >
          <i className={`fab fa-${redSocial.icon}`}></i>
        </a>
      ))}
    </div>

  );
};

