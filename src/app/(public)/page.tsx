'use client'

import { Calendar, Globe, Gamepad2, ArrowRight } from 'lucide-react'
import { CardTopRanking } from '@/components/ui/CardTopRanking'
import { SearchBar } from '@/components/ui/SearchBar'

const topPlayers = [
  { playerName: 'TenZ',   tag: 'SEN',  place: 1, region: 'NA',   rating: 643, avatar: '/images/avatar/yoru.png' },
  { playerName: 'aspas',  tag: 'LOUD', place: 1, region: 'BR',   rating: 621, avatar: '/images/avatar/yoru.png' },
  { playerName: 'Derke',  tag: 'FNC',  place: 1, region: 'EU',   rating: 577, avatar: '/images/avatar/yoru.png' },
]

const mockNews = [
  {
    id: 1,
    title: 'Modo de Jogo VALORANT Skirmish Ascension: Tudo que você precisa saber',
    time: '1h atrás',
    thumb: '/images/banners/banner-hero.jpg',
  },
  {
    id: 2,
    title: 'VALORANT Patch Notes 12.07: Parceria com Discord, Reformulação de Configurações...',
    time: '1 sem. atrás',
    thumb: '/images/banners/banner-hero.jpg',
  },
  {
    id: 3,
    title: 'VALORANT Patch Notes 12.06: Mudanças no Waylay, Correções de Bugs e Mais',
    time: '3 sem. atrás',
    thumb: '/images/banners/banner-hero.jpg',
  },
  {
    id: 4,
    title: 'Resgate seu Avatar Frame "Doomlord" agora!',
    time: '3 sem. atrás',
    thumb: '/images/banners/banner-hero.jpg',
  },
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

        {/* ── Centro: branding + search + top 3 ──────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">

          {/* Branding */}
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/logo-full.png"
              alt="Valra.gg"
              width={280}
              height={60}
              className="h-20 w-auto object-contain drop-shadow-lg"
            />
            <p className="text-gray-400 text-sm font-medium tracking-wide">
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
                  className="w-[280px]"
                />
              ))}
            </div>
          </div>
        </div>
        {/* ── Checkpoint — Últimas notícias ───────────────────────────────── */}
        <div className="flex items-center justify-center bg-[#1a1520] border-t border-white/[0.06]">

          {/* Label à esquerda */}
          <div className="shrink-0 flex flex-col gap-1 px-7 py-5 border-r border-white/[0.08] min-w-[220px]">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/logo-v.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
              <span className="text-white font-black text-base uppercase tracking-wider">News</span>
            </div>
            <p className="text-gray-500 text-xs leading-snug">
              Valorant: notícias,<br />atualizações e mais!
            </p>
          </div>

          {/* Cards de notícias — scroll horizontal */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-stretch gap-0 min-w-max">
              {mockNews.map((news) => (
                <div
                  key={news.id}
                  className="flex items-center gap-4 px-5 py-4 border-r border-white/[0.06] hover:bg-white/[0.04] cursor-pointer transition-colors duration-150 max-w-[320px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={news.thumb}
                    alt=""
                    width={100}
                    height={68}
                    className="w-[100px] h-[68px] rounded-lg object-cover shrink-0"
                  />
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <p className="text-sm text-gray-200 leading-snug line-clamp-2 font-semibold">
                      {news.title}
                    </p>
                    <p className="text-xs text-gray-600">{news.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botão Ver Tudo */}
          <div className="shrink-0 px-5">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.10] text-sm font-semibold text-gray-400 hover:bg-white/[0.06] hover:text-white transition-all duration-200 whitespace-nowrap"
            >
              Ver Tudo
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
