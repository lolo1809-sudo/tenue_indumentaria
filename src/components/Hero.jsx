import { useState, useEffect } from "react";

export default function Hero() {
  return (
    <div id="inicio" className="w-full flex flex-col bg-[var(--color-bg-secondary)] pt-10 md:pt-14">
      {/* Título */}
      <div className="w-full pt-12 pb-0 md:pb-0 flex flex-col items-center justify-center bg-[var(--color-bg-custom)] select-none">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.15em] text-[var(--color-text-primary)] font-sans text-center">KALMA</h1>
        <div className="flex items-center gap-4 mt-3 w-full max-w-[420px] px-6">
          <span className="flex-1 h-[1px] bg-[var(--color-accent)]/40" />
          <span className="text-xs md:text-sm tracking-[0.45em] text-[var(--color-accent)] font-medium uppercase pl-[0.45em]">Indumentaria</span>
          <span className="flex-1 h-[1px] bg-[var(--color-accent)]/40" />
        </div>
      </div>
    </div>
  );
}
