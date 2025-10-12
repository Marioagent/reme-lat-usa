"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import AmericasGlobe from "./AmericasGlobe";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <AmericasGlobe />
            <div className="flex flex-col gap-0">
              <span className="font-bold text-xl leading-none" style={{ color: '#000000' }}>
                REME-LAT-USA
              </span>
              <span className="text-base font-bold leading-none mt-1" style={{ color: '#3B82F6' }}>
                Mac
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <a href="#inicio" className="font-medium transition hover:opacity-70" style={{ color: '#000000' }}>
              Inicio
            </a>
            <a href="#calculadora" className="font-medium transition hover:opacity-70" style={{ color: '#000000' }}>
              Calculadora
            </a>
            <a href="#comparador" className="font-medium transition hover:opacity-70" style={{ color: '#000000' }}>
              Comparador
            </a>
            <Link href="/dashboard" className="font-medium transition hover:opacity-70" style={{ color: '#000000' }}>
              Dashboard
            </Link>
          </div>

          <div className="hidden md:block">
            <Link
              href="/auth"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition"
            >
              Ingresar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden hover:text-blue-600"
            style={{ color: '#000000' }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <a href="#inicio" className="block py-2 font-medium transition hover:opacity-70" style={{ color: '#000000' }}>
              Inicio
            </a>
            <a href="#calculadora" className="block py-2 font-medium transition hover:opacity-70" style={{ color: '#000000' }}>
              Calculadora
            </a>
            <a href="#comparador" className="block py-2 font-medium transition hover:opacity-70" style={{ color: '#000000' }}>
              Comparador
            </a>
            <Link href="/dashboard" className="block py-2 font-medium transition hover:opacity-70" style={{ color: '#000000' }}>
              Dashboard
            </Link>
            <Link
              href="/auth"
              className="block w-full text-center bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition mt-4"
            >
              Ingresar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
