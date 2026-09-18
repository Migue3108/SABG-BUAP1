import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Building2,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Target,
  Compass,
  GraduationCap,
  Landmark,
  BookOpen,
} from "lucide-react";

export const metadata = {
  title: "Conócenos | SABG - BUAP",
  description:
    "Conoce la misión, visión, directorio institucional y equipo del Sistema de Acompañamiento del Buen Gobierno Municipal (SABG-BUAP).",
};

export default function ConocenosPage() {
  return (
    <div className="auth-theme-forced min-h-screen bg-[#f5f7fa] text-[#18212b] font-sans antialiased flex flex-col justify-between">
      {/* =========================================================================
          1. Franja Institucional Superior
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
            Facultad de Administración &bull; Programa SABG
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. Encabezado Principal
         ========================================================================= */}
      <header className="bg-white border-b border-[#dce3ea] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
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
                <span className="text-xl font-black text-[#174a91] tracking-tight group-hover:text-[#274b8f] transition-colors">
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

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#dce3ea] bg-white hover:bg-slate-50 text-[#18212b] text-sm font-semibold transition-all hover:border-[#b8c6d4]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Inicio</span>
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
          3. Hero Informativo
         ========================================================================= */}
      <section className="bg-white border-b border-[#dce3ea] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf0fa] text-xs font-semibold text-[#315aa6] mb-4 border border-[#315aa6]/20">
              <Users className="w-3.5 h-3.5" />
              <span>Conócenos &bull; Alianza Estratégica Institucional</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0b2341] leading-tight mb-5">
              Transformando la Gestión Pública Municipal en Puebla
            </h1>
            <p className="text-base sm:text-lg text-[#5f6b76] leading-relaxed">
              El <strong>Sistema de Acompañamiento del Buen Gobierno (SABG–BUAP)</strong> es
              una iniciativa de colaboración estratégica entre el Gobierno del Estado de
              Puebla y la Benemérita Universidad Autónoma de Puebla, a través de la Facultad
              de Administración, diseñada para elevar los estándares de profesionalización,
              control interno, transparencia e integridad en los 217 municipios poblanos.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. Misión y Visión
         ========================================================================= */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Misión */}
            <div className="bg-white p-8 rounded-2xl border border-[#dce3ea] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#eaf0fa]/60 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0b2341] mb-3">Nuestra Misión</h2>
              <p className="text-[#5f6b76] leading-relaxed">
                Brindar acompañamiento técnico, metodológico y académico de alta calidad a
                las administraciones públicas municipales del Estado de Puebla, fortaleciendo
                sus estructuras orgánicas, procesos de planeación, mecanismos de rendición
                de cuentas y cultura de integridad, mediante la vinculación directa de docentes
                expertos y estudiantes universitarios comprometidos con el servicio público.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white p-8 rounded-2xl border border-[#dce3ea] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#eaf0fa]/60 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#eaf0fa] text-[#315aa6] flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#0b2341] mb-3">Nuestra Visión</h2>
              <p className="text-[#5f6b76] leading-relaxed">
                Consolidar a los 217 municipios del Estado de Puebla como referentes
                nacionales de gobernanza democrática, eficiencia administrativa, finanzas
                sanas y combate frontal a la corrupción, convirtiendo el modelo SABG–BUAP en
                el estándar rector de vinculación universitaria aplicada al bienestar social.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. Directorio Institucional y Equipo Rector
         ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-y border-[#dce3ea]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf0fa] text-xs font-semibold text-[#315aa6] mb-3 border border-[#315aa6]/20">
              <Landmark className="w-3.5 h-3.5" />
              <span>Directorio Institucional</span>
            </div>
            <h2 className="text-3xl font-black text-[#0b2341] tracking-tight">
              Liderazgo y Coordinación del Proyecto
            </h2>
            <p className="text-sm text-[#5f6b76] mt-2">
              Créditos institucionales formalizados en el Manual Rector de Buen Gobierno y
              Gobernanza Municipal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Bloque Gobierno del Estado de Puebla */}
            <div className="p-6 rounded-xl border border-[#dce3ea] bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#e2e8f0]">
                  <div className="w-10 h-10 rounded-lg bg-[#0b2341] text-white flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0b2341]">
                      Gobierno del Estado de Puebla
                    </h3>
                    <p className="text-xs text-[#5f6b76]">Poder Ejecutivo Estatal</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-bold text-[#315aa6] uppercase tracking-wider">
                      Gobernador Constitucional del Estado de Puebla
                    </p>
                    <p className="text-base font-bold text-[#0b2341] mt-0.5">
                      Lic. Alejandro Armenta Mier
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Impulsor del modelo de gobernanza humanista y buen gobierno en los 217
                      ayuntamientos de la entidad.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-bold text-[#315aa6] uppercase tracking-wider">
                      Secretaría Anticorrupción y Buen Gobierno
                    </p>
                    <p className="text-base font-bold text-[#0b2341] mt-0.5">
                      Titular y Órgano de Control Estatal
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Coordinación de políticas de integridad, auditoría gubernamental y
                      evaluación del desempeño municipal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloque BUAP */}
            <div className="p-6 rounded-xl border border-[#dce3ea] bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#e2e8f0]">
                  <div className="w-10 h-10 rounded-lg bg-[#174a91] text-white flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0b2341]">
                      Benemérita Universidad Autónoma de Puebla
                    </h3>
                    <p className="text-xs text-[#5f6b76]">Facultad de Administración</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-bold text-[#315aa6] uppercase tracking-wider">
                      Rectora de la BUAP
                    </p>
                    <p className="text-base font-bold text-[#0b2341] mt-0.5">
                      Dra. María Lilia Cedillo Ramírez
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Compromiso universitario con la responsabilidad social y la vinculación
                      con las comunidades poblanas.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-bold text-[#315aa6] uppercase tracking-wider">
                      Directora de la Facultad de Administración
                    </p>
                    <p className="text-base font-bold text-[#0b2341] mt-0.5">
                      Dra. María Guadalupe Morales Espíndola
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Coordinación académica, metodológica y operativa del despliegue del
                      programa SABG–BUAP en territorio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comité Operativo y Académico */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6">
            <h4 className="text-base font-bold text-[#0b2341] mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#315aa6]" />
              <span>Modelo de Vinculación y Células de Trabajo en Territorio</span>
            </h4>
            <p className="text-sm text-[#5f6b76] leading-relaxed mb-4">
              La operatividad del SABG–BUAP se sustenta en células interdisciplinarias
              integradas por <strong>docentes asesores de posgrado y licenciatura</strong>,
              así como <strong>estudiantes de Servicio Social y Práctica Profesional</strong> de
              la Facultad de Administración, quienes colaboran hombro a hombro con los
              <strong> enlaces municipales</strong> (presidentes, síndicos, contralores y
              directores de planeación) de cada demarcación.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="block text-2xl font-black text-[#174a91]">217</span>
                <span className="text-xs font-medium text-slate-600">
                  Municipios del Estado de Puebla con cobertura programática
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="block text-2xl font-black text-[#174a91]">8 Capítulos</span>
                <span className="text-xs font-medium text-slate-600">
                  Ejes metodológicos del Documento Rector de Buen Gobierno
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <span className="block text-2xl font-black text-[#174a91]">100%</span>
                <span className="text-xs font-medium text-slate-600">
                  Acompañamiento técnico, confidencial y sin costo para el ayuntamiento
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          7. Pie de Página Institucional
         ========================================================================= */}
      <footer className="bg-[#0b2341] text-white border-t border-[#1b3964] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 pb-8 border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-black tracking-tight text-white">SABG</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/10 text-slate-200 px-2 py-0.5 rounded">
                  BUAP
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sistema de Acompañamiento del Buen Gobierno Municipal. Coordinación entre el
                Gobierno del Estado de Puebla y la Facultad de Administración de la BUAP.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-3">
                Enlaces Institucionales
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <a
                    href="https://administracion.buap.mx/content/sabg-buap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Facultad de Administración BUAP &rarr;
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.buap.mx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Portal Central BUAP &rarr;
                  </a>
                </li>
                <li>
                  <a
                    href="https://puebla.gob.mx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Gobierno del Estado de Puebla &rarr;
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-3">Acceso al Sistema</h4>
              <p className="text-xs text-slate-300 mb-4">
                Plataforma cerrada de gestión y evaluación institucional restringida a
                usuarios autorizados.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#174a91] hover:bg-[#274b8f] text-white text-xs font-semibold transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Ingresar al Portal</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <p>
              &copy; {new Date().getFullYear()} Benemérita Universidad Autónoma de Puebla.
              Todos los derechos reservados.
            </p>
            <p className="text-[11px]">
              Secretaría Anticorrupción y Buen Gobierno &bull; Estado de Puebla
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

