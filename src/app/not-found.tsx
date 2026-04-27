import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center gap-6 max-w-md">

        {/* Código */}
        <div className="relative select-none">
          <span className="text-[120px] font-black leading-none text-white/[0.04]">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-5xl font-black text-white tracking-tight">
            4<span className="text-[#FF4655]">0</span>4
          </span>
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Página não encontrada
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            A rota que você tentou acessar não existe ou foi removida.
          </p>
        </div>

        {/* Divisor */}
        <div className="w-12 h-px bg-white/[0.08]" />

        {/* Ação */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4655] text-white text-sm font-semibold transition-all duration-200 hover:bg-[#e03e4d] hover:shadow-[0_4px_20px_rgba(255,70,85,0.35)]"
        >
          Voltar para Home
        </Link>

        {/* Brand */}
        <p className="text-[11px] text-gray-700 tracking-widest font-medium">
          <span className="text-[#FF4655]">VALRA</span>.GG
        </p>
      </div>
    </div>
  )
}
