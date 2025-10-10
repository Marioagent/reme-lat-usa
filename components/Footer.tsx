import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">💧 REME-LAT-USA</h3>
            <p className="text-gray-300">Compara remesas LAT-USA en tiempo real</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Producto</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#calculadora" className="hover:text-white transition">
                  Calculadora
                </a>
              </li>
              <li>
                <a href="#comparador" className="hover:text-white transition">
                  Comparador
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Alertas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Países</h4>
            <ul className="space-y-2 text-gray-300">
              <li>🌎 23 Países Latinoamericanos</li>
              <li>🇲🇽 México</li>
              <li>🇻🇪 Venezuela</li>
              <li>🇨🇴 Colombia</li>
              <li>🇦🇷 Argentina</li>
              <li>🇧🇷 Brasil</li>
              <li>+ 17 más</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition">
                  Términos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>© 2025 REME-LAT-USA. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">Comparador de remesas LAT ↔ USA con datos en tiempo real</p>
        </div>
      </div>
    </footer>
  );
}
