export default function Hero({ local }) {
  const nombre = local?.nombre || "DEMO";

  // Si el nombre supera los 12 caracteres, reducimos la escala para evitar desbordes
  const esLargo = nombre.length > 12;

  const clasesTamano = esLargo ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.1em]" : "text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em]";

  return (
    <div id="inicio" className="w-full flex flex-col bg-bg-custom pt-24 md:pt-28">
      {/* Título */}
      <div className="w-full pt-6 md:pt-8 pb-0 flex flex-col items-center justify-center bg-bg-custom select-none px-4">
        <h1 className={`w-full max-w-5xl uppercase font-bold text-text-primary font-sans text-center break-words leading-tight ${clasesTamano}`}>{nombre}</h1>

        <div className="flex items-center gap-4 mt-3 w-full max-w-[420px] px-6">
          <span className="flex-1 h-[1px] bg-accent/40" />
          <span className="text-xs md:text-sm tracking-[0.45em] text-accent font-medium uppercase pl-[0.45em]">Indumentaria</span>
          <span className="flex-1 h-[1px] bg-accent/40" />
        </div>
      </div>
    </div>
  );
}
