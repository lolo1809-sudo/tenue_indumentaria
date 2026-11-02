export default function Hero({ local }) {
  const nombre = local?.nombre || "DEMO";

  // Si el nombre supera los 12 caracteres, reducimos la escala para evitar desbordes
  const esLargo = nombre.length > 12;

  const clasesTamano = esLargo ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[0.08em]" : "text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] tracking-[0.1em]";

  return (
    <div id="inicio" className="w-full flex flex-col bg-bg-custom pt-16 md:pt-20">
      {/* Título */}
      <div className="w-full pt-4 md:pt-6 pb-0 flex flex-col items-center justify-center bg-bg-custom select-none px-4">
        <h1 className={`w-full max-w-6xl uppercase text-text-primary text-center break-words font-caveat leading-none ${clasesTamano}`}>{nombre}</h1>

        <div className="flex items-center gap-4 mt-4 w-full max-w-[420px] px-6">
          <span className="flex-1 h-[1px] bg-accent/40" />
          <span className="text-xs md:text-sm tracking-[0.45em] text-accent font-medium uppercase pl-[0.45em]">Indumentaria</span>
          <span className="flex-1 h-[1px] bg-accent/40" />
        </div>
      </div>
    </div>
  );
}
