import Image from "next/image";
import Link from "next/link";
import { Lock, Building2, ShieldCheck, Award, ArrowRight } from "lucide-react";
import { PhotoCarousel, CarouselItem } from "@/components/home/photo-carousel";

const CAROUSEL_PHOTOS: CarouselItem[] = [
  {
    src: "/carousel/sabg_reunion1.jpg",
    alt: "Reunión de trabajo SABG - BUAP con autoridades municipales",
    caption: "Acompañamiento y vinculación institucional con ayuntamientos del Estado de Puebla",
  },
  {
    src: "/carousel/sabg_reunion2.jpg",
    alt: "Sesión de diagnóstico y evaluación municipal",
    caption: "Sesiones de trabajo técnico y metodológico con servidores públicos",
  },
  {
    src: "/carousel/sabg_reunion3.jpg",
    alt: "Capacitación en control interno y gobernanza",
    caption: "Capacitación en control interno, transparencia y rendición de cuentas",
  },
  {
    src: "/carousel/sabg_reunion4.jpg",
    alt: "Mesa de seguimiento del buen gobierno BUAP",
    caption: "Mesas de seguimiento y fortalecimiento de la gestión municipal",
  },
  {
    src: "/carousel/sabg_reunion5.jpg",
    alt: "Participación y entrega de instrumentos de diagnóstico",
    caption: "Implementación de los instrumentos de diagnóstico en municipios",
  },
  {
    src: "/carousel/sabg_reunion6.jpg",
    alt: "Colaboración interinstitucional BUAP y municipios de Puebla",
    caption: "Compromiso universitario con el desarrollo y la gobernanza municipal",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#18212b] font-sans antialiased flex flex-col justify-between">
      {/* =========================================================================
          1. Franja Institucional Superior (Estilo gob.mx - Solo informativa)
         ========================================================================= */}
      <div className="bg-[#0b2341] text-white text-xs border-b border-[#1b3964]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-semibold tracking-wider text-slate-200 text-[11px] sm:text-xs">
              GOBIERNO MUNICIPAL &bull; ESTADO DE PUEBLA
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300 text-[11px]">
              Benemérita Universidad Autónoma de Puebla
            </span>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Portal Oficial de Acompañamiento Institucional
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. Encabezado Principal (CONTIENE BOTÓN 1 DE 2 PARA INGRESAR)
         ========================================================================= */}
      <header className="bg-white border-b border-[#dce3ea]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Identidad Institucional */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src="/logotipo.png"
                alt="Logotipo BUAP - SABG"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#174a91] tracking-tight">
                  SABG
                </span>
                <span className="text-xs font-bold uppercase tracking-wider bg-[#eaf0fa] text-[#315aa6] px-2 py-0.5 rounded-md">
                  BUAP
                </span>
              </div>
              <p className="text-xs text-[#5f6b76] font-medium hidden sm:block">
                Sistema de Acompañamiento del Buen Gobierno Municipal
              </p>
            </div>
          </div>

          {/* BOTONES: Conócenos + Ingresar en el Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/conocenos"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#dce3ea] bg-white hover:bg-slate-50 text-[#18212b] text-sm font-semibold transition-all hover:border-[#b8c6d4]"
            >
              <span>Conócenos</span>
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#315aa6] hover:bg-[#274b8f] text-white text-sm font-semibold shadow-xs transition-all hover:shadow-md active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Ingresar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          3. Hero Principal (CONTIENE BOTÓN 2 DE 2 PARA INGRESAR)
         ========================================================================= */}
      <main className="flex-1 flex flex-col justify-center py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge Informativo */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eaf0fa] text-xs font-semibold text-[#315aa6] mb-6 border border-[#315aa6]/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>Portal Institucional de Servicios Municipales</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#18212b] leading-tight mb-5">
            Sistema de Acompañamiento <br className="hidden sm:inline" />
            del Buen Gobierno
          </h1>

          <p className="text-base sm:text-lg text-[#5f6b76] max-w-2xl mx-auto leading-relaxed mb-8">
            Plataforma institucional de la Benemérita Universidad Autónoma de Puebla
            orientada a fortalecer las capacidades de gestión pública, control
            interno y rendición de cuentas en los gobiernos municipales del Estado
            de Puebla.
          </p>

          {/* BOTÓN 2 DE 2: Ingresar al Sistema en el Hero */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#315aa6] hover:bg-[#274b8f] text-white text-base font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Aviso de Acceso Seguro */}
          <div className="mt-8 max-w-xl mx-auto p-4 rounded-xl bg-[#f7f9fc] border border-[#dce3ea] text-xs text-[#5f6b76] flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-[#315aa6] shrink-0" />
            <span>
              Acceso exclusivo mediante credenciales autorizadas para funcionarios y coordinadores municipales.
            </span>
          </div>
        </div>

        {/* =======================================================================
            4. Carrusel de Fotografías Institucionales
           ======================================================================= */}
        <PhotoCarousel items={CAROUSEL_PHOTOS} />

        {/* =======================================================================
            5. 3 Pilares Básicos Informativos
           ======================================================================= */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#dce3ea] shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#18212b] mb-1.5">
                Acompañamiento Municipal
              </h3>
              <p className="text-xs text-[#5f6b76] leading-relaxed">
                Asesoría técnica y metodológica con rigor académico orientada a la
                mejora continua de la administración local.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#dce3ea] shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#18212b] mb-1.5">
                Integridad y Control
              </h3>
              <p className="text-xs text-[#5f6b76] leading-relaxed">
                Fortalecimiento del control interno institucional, prevención de
                riesgos y apego estricto al marco normativo vigente.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#dce3ea] shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#18212b] mb-1.5">
                Respaldo BUAP
              </h3>
              <p className="text-xs text-[#5f6b76] leading-relaxed">
                Iniciativa desarrollada bajo estándares de excelencia académica y
                compromiso social con el desarrollo de Puebla.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          6. Pie de Página Institucional (Estilo gob.mx - Sin botones duplicados)
         ========================================================================= */}
      <footer className="bg-[#0b2341] text-white border-t border-[#1b3964]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo y Nombre */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white rounded-lg p-1 shrink-0">
                <Image
                  src="/logotipo.png"
                  alt="Logo BUAP"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-white">SABG &bull; BUAP</p>
                <p className="text-[11px] text-slate-300">
                  Benemérita Universidad Autónoma de Puebla
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Gobierno Municipal del Estado de Puebla
            </p>
          </div>

          <div className="border-t border-slate-800 mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Benemérita Universidad Autónoma de Puebla. Todos los derechos reservados.
            </p>
            <p className="text-[11px] text-slate-300">
              Uso exclusivo para servidores públicos autorizados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
