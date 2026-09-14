"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

export type CarouselItem = {
  src: string;
  alt: string;
  caption?: string;
};

type PhotoCarouselProps = {
  items?: CarouselItem[];
  autoPlayInterval?: number;
};

export function PhotoCarousel({
  items = [],
  autoPlayInterval = 5000,
}: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = items.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, total, nextSlide, autoPlayInterval]);

  // Si aún no hay imágenes cargadas en la carpeta
  if (total === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="relative w-full h-72 sm:h-96 rounded-2xl bg-[#f7f9fc] border-2 border-dashed border-[#dce3ea] flex flex-col items-center justify-center text-center p-6 text-[#7b8494]">
          <div className="w-16 h-16 rounded-full bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-3">
            <ImageIcon className="w-8 h-8" />
          </div>
          <p className="text-base font-bold text-[#18212b]">
            Galería Fotográfica Institucional
          </p>
          <p className="text-xs text-[#5f6b76] max-w-md mt-1.5 leading-relaxed">
            Las fotografías se mostrarán aquí en cuanto agregues los archivos a la carpeta{" "}
            <code className="bg-slate-200 px-1.5 py-0.5 rounded-sm font-mono text-[11px] text-[#18212b]">
              public/carousel/
            </code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div
        className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-[#dce3ea] group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Diapositivas */}
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={item.src}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority={index === 0}
              />
              {/* Degradado inferior y pie de foto */}
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                  <p className="text-sm sm:text-base font-semibold drop-shadow-xs">
                    {item.caption}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Botones de navegación (anterior / siguiente) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-xs focus:outline-hidden opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Siguiente foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-xs focus:outline-hidden opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicadores inferiores (puntos) */}
        {total > 1 && (
          <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Ir a foto ${i + 1}`}
                className={`transition-all rounded-full ${
                  i === currentIndex
                    ? "w-7 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
