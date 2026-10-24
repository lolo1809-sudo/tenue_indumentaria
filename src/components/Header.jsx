import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-bg-custom/90 backdrop-blur-md px-6 py-4 border-b border-border">
      <div className="relative flex items-center justify-between max-w-6xl mx-auto">
        {/* Lado izquierdo en móvil/tablet: Menú hamburguesa (cambiado a md:) */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menú" className="text-text-primary hover:text-accent focus:outline-none p-1 cursor-pointer transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <span className="text-text-primary font-bold text-sm tracking-wider uppercase">Menú</span>
        </div>

        {/* Navegación Desktop (centrada, cambia a md:) */}
        <nav className="hidden md:flex items-center justify-center gap-10 w-full">
          <a href="/#inicio" className="text-base md:text-lg font-bold text-text-primary uppercase tracking-[0.2em] transition-colors duration-200 hover:!text-accent">
            Inicio
          </a>
          <a href="/#ofertas" className="text-base md:text-lg font-bold text-text-primary uppercase tracking-[0.2em] transition-colors duration-200 hover:!text-accent">
            Ofertas
          </a>
          <a href="/#categorias" className="text-base md:text-lg font-bold text-text-primary uppercase tracking-[0.2em] transition-colors duration-200 hover:!text-accent">
            Categorías
          </a>
          <a href="/#ubicacion" className="text-base md:text-lg font-bold text-text-primary uppercase tracking-[0.2em] transition-colors duration-200 hover:!text-accent">
            Ubicación
          </a>
        </nav>

        {/* Ícono de Carrito más grande (alineado a la derecha) */}
        <div className="md:absolute md:right-0 flex items-center">
          <Link to="/carrito" aria-label="Ver carrito de compras" className="p-1.5 text-text-primary hover:text-accent transition-colors duration-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Menú desplegable Móvil / Tablets (cambiado a md:) */}
      {isOpen && (
        <nav className="md:hidden flex flex-col items-center gap-4 pt-4 pb-2 border-t border-border mt-3">
          <a href="/#inicio" onClick={() => setIsOpen(false)} className="text-sm font-bold text-text-primary uppercase tracking-[0.2em] transition-colors duration-200 hover:!text-accent">
            Inicio
          </a>
          <a href="/#ofertas" onClick={() => setIsOpen(false)} className="text-sm font-bold text-text-primary uppercase tracking-[0.2em] transition-colors duration-200 hover:!text-accent">
            Ofertas
          </a>
          <a href="/#categorias" onClick={() => setIsOpen(false)} className="text-sm font-bold text-text-primary uppercase tracking-[0.2em] transition-colors duration-200 hover:!text-accent">
            Categorías
          </a>
          <a href="/#ubicacion" onClick={() => setIsOpen(false)} className="text-sm font-bold text-text-primary uppercase tracking-[0.2em] transition-colors duration-200 hover:!text-accent">
            Ubicación
          </a>
        </nav>
      )}
    </header>
  );
}
