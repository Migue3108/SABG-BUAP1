"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Search,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Users,
  Scale,
  BookOpen,
  HelpCircle,
  Building2,
  Lock,
  Compass,
  FolderKanban,
  Download,
  ExternalLink,
  ChevronRight,
  ClipboardCheck,
  HeartHandshake,
} from "lucide-react";

// Datos de los 8 capítulos del SABG-BUAP
const CHAPTERS = [
  {
    number: "01",
    title: "Autoevaluación y Marco Normativo",
    description:
      "Diagnóstico previo de cumplimiento normativo, instrumentos jurídicos y base reglamentaria municipal.",
    href: "/capitulo-1",
    icon: Scale,
    category: "Normativa",
    tags: ["leyes", "reglamentos", "marco legal", "autoevaluacion"],
  },
  {
    number: "02",
    title: "Diagnóstico y Evidencias",
    description:
      "Levantamiento situacional en campo, recolección de evidencias documentales e instrumento diagnóstico.",
    href: "/capitulo-2",
    icon: Compass,
    category: "Diagnóstico",
    tags: ["diagnostico", "evidencias", "instrumento", "ruta"],
  },
  {
    number: "03",
    title: "Plan de Acción y Mejora Continua",
    description:
      "Diseño y calendarización del plan de mejora, acciones correctivas y verificación de cumplimiento.",
    href: "/capitulo-3",
    icon: FolderKanban,
    category: "Planeación",
    tags: ["plan", "mejora", "acciones", "cierre"],
  },
  {
    number: "04",
    title: "Control Interno y Matriz de Riesgos",
    description:
      "Implementación del sistema de control interno y matriz para mitigar riesgos institucionales.",
    href: "/capitulo-4",
    icon: ShieldCheck,
    category: "Control",
    tags: ["control interno", "riesgos", "matriz", "auditoria"],
  },
  {
    number: "05",
    title: "Cumplimiento y Reportes",
    description:
      "Lista de verificación del estado de cumplimiento normativo y generación de reportes ejecutivos.",
    href: "/capitulo-5",
    icon: ClipboardCheck,
    category: "Auditoría",
    tags: ["cumplimiento", "reporte", "informes", "verificacion"],
  },
  {
    number: "06",
    title: "Código de Ética e Integridad",
    description:
      "Adopción de directrices éticas, guía de integridad pública y comités de conducta para servidores públicos.",
    href: "/capitulo-6",
    icon: HeartHandshake,
    category: "Integridad",
    tags: ["etica", "integridad", "conducta", "valores"],
  },
  {
    number: "07",
    title: "Participación Ciudadana y Programa",
    description:
      "Mecanismos de vinculación comunitaria, programa de buen gobierno y registro de participación social.",
    href: "/capitulo-7",
    icon: Users,
    category: "Gobernanza",
    tags: ["participacion", "ciudadania", "programa", "registro"],
  },
  {
    number: "08",
    title: "Indicadores de Desempeño y Avance",
    description:
      "Tablero de control con métricas e indicadores de gestión pública y rendición de cuentas periódica.",
    href: "/capitulo-8",
    icon: BarChart3,
    category: "Métricas",
    tags: ["indicadores", "desempeño", "metricas", "informe avance"],
  },
];

