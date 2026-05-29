import { useState } from "react";

interface Props {
  data: any;
  selectedUrlCity?: string; // URL de mapa seleccionada inicialmente (opcional)
  showCityList?: boolean; // Mostrar chips de ciudades
  singleCityName?: string; // Mostrar esta ciudad en el heading
}

const Map = ({ data, selectedUrlCity, showCityList = true, singleCityName }: Props) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(
    selectedUrlCity || data.dataGeneral.location[0]?.urlCity || null
  );

  const handleCityClick = (urlCity: string) => {
    setSelectedCity(urlCity);
  };

  return (
    <div className="">
      <h2
        className="
        md:text-[40px] text-[30px] font-bold text-center bg-tertiary md:w-[80%] mx-auto md:rounded-full text-white md:py-0 py-4
        "
      >
         We Cover {data?.milesCover} Miles Around{" "}
        {singleCityName || data.dataGeneral.location.find((l: any) => l.urlCity === selectedCity)?.city || data.dataGeneral.location[0]?.city}
      </h2>
      {showCityList && (
        <div className="md:w-[80%] mx-auto w-[95%] flex flex-wrap relative z-10 gap-2 items-center justify-center py-2">
          {data.dataGeneral.location.map((item: any, index: number) => (
            <span
              key={index}
              onClick={() => handleCityClick(item.urlCity)}
              className={`cursor-pointer text-white px-8 py-2 rounded-full border-white min-w-[200px] max-w-[300px] flex justify-center items-center ${
                selectedCity === item.urlCity
                  ? "bg-tertiary border-primary"
                  : "bg-secondary border-secondary"
              }`}
            >
              <i className="fas fa-map-marker-alt mr-2" aria-hidden="true"></i>
              {item.city}
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        {selectedCity && (
          <iframe
            src={selectedCity}
            width="600"
            title="Geo Location"
            height="450"
            className="w-full"
            loading="lazy"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Map;
