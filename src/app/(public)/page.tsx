'use client'

import { Calendar, Globe, Gamepad2 } from 'lucide-react'
import { CardTopRanking } from '@/components/ui/CardTopRanking'
import { SearchBar } from '@/components/ui/SearchBar'

const topPlayers = [
  { playerName: 'TenZ',   tag: 'SEN',  place: 1, region: 'NA',   rating: 643, avatar: '/images/avatar/yoru.png' },
  { playerName: 'aspas',  tag: 'LOUD', place: 1, region: 'BR',   rating: 621, avatar: '/images/avatar/yoru.png' },
  { playerName: 'Derke',  tag: 'FNC',  place: 1, region: 'EU',   rating: 577, avatar: '/images/avatar/yoru.png' },
]

const mockNews = [
  { id: 1, title: 'VALORANT Patch Notes 12.07: Parceria com Discord, Reformulação de Configurações...', time: '1 sem. atrás', color: '#1a2a1a' },
  { id: 2, title: 'VALORANT Patch Notes 12.06: Mudanças no Waylay, Correções de Bugs e Mais',          time: '3 sem. atrás', color: '#1a1a2a' },
  { id: 3, title: 'Resgate seu Avatar Frame "Doomlord" agora!',                                        time: '3 sem. atrás', color: '#2a1a1a' },
]

export default function HomePage() {
  return (
    <div className="relative flex flex-col flex-1 overflow-hidden min-h-screen">

      {/* ── Background hero ──────────────────────────────────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/banners/banner-hero.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ filter: 'blur(2px) brightness(0.3)', transform: 'scale(1.04)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent" />

      {/* ── Conteúdo ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1">

        {/* ── Corpo: hero center + painel de news ────────────────────────── */}
        <div className="flex flex-1 min-h-0">

          {/* ── Centro: branding + search + top 3 ────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 pb-8">

            {/* Branding */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-4">
                {/* Logo V */}
                <div className="w-12 h-12 rounded-xl bg-[#FF4655] flex items-center justify-center shadow-[0_4px_20px_rgba(255,70,85,0.4)]">
                  <span className="text-white font-black text-2xl leading-none select-none">V</span>
                </div>
                <h1 className="text-white font-black text-4xl tracking-tight select-none">
                  VALRA<span className="text-[#FF4655]">.GG</span>
                </h1>
              </div>
              <p className="text-gray-400 text-sm font-medium tracking-wide mt-1">
                Estatísticas detalhadas e Leaderboards de Valorant
              </p>
            </div>

            {/* Search bar centralizada */}
            <div className="w-full max-w-xl">
              <SearchBar
                placeholder="Buscar Agente ou Jogador, ex: player#BR1 ou Sage"
                className="h-12 bg-white/90 border-white/90 backdrop-blur-sm rounded-xl"
              />
            </div>

            {/* Divider "ou" */}
            <div className="flex items-center gap-4 w-full max-w-xl -my-2">
              <div className="flex-1 h-px bg-white/[0.12]" />
              <span className="text-gray-500 text-xs font-medium">ou</span>
              <div className="flex-1 h-px bg-white/[0.12]" />
            </div>

            {/* Botão de login Riot ID */}
            <button
              type="button"
              className="flex items-center justify-center gap-2.5 h-12 px-10 rounded-xl bg-[#FF4655] hover:bg-[#e03e4d] text-white font-bold text-sm transition-all duration-200 shadow-[0_4px_24px_rgba(255,70,85,0.45)] w-full max-w-xl cursor-pointer"
            >
              <Gamepad2 size={18} />
              Entrar com Riot ID
            </button>
            <p className="text-[11px] text-gray-600 -mt-5">
              *Ao entrar, você reconhece que seu perfil se torna público.{' '}
              <span className="underline cursor-pointer hover:text-gray-400 transition-colors">Tornar privado</span>.
            </p>

            {/* Global Top 3 */}
            <div className="flex flex-col items-center gap-5 mt-4">
              <p className="text-white font-bold text-lg tracking-wide drop-shadow-lg">
                Top 3 Global
              </p>
              <div className="flex gap-5 items-end">
                {topPlayers.map((player) => (
                  <CardTopRanking
                    key={player.region}
                    playerName={player.playerName}
                    tag={player.tag}
                    place={player.place}
                    region={player.region}
                    rating={player.rating}
                    avatar={player.avatar}
                    className="w-[195px]"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Painel direito: Notícias ──────────────────────────────────── */}
          <div className="w-[275px] shrink-0 flex flex-col bg-[#0a0d14]/85 backdrop-blur-lg border-l border-white/[0.06]">

            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Notícias & Atualizações
              </p>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-white/[0.05]">
              {mockNews.map((news) => (
                <div
                  key={news.id}
                  className="flex items-start gap-3 px-4 py-4 hover:bg-white/[0.04] cursor-pointer transition-colors duration-150"
                >
                  <div
                    className="w-[72px] h-[52px] rounded-lg shrink-0"
                    style={{ backgroundColor: news.color }}
                  />
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <p className="text-xs text-gray-300 leading-snug line-clamp-3 font-medium">
                      {news.title}
                    </p>
                    <p className="text-[10px] text-gray-600">{news.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.06] p-4">
              <button
                type="button"
                className="w-full py-2.5 rounded-xl border border-white/[0.10] text-sm font-semibold text-gray-400 hover:bg-white/[0.06] hover:text-white transition-all duration-200"
              >
                Ver Tudo
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom stats bar ────────────────────────────────────────────── */}
        <div className="flex items-center gap-10 px-8 py-4 bg-black/50 backdrop-blur-sm border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
              <Calendar size={15} className="text-gray-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Temporada termina em</span>
              <span className="text-white font-bold text-sm leading-tight">1d 7h</span>
            </div>
          </div>

          <div className="w-px h-6 bg-white/[0.08]" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
              <Globe size={15} className="text-gray-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Jogadores rastreados</span>
              <span className="text-white font-bold text-sm leading-tight">143.460.156</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