// Documentos normativos disponibles en el sistema
const NORMATIVE_DOCS = [
  {
    title: "Ley Orgánica Municipal del Estado de Puebla",
    category: "Legislación Estatal",
    filename: "05-ley-organica-municipal-puebla.txt",
    desc: "Bases de organización, atribuciones y funcionamiento de la administración municipal.",
  },
  {
    title: "Ley General de Responsabilidades Administrativas",
    category: "Legislación Federal",
    filename: "12-ley-general-responsabilidades-administrativas.txt",
    desc: "Obligaciones, faltas graves y sanciones de los servidores públicos.",
  },
  {
    title: "Ley de Transparencia y Acceso a la Información de Puebla",
    category: "Transparencia",
    filename: "13-ley-transparencia-puebla.txt",
    desc: "Garantías y lineamientos de acceso a la información pública municipal.",
  },
  {
    title: "Código de Ética, Integridad y Buen Gobierno",
    category: "Modelo SABG",
    filename: "17-codigo-etica-integridad-buen-gobierno.txt",
    desc: "Principios rectores para el servicio público con perspectiva de honestidad.",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrado reactivo en base al input de búsqueda
  const filteredChapters = useMemo(() => {
    if (!searchTerm.trim()) return CHAPTERS;
    const query = searchTerm.toLowerCase().trim();
    return CHAPTERS.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.tags.some((t) => t.toLowerCase().includes(query))
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#18212b] font-sans antialiased flex flex-col">
      {/* =========================================================================
          1. Franja Institucional Superior (Estilo gob.mx)
         ========================================================================= */}
      <div className="bg-[#0b2341] text-white text-xs border-b border-[#1b3964]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wider text-slate-200">
              GOBIERNO MUNICIPAL &bull; ESTADO DE PUEBLA
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Benemérita Universidad Autónoma de Puebla
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <Link
              href="/recursos"
              className="hover:text-white transition-colors hidden sm:inline"
            >
              Marco Normativo
            </Link>
            <Link
              href="/ayuda"
              className="hover:text-white transition-colors hidden sm:inline"
            >
              Mesa de Ayuda
            </Link>
            <Link
              href="/auth/login"
              className="text-[#93c5fd] font-medium hover:text-white flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              Acceso al Sistema
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. Encabezado de Navegación Principal
         ========================================================================= */}
      <header className="bg-white border-b border-[#dce3ea] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logotipo y Título */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/logotipo.png"
                alt="Logotipo SABG-BUAP"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#174a91] tracking-tight group-hover:text-[#315aa6] transition-colors">
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
          </Link>

          {/* Navegación y Botón Ingresar */}
          <nav className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#5f6b76]">
              <Link href="#modulos" className="hover:text-[#315aa6] transition-colors">
                Módulos
              </Link>
              <Link href="#normativa" className="hover:text-[#315aa6] transition-colors">
                Normatividad
              </Link>
              <Link href="/seguimiento" className="hover:text-[#315aa6] transition-colors">
                Seguimiento
              </Link>
              <Link href="/ayuda" className="hover:text-[#315aa6] transition-colors">
                Ayuda
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#315aa6] hover:bg-[#274b8f] text-white text-sm font-semibold shadow-sm transition-all hover:shadow-md active:scale-98"
              >
                <Lock className="w-4 h-4" />
                <span>Ingresar</span>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* =========================================================================
          3. Hero Section Institucional (Búsqueda Central estilo gob.mx)
         ========================================================================= */}
      <section className="bg-gradient-to-b from-[#0b2341] via-[#174a91] to-[#274b8f] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decoración geométrica institucional de fondo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-blue-100 backdrop-blur-xs mb-6 border border-white/15">
            <Building2 className="w-3.5 h-3.5 text-blue-200" />
            <span>Plataforma Oficial de Evaluación y Acompañamiento Municipal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white mb-4">
            Sistema de Acompañamiento <br className="hidden sm:inline" />
            del Buen Gobierno
          </h1>

          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
            Herramienta institucional desarrollada por la BUAP para el diagnóstico,
            mejora continua, control interno y rendición de cuentas de los 217
            municipios del Estado de Puebla.
          </p>

          {/* Barra de Búsqueda estilo Gob.mx */}
          <div className="bg-white rounded-xl shadow-2xl p-2 max-w-2xl mx-auto flex items-center gap-2 border border-blue-100/20">
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5 text-[#315aa6]" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="¿Qué trámite, capítulo o normativa buscas? (ej. diagnóstico, riesgos, ética...)"
              className="w-full py-2.5 px-2 text-sm text-[#18212b] placeholder-slate-400 focus:outline-hidden bg-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
              >
                Limpiar
              </button>
            )}
            <Link
              href="#modulos"
              className="px-5 py-2.5 bg-[#315aa6] hover:bg-[#274b8f] text-white text-sm font-semibold rounded-lg shrink-0 transition-colors"
            >
              Buscar
            </Link>
          </div>

          {/* Accesos Rápidos en Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-blue-100">
            <span className="font-semibold text-white/80">Más buscados:</span>
            {[
              { label: "Diagnóstico", query: "diagnóstico" },
              { label: "Matriz de Riesgos", query: "riesgos" },
              { label: "Código de Ética", query: "ética" },
              { label: "Autoevaluación", query: "autoevaluación" },
              { label: "Indicadores", query: "indicadores" },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => setSearchTerm(chip.query)}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/10 text-white"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. Tarjetas de Acceso Destacado (Trámites Principales)
         ========================================================================= */}
      <section className="-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/auth/login"
            className="group bg-white p-5 rounded-xl border border-[#dce3ea] shadow-sm hover:shadow-md hover:border-[#315aa6] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#18212b] group-hover:text-[#315aa6] transition-colors">
                Diagnóstico Inicial
              </h2>
              <p className="text-xs text-[#5f6b76] mt-1 line-clamp-2">
                Inicia el levantamiento municipal y define la ruta de trabajo institucional.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#315aa6] group-hover:translate-x-1 transition-transform">
              <span>Ingresar al módulo</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/recursos"
            className="group bg-white p-5 rounded-xl border border-[#dce3ea] shadow-sm hover:shadow-md hover:border-[#315aa6] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#18212b] group-hover:text-[#315aa6] transition-colors">
                Marco Normativo
              </h2>
              <p className="text-xs text-[#5f6b76] mt-1 line-clamp-2">
                Consulta leyes orgánicas, reglamentos y lineamientos aplicables a municipios.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#315aa6] group-hover:translate-x-1 transition-transform">
              <span>Ver biblioteca</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/auth/login"
            className="group bg-white p-5 rounded-xl border border-[#dce3ea] shadow-sm hover:shadow-md hover:border-[#315aa6] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#18212b] group-hover:text-[#315aa6] transition-colors">
                Control Interno
              </h2>
              <p className="text-xs text-[#5f6b76] mt-1 line-clamp-2">
                Elabora la matriz de riesgos y fortalece la fiscalización preventiva.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#315aa6] group-hover:translate-x-1 transition-transform">
              <span>Gestionar riesgos</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/ayuda"
            className="group bg-white p-5 rounded-xl border border-[#dce3ea] shadow-sm hover:shadow-md hover:border-[#315aa6] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#18212b] group-hover:text-[#315aa6] transition-colors">
                Mesa de Acompañamiento
              </h2>
              <p className="text-xs text-[#5f6b76] mt-1 line-clamp-2">
                Guías paso a paso, manuales de usuario y canales de soporte con la BUAP.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#315aa6] group-hover:translate-x-1 transition-transform">
              <span>Centro de ayuda</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          5. Módulos y Capítulos del Sistema (Grid Completo estilo gob.mx)
         ========================================================================= */}
      <section id="modulos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#dce3ea]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#315aa6] mb-1">
              <Building2 className="w-4 h-4" />
              <span>Ejes del Modelo de Acompañamiento</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#18212b]">
              Capítulos del Sistema SABG-BUAP
            </h2>
            <p className="text-sm text-[#5f6b76] mt-1">
              Selecciona cualquiera de las 8 dimensiones operativas de la administración municipal.
            </p>
          </div>

          {searchTerm && (
            <div className="mt-3 md:mt-0 text-xs text-[#5f6b76]">
              Mostrando <span className="font-bold text-[#315aa6]">{filteredChapters.length}</span> resultados para{" "}
              <span className="font-semibold italic">&ldquo;{searchTerm}&rdquo;</span>
            </div>
          )}
        </div>

        {filteredChapters.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-[#dce3ea] p-12 text-center">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-base font-semibold text-[#18212b]">
              No se encontraron módulos con ese criterio
            </p>
            <p className="text-xs text-[#5f6b76] mt-1">
              Intenta con otra palabra clave como &ldquo;diagnóstico&rdquo;, &ldquo;ética&rdquo; o &ldquo;riesgos&rdquo;.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-[#eaf0fa] text-[#315aa6] rounded-lg text-xs font-semibold hover:bg-[#dce3ea] transition-colors"
            >
              Ver todos los capítulos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredChapters.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.number}
                  className="bg-white rounded-xl border border-[#dce3ea] hover:border-[#315aa6] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black tracking-widest text-[#315aa6] bg-[#eaf0fa] px-2.5 py-1 rounded-md">
                        CAPÍTULO {cap.number}
                      </span>
                      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#174a91] group-hover:bg-[#315aa6] group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#18212b] group-hover:text-[#315aa6] transition-colors line-clamp-2">
                      {cap.title}
                    </h3>

                    <p className="text-xs text-[#5f6b76] mt-2.5 leading-relaxed line-clamp-3">
                      {cap.description}
                    </p>
                  </div>

                  <div className="px-6 py-3 bg-[#f7f9fc] border-t border-[#dce3ea] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#7b8494] uppercase tracking-wider">
                      {cap.category}
                    </span>
                    <Link
                      href="/auth/login"
                      className="text-xs font-bold text-[#315aa6] group-hover:text-[#174a91] inline-flex items-center gap-1"
                    >
                      <span>Acceder</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          6. Sección Normativa y Documentos Oficiales
         ========================================================================= */}
      <section id="normativa" className="bg-[#f7f9fc] border-y border-[#dce3ea] py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#315aa6]">
                Fundamento Jurídico
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#18212b] mt-1">
                Leyes y Documentos Rectores
              </h2>
              <p className="text-sm text-[#5f6b76] mt-1">
                Instrumentos normativos que sustentan el modelo de buen gobierno en los municipios poblanos.
              </p>
            </div>
            <Link
              href="/recursos"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold text-[#315aa6] hover:text-[#174a91]"
            >
              <span>Ver repositorio completo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NORMATIVE_DOCS.map((doc) => (
              <div
                key={doc.title}
                className="bg-white p-5 rounded-xl border border-[#dce3ea] hover:border-[#315aa6] transition-colors flex items-start gap-4 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-lg bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#315aa6] uppercase tracking-wide">
                      {doc.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#18212b] mt-0.5">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-[#5f6b76] mt-1 leading-relaxed">
                    {doc.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <Link
                      href={`/resources/chapter-1/${doc.filename}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-semibold text-[#315aa6] hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Consultar texto
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. Estadísticas y Enfoque BUAP
         ========================================================================= */}
      <section className="bg-white py-16 border-b border-[#dce3ea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#dce3ea]">
            <div className="pt-4 md:pt-0">
              <p className="text-4xl lg:text-5xl font-black text-[#174a91]">217</p>
              <p className="text-sm font-bold text-[#18212b] mt-2">
                Municipios de Puebla
              </p>
              <p className="text-xs text-[#5f6b76] max-w-xs mx-auto mt-1">
                Ámbito de cobertura para el fortalecimiento institucional y acompañamiento continuo.
              </p>
            </div>

            <div className="pt-6 md:pt-0">
              <p className="text-4xl lg:text-5xl font-black text-[#315aa6]">8</p>
              <p className="text-sm font-bold text-[#18212b] mt-2">
                Capítulos Metodológicos
              </p>
              <p className="text-xs text-[#5f6b76] max-w-xs mx-auto mt-1">
                Desde autoevaluación y control de riesgos hasta indicadores y rendición de cuentas.
              </p>
            </div>

            <div className="pt-6 md:pt-0">
              <p className="text-4xl lg:text-5xl font-black text-[#16835d]">100%</p>
              <p className="text-sm font-bold text-[#18212b] mt-2">
                Metodología BUAP
              </p>
              <p className="text-xs text-[#5f6b76] max-w-xs mx-auto mt-1">
                Desarrollada bajo estándares de integridad, transparencia y derechos humanos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. Pie de Página Institucional (Estilo gob.mx)
         ========================================================================= */}
      <footer className="bg-[#0b2341] text-white mt-auto">
        {/* Cuerpo Principal del Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Columna 1: Identidad Institucional */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-11 h-11 bg-white rounded-lg p-1">
                  <Image
                    src="/logotipo.png"
                    alt="Logo BUAP"
                    fill
                    sizes="44px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">SABG-BUAP</h3>
                  <p className="text-[11px] text-slate-300">Gobierno Municipal</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sistema de Acompañamiento del Buen Gobierno para los Ayuntamientos
                del Estado de Puebla. Una iniciativa de la Benemérita Universidad
                Autónoma de Puebla.
              </p>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 pb-1 border-b border-slate-700">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <Link href="/auth/login" className="hover:text-white transition-colors">
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-white transition-colors">
                    Solicitud de Registro
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Tablero de Control
                  </Link>
                </li>
                <li>
                  <Link href="/seguimiento" className="hover:text-white transition-colors">
                    Seguimiento Municipal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Marco Normativo */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 pb-1 border-b border-slate-700">
                Marco Institucional
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <Link href="/recursos" className="hover:text-white transition-colors">
                    Leyes y Decretos
                  </Link>
                </li>
                <li>
                  <Link href="/capitulo-6/codigo-etica" className="hover:text-white transition-colors">
                    Código de Ética
                  </Link>
                </li>
                <li>
                  <Link href="/capitulo-1/autoevaluacion" className="hover:text-white transition-colors">
                    Autoevaluación Municipal
                  </Link>
                </li>
                <li>
                  <Link href="/ayuda" className="hover:text-white transition-colors">
                    Preguntas Frecuentes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 4: Soporte y Contacto */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 pb-1 border-b border-slate-700">
                Atención y Soporte
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Para dudas sobre el levantamiento de instrumentos o acceso de funcionarios municipales:
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="font-semibold text-white">BUAP - Puebla, México</p>
                <p>Mesa de Soporte SABG</p>
                <Link
                  href="/ayuda"
                  className="inline-flex items-center gap-1.5 text-[#93c5fd] hover:text-white font-semibold mt-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Ir al Centro de Ayuda
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Franja Inferior de Derechos y Privacidad */}
        <div className="bg-[#071629] border-t border-slate-800 text-xs text-slate-400 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              &copy; {new Date().getFullYear()} Benemérita Universidad Autónoma de Puebla. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-white transition-colors cursor-pointer">
                Aviso de Privacidad
              </span>
              <span>&bull;</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Términos y Condiciones
              </span>
              <span>&bull;</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Portal de Transparencia
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
