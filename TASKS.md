# TASKS.md — Valra.gg

## Controle de sessões

| # | Data | Task | Observações |
|---|------|------|-------------|
| 1 | 2026-04-27 | Task #1 — Setup Inicial do Projeto | `app/` já estava em `src/app/` quando a task foi executada |
| 2 | 2026-04-27 | Task #2 — Sidebar e Dados Mock | lucide-react instalado; 4 arquivos de mock criados; Sidebar com glassmorphism |

---

## Legenda de status

| Símbolo | Significado |
|---------|-------------|
| `[ ]` | Pendente |
| `[~]` | Em progresso |
| `[x]` | Concluída |

---

## Backlog

### #1 · Setup Inicial do Projeto `[x]`
> ← depende de: nenhum

- [x] Remover assets padrão da pasta `public/` — deletar `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`
- [x] Mover `app/` para `src/app/` e `app/globals.css` para `src/app/globals.css`
- [x] Atualizar `tsconfig.json` — `paths` agora aponta para `./src/*`
- [x] Atualizar metadata em `src/app/layout.tsx` — title `"Valra.gg"` e description real do produto
- [x] Configurar paleta de cores em `src/app/globals.css` via CSS custom properties:
  - `--color-bg`: `#111111` (preto web padrão)
  - `--color-red`: `#FF4655` (vermelho Valorant)
  - `--color-navy`: `#0D1B2A` (azul marinho escuro)
  - Registrar as cores no `@theme` do Tailwind v4
- [x] Criar grupo de rotas `src/app/(public)/` com `layout.tsx` próprio — rotas sem autenticação
- [x] Criar grupo de rotas `src/app/(private)/` com `layout.tsx` próprio — rotas protegidas
- [x] Mover `src/app/page.tsx` para `src/app/(public)/page.tsx` como home pública com conteúdo limpo
- [x] Remover comentários e config vazia de `next.config.ts`

### #2 · Sidebar e Dados Mock `[x]`
> ← depende de: #1

- [x] Instalar `lucide-react`
- [x] Criar `src/data/navigation.ts` — itens de navegação com ícones Lucide
- [x] Criar `src/data/matches.ts` — mock de partidas VCT
- [x] Criar `src/data/pro-settings.ts` — mock de configurações de pro-players
- [x] Criar `src/data/player.ts` — mock de stats do jogador
- [x] Criar componente `Sidebar` em `src/components/layout/Sidebar/` (index.tsx + types.ts)
- [x] Atualizar `src/app/(public)/layout.tsx` para incluir a Sidebar
- [x] Atualizar `src/app/(private)/layout.tsx` para incluir a Sidebar

---

> **Como usar este arquivo:**
> Para executar uma task: `/task-manager run #N`
> Para adicionar nova task: `/task-manager add <descrição>`
> Para ver o status geral: `/task-manager status`
