import React, { useState, useEffect } from "react";
import FormatText from "@/hook/FormatText";

export interface Props {
  data: any;
}

const ServiceByLocation: React.FC<Props> = ({ data }) => {
  const areasWeServeOn = Boolean(
    (data as any)?.widgets?.areasWeServe ?? (data as any)?.widgets?.areasweserve,
  );

  const services = data?.services ?? [];
  const locations = (data?.dataGeneral?.location ?? []).slice(0);

  const grouped: Record<
    string,
    {
      cityName: string;
      citySlug: string;
      items: { href: string; serviceTitle: string }[];
    }
  > = {};

  let totalLinks = 0;
  for (const loc of locations) {
    const city = loc.city;
    const citySlug = FormatText(city);
    grouped[city] = { cityName: city, citySlug, items: [] };
    for (const service of services) {
      if (totalLinks >= 200) break;
      const serviceSlug = FormatText(service.title);
      grouped[city].items.push({
        href: `/services/${serviceSlug}-in-${citySlug}`,
        serviceTitle: service.title,
      });
      totalLinks++;
    }
  }

  const areasCount = new Set(locations.map((l: any) => l.city)).size;
  const cityEntries = Object.entries(grouped);

  // Estado para la ciudad seleccionada
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return cityEntries.length > 0 ? cityEntries[0][0] : "";
  });

  // Si cambia la lista de ciudades, selecciona la primera
  useEffect(() => {
    if (cityEntries.length > 0 && !grouped[selectedCity]) {
      setSelectedCity(cityEntries[0][0]);
    }
    // eslint-disable-next-line
  }, [cityEntries.length]);

  if (!areasWeServeOn) return null;

  return (
    <section
      id="areas-we-serve"
      className="w-full py-12 md:py-16 bg-gradient-to-b from-[rgba(0,180,232,0.04)] to-white"
    >
      <div className="md:max-w-7xl w-[92%] mx-auto">
        {/* Panel principal con efecto glass */}
        <div className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--primary)_60%,white_40%)] bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,180,232,0.10)]">
          {/* Decoraciones de fondo mejoradas */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-[color-mix(in_srgb,var(--primary)_30%,white_70%)] to-[color-mix(in_srgb,var(--tertiary)_30%,white_70%)] blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-gradient-to-tl from-[color-mix(in_srgb,var(--secondary)_20%,white_80%)] to-[color-mix(in_srgb,var(--primary)_20%,white_80%)] blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[color-mix(in_srgb,var(--tertiary)_10%,white_90%)] to-[color-mix(in_srgb,var(--primary)_10%,white_90%)] blur-3xl" />

          <div className="relative p-6 md:p-8 lg:p-10">
            {/* Header mejorado */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--primary)_30%,white_70%)] bg-gradient-to-r from-[color-mix(in_srgb,var(--primary)_10%,white_90%)] to-[color-mix(in_srgb,var(--tertiary)_10%,white_90%)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[color-mix(in_srgb,var(--primary)_80%,black_20%)] shadow-sm">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Service Coverage
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-black text-[var(--title)] leading-tight">
                Areas We{' '}
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                  Serve
                </span>
              </h2>
              <p className="mt-3 text-sm md:text-base text-[var(--text)]/70 max-w-2xl mx-auto">
                Explore locations where our team delivers trusted local service
                with excellence and dedication
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_8px_0_rgba(0,180,232,0.15)]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                {areasCount} Premium Locations
              </div>
            </div>

            {cityEntries.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
                <svg
                  className="mx-auto h-16 w-16 text-slate-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <p className="text-slate-500 text-lg font-medium">
                  No services or locations configured yet.
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Add locations to get started with your service coverage.
                </p>
              </div>
            ) : (
              <div className="flex flex-col-reverse lg:flex-row gap-8">
                {/* Panel de servicios - Grid mejorado */}
                <div className="flex-1 min-h-[400px]">
                  {cityEntries.map(([city, group], idx) => (
                    <div
                      key={city}
                      className={`services-grid gap-4 ${selectedCity === city ? "grid" : "hidden"}`}
                      data-city={city}
                      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
                    >
                      {group.items.map((it, itemIdx) => (
                        <a
                          key={it.href}
                          href={it.href}
                          className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-[color-mix(in_srgb,var(--primary)_10%,white_90%)] hover:border-[var(--primary)] transition-all duration-300  hover:shadow-[0_4px_24px_0_rgba(0,180,232,0.10)] hover:-translate-y-1"
                          style={{ animation: `fadeInUp 0.5s ease-out ${itemIdx * 0.05}s both` }}
                          aria-label={`View ${it.serviceTitle} in ${group.cityName}`}
                        >
                          {/* Gradiente decorativo en hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 via-transparent to-[var(--secondary)]/0 group-hover:from-[var(--primary)]/10 group-hover:to-[var(--secondary)]/10 transition-all duration-500" />

                          <div className="relative">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center  shadow-[0_2px_8px_0_rgba(0,180,232,0.15)] group-hover:shadow-[0_2px_12px_0_rgba(0,180,232,0.22)] transition-shadow">
                                <svg
                                  className="h-5 w-5 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-[var(--title)] font-semibold text-sm leading-snug group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                                  {it.serviceTitle}
                                </h3>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              <div className="flex items-center gap-1.5 text-xs text-[var(--text)]/60">
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {group.cityName}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                                Learn more →
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Panel de ciudades - Diseño mejorado */}
                <div className="w-full lg:w-72 shrink-0">
                  <div className="sticky top-24 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,white_80%)] bg-white shadow-[0_2px_8px_0_rgba(0,180,232,0.10)] overflow-hidden">
                    <div className="bg-gradient-to-r from-[color-mix(in_srgb,var(--primary)_5%,white_95%)] to-white px-4 py-3 border-b border-[color-mix(in_srgb,var(--primary)_10%,white_90%)]">
                      <h3 className="text-sm font-bold text-[var(--secondary)] flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-[var(--primary)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        Select Location
                      </h3>
                    </div>
                    <div className="p-2 flex flex-col gap-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                      {cityEntries.map(([city, group]) => (
                        <button
                          key={city}
                          type="button"
                          className={`city-btn group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                            selectedCity === city
                              ? "city-active bg-[color-mix(in_srgb,var(--primary)_10%,white_90%)] text-[var(--primary)] shadow-sm"
                              : "text-[var(--text)]/80 hover:bg-[color-mix(in_srgb,var(--primary)_5%,white_95%)] hover:text-[var(--primary)]"
                          }`}
                          data-city={city}
                          onClick={() => setSelectedCity(city)}
                        >
                          <span
                            className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              selectedCity === city
                                ? "bg-[var(--primary)] text-white shadow-[0_2px_8px_0_rgba(0,180,232,0.15)]"
                                : "bg-[color-mix(in_srgb,var(--primary)_5%,white_95%)] text-[var(--primary)] group-hover:bg-[color-mix(in_srgb,var(--primary)_10%,white_90%)] group-hover:text-[var(--secondary)]"
                            }`}
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                            </svg>
                          </span>
                          <span className="flex-1 truncate font-semibold text-sm">
                            {group.cityName}
                          </span>
                          <span
                            className={`inline-flex items-center justify-center min-w-[2rem] h-6 rounded-full text-xs font-bold transition-all duration-200 ${
                              selectedCity === city
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[color-mix(in_srgb,var(--primary)_5%,white_95%)] text-[var(--primary)] group-hover:bg-[color-mix(in_srgb,var(--primary)_10%,white_90%)] group-hover:text-[var(--secondary)]"
                            }`}
                          >
                            {group.items.length}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceByLocation;

// Animación y estilos globales deben ir en el CSS global del proyecto o importarse en el layout principal si no están aún.
